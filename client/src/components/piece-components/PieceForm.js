import React from 'react'
import { Formik, Form, FastField, Field, FieldArray } from "formik";

import { debounce } from "lodash";


import {
  Box,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Typography,
  Switch,
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
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validate={debounce((values) => validationSchema.validate(values), 400)}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, errors }) => {
        console.log("errors", errors);
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
                sx={{
                  width: "100%",
                }}
              >
                <Grid item xs={12} sm={6}>
                  <FastField name="name">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Name"
                        placeholder="Piece Name"
                        fullWidth
                      />
                    )}
                  </FastField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FastField name="composer">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Composer"
                        placeholder="Composer"
                        fullWidth
                      />
                    )}
                  </FastField>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Grid item name="length-container" xs={12} sm={4}>
                    <InputLabel sx={{ textAlign: "center" }}>
                      Length:
                    </InputLabel>
                    <Grid
                      container
                      name="time-container"
                      sx={{ width: "100%" }}
                    >
                      <Grid item xs={12} sm={4}>
                        <FastField name="length.hours">
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
                        </FastField>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FastField name="length.minutes">
                          {({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              label="Minutes"
                              id={`piece-minutes`}
                              fullWidth
                            />
                          )}
                        </FastField>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FastField name="length.seconds">
                          {({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              label="Seconds"
                              id={`piece-seconds`}
                              fullWidth
                            />
                          )}
                        </FastField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
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
                          <FastField name={`excerpts.${excerptIndex}.location`}>
                            {({ field }) => (
                              <TextField
                                {...field}
                                label="Location"
                                placeholder="Location"
                                fullWidth
                              />
                            )}
                          </FastField>
                        </Grid>
                        <Grid item xs={12}>
                          <FastField name={`excerpts.${excerptIndex}.notes`}>
                            {({ field }) => (
                              <TextField
                                {...field}
                                label="Notes"
                                placeholder="Notes"
                                fullWidth
                              />
                            )}
                          </FastField>
                        </Grid>
                        <Grid item xs={12}>
                          <Field name={`excerpts.${excerptIndex}.repetitions`}>
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
                            <FastField
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
                            </FastField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FastField
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
                            </FastField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FastField
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
                            </FastField>
                          </Grid>
                        </Grid>
                        <FieldArray name={`excerpts.${excerptIndex}.tempi`}>
                          {(tempoArrayHelpers) => (
                            <Box name="tempo-box">
                              {values.excerpts[excerptIndex].tempi.map(
                                (tempo, tempoIndex) => (
                                  <>
                                    <Typography variant={"h6"}>
                                      Tempo {tempoIndex + 1}
                                    </Typography>
                                    <Grid item xs={12} key={tempoIndex}>
                                      <FastField
                                        name={`excerpts.${excerptIndex}.tempi.${tempoIndex}.notes`}
                                      >
                                        {({ field }) => (
                                          <TextField
                                            {...field}
                                            label="Notes"
                                            fullWidth
                                          />
                                        )}
                                      </FastField>
                                      <FastField
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
                                      </FastField>

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
                        <Grid item xs={12} sm={6} md={4}>
                          <FastField
                            name={`excerpts.${excerptIndex}.mastered`}
                            type="checkbox"
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Switch checked={field.value} {...field} />
                                }
                                label="Excerpt Mastered?"
                              />
                            )}
                          />
                        </Grid>

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
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        margin: "1rem auto",
                      }}
                    >
                      <Box>
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
                    </Box>
                  </Grid>
                )}
              </FieldArray>
              <Box
                name="submit-btn-mastered-container"
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "2rem auto",
                }}
              >
                <FastField
                  name="mastered"
                  type="checkbox"
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} {...field} />}
                      label="Piece Mastered?"
                    />
                  )}
                />
                {id ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    sx={{ width: "50%" }}
                  >
                    Edit Piece?
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ width: "60%" }}
                  >
                    Add Piece?
                  </Button>
                )}
              </Box>
            </Form>
          </Box>
        );
      }}
    </Formik>
  );
}
