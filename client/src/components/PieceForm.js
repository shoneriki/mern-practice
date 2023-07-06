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
  key,
  piece,
  initialValues,
  validationSchema,
  // userID,
  id,
  cookies,
  navigate,
}) => {
  return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {

          try {
            if (id) {
              await axios.put(
                `http://localhost:3001/pieces/piece/${id}`,
                { ...values},
                {
                  headers: { authorization: cookies.access_token },
                }
              );
              alert("piece updated");
              navigate("/pieces")
            } else {
                await axios.post(
                  `http://localhost:3001/pieces`,
                  { ...values },
                  {
                    headers: { authorization: cookies.access_token },
                  }
                );
                alert("piece created");
                navigate("/pieces");
            }
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
            <Box sx={{ width: "100%" }}>
              <Form>
                <Typography variant={"h6"} sx={{ textAlign: "center" }}>
                  Add a piece
                </Typography>
                <Grid
                  name="name-composer-length-container"
                  container
                  spacing={4}
                  sx={{ width: "100%" }}
                >
                  <Grid item xs={12} sm={6}>
                    <Field name="name">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Name"
                          placeholder="Piece Name"
                          fullWidth
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field name="composer">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Composer"
                          placeholder="Composer"
                          fullWidth
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item name="length-container" xs={12}>
                    <InputLabel sx={{ textAlign: "center" }}>
                      Length:
                    </InputLabel>
                    <Grid
                      container
                      name="time-container?"
                      sx={{ width: "100%" }}
                    >
                      <Grid item xs={12} sm={4}>
                        <Field name="length.hours">
                          {({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              label="Hours"
                              id={`piece-hours`}
                              fullWidth
                              min="1"
                              max="10"
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field name="length.minutes">
                          {({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              label="Minutes"
                              id={`piece-minutes`}
                              fullWidth
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field name="length.seconds">
                          {({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              label="Seconds"
                              id={`piece-seconds`}
                              fullWidth
                            />
                          )}
                        </Field>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <FieldArray name={`excerpts`}>
                  {(excerptArrayHelpers) => (
                    <Grid container spacing={4} name="box-surrounding-excerpts">
                      {values.excerpts.map((excerpt, excerptIndex) => (
                        <Grid item xs={12} sm={4} key={excerptIndex}>
                          <Typography variant={"h6"}>
                            Excerpt {excerptIndex + 1}
                          </Typography>

                          <Grid item xs={12}>
                            <Field name={`excerpts.${excerptIndex}.location`}>
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  label="Location"
                                  placeholder="Location"
                                  fullWidth
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item xs={12}>
                            <Field name={`excerpts.${excerptIndex}.notes`}>
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  label="Notes"
                                  placeholder="Notes"
                                  fullWidth
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              name={`excerpts.${excerptIndex}.repetitions`}
                            >
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  type="number"
                                  label="Repetitions"
                                  fullWidth
                                />
                              )}
                            </Field>
                          </Grid>

                          <Box>
                            <Typography sx={{ textAlign: "center" }}>
                              Time To Spend:
                            </Typography>
                          </Box>
                          <Grid container name="timeToSpend-grid-container">
                            <Grid item xs={12} sm={4}>
                              <Field
                                name={`excerpts.${excerptIndex}.timeToSpend.hours`}
                              >
                                {({ field }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    label="hours"
                                    fullWidth
                                  />
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Field
                                name={`excerpts.${excerptIndex}.timeToSpend.minutes`}
                              >
                                {({ field }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    label="minutes"
                                    fullWidth
                                  />
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Field
                                name={`excerpts.${excerptIndex}.timeToSpend.seconds`}
                              >
                                {({ field }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    label="seconds"
                                    fullWidth
                                  />
                                )}
                              </Field>
                            </Grid>
                          </Grid>
                          <FieldArray name={`excerpts.${excerptIndex}.tempi`}>
                            {(tempoArrayHelpers) => (
                              <Box name="tempo-box">
                                {values.excerpts[excerptIndex].tempi.map(
                                  (tempo, tempoIndex) => (
                                    <>
                                    <Typography variant={'h6'}>
                                      Tempo {tempoIndex + 1}
                                    </Typography>
                                    <Grid
                                      item
                                      xs={12}
                                      key={tempoIndex}
                                    >
                                      <Field
                                        name={`excerpts.${excerptIndex}.tempi.${tempoIndex}.bpm`}
                                      >
                                        {({ field }) => (
                                          <TextField
                                            {...field}
                                            type="number"
                                            label="BPM"
                                            fullWidth
                                          />
                                        )}
                                      </Field>
                                      <Field
                                        name={`excerpts.${excerptIndex}.tempi.${tempoIndex}.notes`}
                                      >
                                        {({ field }) => (
                                          <TextField {...field} label="Notes" fullWidth />
                                        )}
                                      </Field>
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
                                    </>
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
                          </FieldArray>
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
                          <Button
                            type="button"
                            variant="contained"
                            color="error"
                            onClick={() =>
                              excerptArrayHelpers.remove(excerptIndex)
                            }
                          >
                            Remove Excerpt
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </FieldArray>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Form>
            </Box>
          );
        }}
      </Formik>
  );
}
