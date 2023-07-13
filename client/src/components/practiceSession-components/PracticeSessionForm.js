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
  Typography,
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
              width: "100%",
              margin: "2rem 0",
            }}
          >
            <Field
              name="name"
              as={TextField}
              label="Name of session"
              sx={{ width: "100%" }}
            />
            <Box sx={{ width: "60%", margin: "1rem auto" }}>
              <InputLabel sx={{ textAlign: "center" }}>
                Total Session Length:
              </InputLabel>
              <Grid
                container
                sx={{ justifyContent: "center", margin: "auto 1rem" }}
              >
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Field
                      name="totalSessionLength.hours"
                      as={TextField}
                      type="number"
                      label="hr"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Field
                      name="totalSessionLength.minutes"
                      as={TextField}
                      type="number"
                      label="min"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Field
                      name="totalSessionLength.seconds"
                      as={TextField}
                      type="number"
                      label="sec"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

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
                  setFieldValue("composer", pieceData.composer);
                  setFieldValue("piece", {
                    _id: pieceData._id,
                    excerpts: pieceData.excerpts,
                  });
                } else {
                  setFieldValue("length", "");
                  setFieldValue("composer", "");
                  setFieldValue("piece", {});
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

            <FieldArray name="excerpts">
              {({ push, remove }) => (
                <Box
                  id="excerpts-box"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "auto 1rem",
                  }}
                >
                  <Grid container id="grid-outside-excerpts">
                    {values.piece.excerpts.map((excerpt, excerptIndex) => (
                      <Grid item xs={12} sm={4} key={excerptIndex}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            margin: "1rem auto",
                            width: "100%",
                          }}
                        >
                          <Grid item xs={12} sm={6} key={excerptIndex} sx={{}}>
                            <Grid item xs={12}>
                              <Typography
                                variant={"h6"}
                                sx={{ textAlign: "center" }}
                              >
                                Excerpt {excerptIndex + 1}:
                              </Typography>
                              <Field
                                name={`piece.excerpts.${excerptIndex}.location`}
                                as={TextField}
                                multiline
                                label="location"
                                sx={{ width: "100%" }}
                              />
                              <Field
                                name={`piece.excerpts.${excerptIndex}.notes`}
                                as={TextField}
                                multiline
                                label="notes"
                                sx={{ width: "100%" }}
                              />
                              <Field
                                name={`piece.excerpts.${excerptIndex}.repetitions`}
                                type="number"
                                as={TextField}
                                label="Repetitions"
                                sx={{ width: "100%" }}
                              />
                              <FieldArray
                                name={`piece.excerpts.${excerptIndex}.timeToSpend`}
                              >
                                {() => (
                                  <Box
                                    name="timeToSpend-box"
                                    sx={{
                                      width: "100%",
                                      margin: "1rem auto",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                    }}
                                  >
                                    <InputLabel>Time to Spend:</InputLabel>
                                    <Grid container>
                                      <Grid item xs={12} md={4}>
                                        <Field
                                          name={`piece.excerpts.${excerptIndex}.timeToSpend.hours`}
                                          as={TextField}
                                          type="number"
                                          label="hr"
                                          fullWidth
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={4}>
                                        <Field
                                          name={`piece.excerpts.${excerptIndex}.timeToSpend.minutes`}
                                          as={TextField}
                                          type="number"
                                          label="min"
                                          fullWidth
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={4}>
                                        <Field
                                          name={`piece.excerpts.${excerptIndex}.timeToSpend.seconds`}
                                          as={TextField}
                                          type="number"
                                          label="sec"
                                          fullWidth
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                )}
                              </FieldArray>
                              <Box
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => remove(excerptIndex)}
                                  sx={{ margin: "1rem 0" }}
                                >
                                  Remove excerpt
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          push({
                            location: "",
                            notes: "",
                            repetitions: 0,
                            timeToSpend: { hours: 0, minutes: 0, seconds: 0 },
                          })
                        }
                        sx={{ margin: "1rem 0" }}
                      >
                        Add excerpt
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "2rem 0",
                      }}
                    >
                      <Button type="submit" variant="contained" color="success">
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </FieldArray>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
