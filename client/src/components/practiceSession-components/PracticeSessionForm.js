import React from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import {
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
import axios from "axios";



export const PracticeSessionForm = ({
  initialValues,
  validationSchema,
  id,
  practicePlan,
  cookies,
  navigate,
  selectedPiece,
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
      {({ values, handleChange, errors }) => (
        <Form id="practiceSession-form" name="practiceSession-form">
          <Box
            id="inside-form-box"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Field
              id="piece-field"
              name="piece"
              as={TextField}
              label="Piece"
              sx={{
                width: "100%",
              }}
              value={
                selectedPiece
                  ? `${selectedPiece.name} by ${selectedPiece.composer}`
                  : ""
              }
              multiline
            />

            <FieldArray name="excerpts">
              {({ push, remove }) => (
                <Grid
                  containera
                  sx={{
                    width: "100%",
                    border: "1px solid black",
                    display: "flex",
                  }}
                >
                  {values.excerpts.map((excerpt, excerptIndex) => (
                    <Grid item xs={12} sm={4} key={excerptIndex}>
                      <Grid item xs={12}>
                        <Field
                          name={`excerpts.${excerptIndex}.excerpt`}
                          as={TextField}
                          label={`Excerpt ${excerptIndex + 1}`}
                          sx={{ width: "100%" }}
                        />
                        <Field
                          name={`excerpts.${excerptIndex}.location`}
                          type="number"
                          as={TextField}
                          label="location"
                          sx={{ width: "100%" }}
                        />
                        <Field
                          name={`excerpts.${excerptIndex}.notes`}
                          type="number"
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

                        <Button onClick={() => remove(excerptIndex)}>
                          Remove excerpt
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Grid item xs={12} sx={{ width: "100%" }}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => push({ excerpt: "", repetitions: 0 })}
                      >
                        Add excerpt
                      </Button>
                    </Grid>
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
