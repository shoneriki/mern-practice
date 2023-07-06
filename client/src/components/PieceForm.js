import React from 'react'
import { Formik, Form, Field, FieldArray } from "formik";


import {
  Box,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Typography,
} from "@mui/material";

import axios from "axios";

export const PieceForm = ({
  seedData,
  validationSchema,
  // userID,
  // id,
  cookies,
  navigate,
}) => {
  return (
    <Box
      spacing={4}
      sx={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Formik
        initialValues={seedData}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("something is wrong here?");
          try {
            console.log("you are going into onSubmit");
            await axios.post(
              `http://localhost:3001/pieces`,
              { ...values },
              {
                headers: { authorization: cookies.access_token },
              }
            );
            alert("piece created");
            navigate("/pieces");
          } catch (error) {
            alert("I'm sorry, there's an error in submitting this form");
            console.log("error", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, errors }) => {
          return (
            <Grid item name="outer-container-in-Formik" xs={12}>
              <Form>
                <Grid name="grid-inside-form" item xs={12} sm={8} md={6}>
                  <Typography variant={"h6"}>Add a piece</Typography>
                  <Field
                    component={TextField}
                    label="Name"
                    name="name"
                    placeholder="Piece Name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <Field
                    component={TextField}
                    label="Composer"
                    name="composer"
                    placeholder="composer"
                    value={values.composer}
                    onChange={handleChange}
                  />

                  <Grid name="grid-length" item xs={12} sm={6} md={4}>
                    <InputLabel htmlFor={`piece-lengthInSeconds`}>
                      Length of Piece:
                    </InputLabel>
                    <Grid name="hours" item xs={12}>
                      <Field
                        component={TextField}
                        type="number"
                        label="hours"
                        id={`piece-hours`}
                        name="length.hours"
                        min="1"
                        max="10"
                        value={values.length.hours}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid name="minute" item xs={12}>
                      <Field
                        component={TextField}
                        type="number"
                        label="minutes"
                        id={`piece-minutes`}
                        name="length.minutes"
                        value={values.length.minutes}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid name="seconds" item xs={12}>
                      <Field
                        component={TextField}
                        type="number"
                        label="seconds"
                        id={`piece-seconds`}
                        name="length.seconds"
                        value={values.length.seconds}
                      />
                    </Grid>
                  </Grid>
                  <FieldArray
                    name={`excerpts`}
                    render={(excerptArrayHelpers) => (
                      <Box>
                        {values.excerpts.map((excerpt, excerptIndex) => (
                          <Grid item xs={12} sm={6} md={4} key={excerptIndex}>
                            <Field
                              component={TextField}
                              label="Location"
                              name={`excerpts.${excerptIndex}.location`}
                              placeholder="Location"
                              value={excerpt.location}
                              onChange={handleChange}
                            />
                            <Field
                              component={TextField}
                              label="Notes"
                              name={`excerpts.${excerptIndex}.notes`}
                              placeholder="Notes"
                              value={excerpt.notes}
                              onChange={handleChange}
                            />
                            <Field
                              component={TextField}
                              type="number"
                              label="Repetitions"
                              name={`excerpts.${excerptIndex}.repetitions`}
                              value={excerpt.repetitions}
                              onChange={handleChange}
                            />
                            <Typography>Time To Spend:</Typography>
                            <Field
                              component={TextField}
                              type="number"
                              label="hours"
                              name={`excerpts.${excerptIndex}.timeToSpend.hours`}
                              value={excerpt.timeToSpend.hours}
                              onChange={handleChange}
                            />
                            <Field
                              component={TextField}
                              type="number"
                              label="minutes"
                              name={`excerpts.${excerptIndex}.timeToSpend.minutes`}
                              value={excerpt.timeToSpend.minutes}
                              onChange={handleChange}
                            />
                            <Field
                              component={TextField}
                              type="number"
                              label="seconds"
                              name={`excerpts.${excerptIndex}.timeToSpend.seconds`}
                              value={excerpt.timeToSpend.seconds}
                              onChange={handleChange}
                            />
                            <FieldArray
                              name={`excerpts.${excerptIndex}.tempi`}
                              render={(tempoArrayHelpers) => (
                                <Box>
                                  {values.excerpts[excerptIndex].tempi.map(
                                    (tempo, tempoIndex) => (
                                      <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={tempoIndex}
                                      >
                                        <Field
                                          component={TextField}
                                          type="number"
                                          label="BPM"
                                          name={`excerpts.${excerptIndex}.tempi.${tempoIndex}.bpm`}
                                          value={tempo.bpm}
                                          onChange={handleChange}
                                        />
                                        <Field
                                          component={TextField}
                                          label="Notes"
                                          name={`excerpts.${excerptIndex}.tempi.${tempoIndex}.notes`}
                                          value={tempo.notes}
                                          onChange={handleChange}
                                        />
                                        <Button
                                          variant="contained"
                                          color="error"
                                          onClick={() =>
                                            tempoArrayHelpers.remove(tempoIndex)
                                          }
                                        >
                                          Remove Tempo
                                        </Button>
                                      </Grid>
                                    )
                                  )}
                                  <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      tempoArrayHelpers.push({
                                        notes: "",
                                        bpm: 60,
                                      })
                                    }
                                  >
                                    Add a Tempo
                                  </Button>
                                </Box>
                              )}
                            />
                          </Grid>
                        ))}
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            excerptArrayHelpers.push({
                              location: "",
                              notes: "",
                              repetitions: 0,
                              timeToSpend: {
                                hours: 0,
                                minutes: 0,
                                seconds: 0,
                              },
                              tempi: [
                                {
                                  notes: "",
                                  bpm: 60,
                                },
                              ],
                            })
                          }
                        >
                          Add an Excerpt
                        </Button>
                      </Box>
                    )}
                  />
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </Form>
            </Grid>
          );
        }}
      </Formik>
    </Box>
  );
}
