import React from "react";
import { Formik, Field, Form, FieldArray} from "formik";
import {
  Autocomplete,
  TextField,
  Box,
  Grid,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
} from "@mui/material";

// components/FormikDatePicker.tsx
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";



export const PracticeSessionForm = ({
  initialValues,
  validationSchema,
  id,
  practicePlan,
  cookies,
  navigate,
  selectedPiece,
  suggestions,
  handlePieceSearch,
  handlePieceSelection,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (id) {
            await axios.put(
              `http://localhost:3001/practiceSessions/practiceSession/${id}`,
              { ...values },
              {
                headers: { authorization: cookies.access_token },
              }
            );
            alert("practicePlan updated");
            navigate("/practicePlans");
          } else {
            await axios.post(
              `http://localhost:3001/practiceSessions`,
              { ...values },
              {
                headers: { authorization: cookies.access_token },
              }
            );
            alert("practiceSession created");
            navigate("/practiceSessions");
          }
        } catch (error) {
          alert("I'm sorry, there's an error in submitting this form");
          console.log("error", error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, errors, setFieldValue }) => (
        <Form id="practiceSession-form" name="practiceSession-form">
          <Box
            id="inside-form-box"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Autocomplete
              id="autocomplete"
              value={selectedPiece}
              options={suggestions}
              sx={{
                width: "100%",
              }}
              getOptionLabel={(option) => option.name}
              onInputChange={(event, value) => handlePieceSearch(value)}
              onChange={async (event, newValue) => {
                console.log("Selected piece before change:", selectedPiece); // Add logging
                console.log("New value received:", newValue); // Add logging
                handlePieceSelection(event, newValue);
                const response = await axios.get(
                  `http://localhost:3001/pieces/piece/${newValue._id}`,
                  {
                    headers: { authorization: cookies.access_token },
                  }
                );

                const pieceData = response.data;

                console.log("Piece data received:", pieceData); // Add logging
                setFieldValue("length", pieceData.length);
                setFieldValue("excerpts", pieceData.excerpts);
                console.log("Selected piece after change:", selectedPiece); // Add logging
              }}
              renderInput={(params) => (
                <TextField {...params} label="Piece" variant="outlined" />
              )}
              multiline
            />
            <Field name="dateOfExecution">
              {({ field, form }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Date and Time of Execution"
                    value={field.value}
                    onChange={(value) => {
                      form.setFieldValue(field.name, value);
                    }}
                    sx={{ width: "100%" }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )}
            </Field>
            <Field
              name={`values.name`}
              as={TextField}
              label="Name of session"
              sx={{ width: "100%" }}
            />
            <InputLabel>Total Session Length:</InputLabel>
            <Box>
              <Grid container center>
                <Grid item xs={12} sm={4}>
                  <Field
                    name="totalSessionLength.hours"
                    as={TextField}
                    type="number"
                    label="Hours"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    name="totalSessionLength.minutes"
                    as={TextField}
                    type="number"
                    label="Minutes"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    name="totalSessionLength.seconds"
                    as={TextField}
                    type="number"
                    label="Seconds"
                  />
                </Grid>
              </Grid>
            </Box>
            <FieldArray name="excerpts">
              {({ push, remove }) => (
                <Grid
                  container
                  sx={{
                    width: "100%",
                    display: "flex",
                  }}
                  spacing={4}
                >
                  {values.excerpts.map((excerpt, excerptIndex) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={excerptIndex}
                      sx={{ }}
                    >
                      <Grid item xs={12}>
                        <Field
                          name={`excerpts.${excerptIndex}.excerpt`}
                          as={TextField}
                          label={`Excerpt ${excerptIndex + 1}`}
                          sx={{ width: "100%" }}
                        />
                        <Field
                          name={`excerpts.${excerptIndex}.location`}
                          as={TextField}
                          label="location"
                          sx={{ width: "100%" }}
                        />
                        <Field
                          name={`excerpts.${excerptIndex}.notes`}
                          as={TextField}
                          label="notes"
                          sx={{ width: "100%" }}
                        />
                        <Field
                          name={`excerpts.${excerptIndex}.repetitions`}
                          type="number"
                          as={TextField}
                          label="Repetitions"
                          sx={{ width: "100%" }}
                        />
                        <FieldArray
                          name={`excerpts.${excerptIndex}.timeToSpend`}
                        >
                          {() => (
                            <Box name="timeToSpend-box">
                              <InputLabel>Time to Spend:</InputLabel>
                              <Field
                                name={`excerpts.${excerptIndex}.timeToSpend.hours`}
                                as={TextField}
                                type="number"
                                label="hours"
                                fullWidth
                              />
                              <Field
                                name={`excerpts.${excerptIndex}.timeToSpend.minutes`}
                                as={TextField}
                                type="number"
                                label="minutes"
                                fullWidth
                              />
                              <Field
                                name={`excerpts.${excerptIndex}.timeToSpend.seconds`}
                                as={TextField}
                                type="number"
                                label="seconds"
                                fullWidth
                              />
                            </Box>
                          )}
                        </FieldArray>

                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => remove(excerptIndex)}
                        >
                          Remove excerpt
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => push({ excerpt: "", repetitions: 0 })}
                    >
                      Add excerpt
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="success">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              )}
            </FieldArray>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
