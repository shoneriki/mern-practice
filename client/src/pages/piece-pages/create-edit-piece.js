import { useState } from "react";

import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
// import {useParams} from "react-router-dom"

import { Formik, Form, Field, FieldArray } from "formik";

import { produce } from "immer";

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

function AddPieceForm() {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();

  // const { id } = useParams();

  const initialValues = {
    name: "",
    composer: "",
    length: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    //movements array of objects
    movements: [
      {
        name: "",
        movementNumber: 0,
        tempi: [
          {
            tempo: 0,
            text: "",
          },
        ],
        settings: "",
        shouldPractice: false,
        shouldSplitIntoExcerpts: false,
        excerpts: [
          {
            text: "",
            repetitions: 0,
            length: {
              hours: 0,
              minutes: 0,
              seconds: 0,
            },
            targetTempo: 0,
            endMetronomeGoal: 0,
          },
        ],
      },
    ],
    userOwner: userID,
  };

  return (
    <Grid container spacing={4}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values }) => (
          <Grid
            item
            name="outer-container"
            xs={12}
          >
            <Form>
              <Grid name="grid-inside-form" item xs={12} sm={8} md={6}>
                <Typography variant={"h6"}>Add a piece</Typography>
                <Field
                  label="Name"
                  name="name"
                  placeholder="Piece Name"
                  value={values.name}
                  fullWidth
                />
                <Field
                  label="Composer"
                  name="composer"
                  placeholder="composer"
                  value={values.composer}
                  fullWidth
                />
              </Grid>
              <Grid name="grid-length" item xs={12} sm={6} md={4}>
                <InputLabel htmlFor={`piece-lengthInSeconds`}>
                  Length:
                </InputLabel>
                <Grid name="hours" item xs={12} sm={6} md={4}>
                  <Field
                    type="number"
                    id={`piece-hours`}
                    name="length.hours"
                    min="1"
                    max="10"
                    value={values.length.hours}
                    fullWidth
                  />
                </Grid>
                <Grid name="minute" item xs={12} sm={4}>
                  <Field
                    type="number"
                    id={`piece-minutes`}
                    name="length.minutes"
                    value={values.length.minutes}
                    fullWidth
                  />
                </Grid>
                <Grid name="seconds" item xs={12} sm={4}>
                  <Field
                    type="number"
                    id={`piece-seconds`}
                    name="length.seconds"
                    value={values.length.seconds}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <FieldArray
                name="movements"
                render={(movementArrayHelpers) => (
                  <Grid name="movement-outer-grid" item xs={12}>
                    {values.movements.map((movement, movementIndex) => (
                      <Grid
                        name="movement-grid"
                        item
                        xs={12}
                        key={movementIndex}
                      >
                        <Grid name="movement-name" item xs={12}>
                          <Typography variant={"h6"}>
                            Movement {movementIndex + 1}
                          </Typography>
                          <Field
                            label="Name"
                            value={movement.name}
                            placeholder="Name"
                            fullWidth
                          />
                        </Grid>
                        <FieldArray
                          name={`movements.${movementIndex}.tempi`}
                          render={(tempoArrayHelpers) => (
                            <Grid name="movement-tempi-outer-container">
                              {movement.tempi.map((tempo, tempoIndex) => (
                                <Grid
                                  name="tempo-container"
                                  item
                                  xs={12}
                                  sm={6}
                                  md={4}
                                >
                                  <Typography variant={"h6"}>
                                    Movement {movementIndex + 1} Tempi{" "}
                                    {tempoIndex + 1}
                                  </Typography>
                                  <Field
                                    type="number"
                                    label="Tempo"
                                    name={`movements.${movementIndex}.tempi.${tempoIndex}.tempo`}
                                    value={tempo.tempo}
                                    fullWidth
                                  />
                                  <Field
                                    label="Text"
                                    name={`movements.${movementIndex}.tempi.${tempoIndex}.text`}
                                    value={tempo.text}
                                    placeholder="text"
                                    fullWidth
                                  />
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Button
                                      name="tempo tap"
                                      sx={{
                                        backgroundColor: "orange",
                                        color: "white",
                                        "&:hover": {
                                          backgroundColor: "red",
                                        },
                                      }}
                                    >
                                      Tempo Tap
                                    </Button>
                                  </Grid>
                                  <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      tempoArrayHelpers.push({
                                        tempo: 0,
                                        text: "",
                                      })
                                    }
                                  >
                                    Add a Tempo
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="contained"
                                    color="error"
                                    onClick={() =>
                                      tempoArrayHelpers.remove(tempoIndex)
                                    }
                                  >
                                    Remove Tempo
                                  </Button>
                                </Grid>
                              ))}
                              <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  tempoArrayHelpers.push({
                                    tempo: 0,
                                    text: "",
                                  })
                                }
                              >
                                Add a Tempo
                              </Button>
                            </Grid>
                          )}
                        />
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Field
                                type="checkbox"
                                name={`movements.${movementIndex}.shouldPractice`}
                              />
                            }
                            label="Should Practice"
                          />
                          <FormControlLabel
                            control={
                              <Field
                                type="checkbox"
                                name={`movements.${movementIndex}.shouldSplitIntoExcerpts`}
                              />
                            }
                            label="Should Split Into Excerpts"
                          />
                        </Grid>

                        <FieldArray
                          name={`movements.${movementIndex}.excerpts`}
                          render={(excerptArrayHelpers) => (
                            <Grid name="excerpt-outer-container">
                              {movement.excerpts.map(
                                (excerpt, excerptIndex) => (
                                  <Grid item xs={12}>
                                    <Typography variant={"h6"}>
                                      Excerpt:
                                    </Typography>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Field
                                        label="Text"
                                        name={`movements.${movementIndex}.excerpts.${excerptIndex}.text`}
                                        value={excerpt.text}
                                        placeholder="description"
                                        fullWidth
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Field
                                        type="number"
                                        label="Repetitions"
                                        name={`movements.${movementIndex}.excerpts.${excerptIndex}.repetitions`}
                                        value={excerpt.repetitions}
                                        fullWidth
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Field
                                        type="number"
                                        label="Target Tempo"
                                        name={`movements.${movementIndex}.excerpts.${excerptIndex}.targetTempo`}
                                        value={excerpt.targetTempo}
                                        fullWidth
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Field
                                        type="number"
                                        label="End Metronome Goal"
                                        name={`movements.${movementIndex}.excerpts.${excerptIndex}.endMetronomeGoal`}
                                        value={excerpt.endMetronomeGoal}
                                        fullWidth
                                      />
                                    </Grid>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      onClick={() =>
                                        excerptArrayHelpers.remove(excerptIndex)
                                      }
                                    >
                                      Remove Excerpt
                                    </Button>
                                  </Grid>
                                )
                              )}
                              <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  excerptArrayHelpers.push({
                                    text: "",
                                    repetitions: 0,
                                    length: {
                                      hours: 0,
                                      minutes: 0,
                                      seconds: 0,
                                    },
                                    targetTempo: 0,
                                    endMetronomeGoal: 0,
                                  })
                                }
                              >
                                Add an Excerpt
                              </Button>
                            </Grid>
                          )}
                        />
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            movementArrayHelpers.push({
                              name: "",
                              movementNumber: 0,
                              tempi: [
                                {
                                  tempo: 0,
                                  text: "",
                                },
                              ],
                              settings: "",
                              shouldPractice: false,
                              shouldSplitIntoExcerpts: false,
                              excerpts: [
                                {
                                  text: "",
                                  repetitions: 0,
                                  length: {
                                    hours: 0,
                                    minutes: 0,
                                    seconds: 0,
                                  },
                                  targetTempo: 0,
                                  endMetronomeGoal: 0,
                                },
                              ],
                            })
                          }
                        >
                          Add a Movement
                        </Button>
                        <Button
                          type="button"
                          variant="contained"
                          color="error"
                          onClick={() =>
                            movementArrayHelpers.remove(movementIndex)
                          }
                        >
                          Remove Movement
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                )}
              />

              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Form>
          </Grid>
        )}
      </Formik>
    </Grid>
  );
}

export default AddPieceForm;
