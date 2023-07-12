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
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, handleChange, errors, setFieldValue }) => (
        <Form id="practiceSession-form" name="practiceSession-form">
          <Box
            id="inside-form-box"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Autocomplete
              id="autocomplete"
              value={selectedPiece || {}}
              options={suggestions}
              sx={{
                width: "100%",
              }}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onInputChange={(event, value) => handlePieceSearch(value)}
              onChange={async (event, newValue) => {
                handlePieceSelection(event, newValue);
                if (newValue) {
                  const response = await axios.get(
                    `http://localhost:3001/pieces/piece/${newValue._id}`,
                    {
                      headers: { authorization: cookies.access_token },
                    }
                  );

                  const pieceData = response.data;

                  setFieldValue("length", pieceData.length);
                  setFieldValue("excerpts", pieceData.excerpts);
                  setFieldValue("composer", pieceData.composer);
                  setFieldValue("piece", pieceData._id)
                } else {
                  setFieldValue("length", "");
                  setFieldValue("excerpts", []);
                  setFieldValue("composer", "");
                  setFieldValue("piece", {})
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Piece" variant="outlined" />
              )}
            />

            <Field
              name="composer"
              as={TextField}
              label="Composer"
              sx={{ width: "100%" }}
            />
            <Field name="dateOfExecution">
              {({ field, form }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Date and Time of Execution"
                    value={field.value}
                    onChange={(value) => {
                      console.log(
                        "dateOfExecution before DateTimePicker:",
                        field.value
                      );
                      console.log(
                        "Is dateOfExecution before DateTimePicker valid?",
                        !isNaN(new Date(field.value))
                      );


                      form.setFieldValue(field.name, value);
                    }}
                    sx={{ width: "100%" }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )}
            </Field>
            <Field
              name="name"
              as={TextField}
              label="Name of session"
              sx={{ width: "100%" }}
            />
            <InputLabel>Total Session Length:</InputLabel>
            <Box>
              <Grid container>
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
                    <Grid item xs={12} sm={4} key={excerptIndex} sx={{}}>
                      <Grid item xs={12}>
                        <Field
                          name={`excerpts.${excerptIndex}.location`}
                          as={TextField}
                          label="location"
                          sx={{ width: "100%" }}
                        />
                        <Field
                          name={`excerpts.${excerptIndex}.notes`}
                          as={TextField}
                          multiline
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
                              <Grid container>
                                <Grid item xs={12} sm={4}>
                                  <Field
                                    name={`excerpts.${excerptIndex}.timeToSpend.hours`}
                                    as={TextField}
                                    type="number"
                                    label="hours"
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Field
                                    name={`excerpts.${excerptIndex}.timeToSpend.minutes`}
                                    as={TextField}
                                    type="number"
                                    label="minutes"
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Field
                                    name={`excerpts.${excerptIndex}.timeToSpend.seconds`}
                                    as={TextField}
                                    type="number"
                                    label="seconds"
                                    fullWidth
                                  />
                                </Grid>
                              </Grid>
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
