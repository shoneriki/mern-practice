import { useState } from "react";

import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { useNavigate} from "react-router-dom";
// import {useParams} from "react-router-dom"

import { Formik, Form, Field, FieldArray } from "formik";

import {produce} from "immer";

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


  // const unnestedFieldHandler = {
  //   handleFieldChange: (field) => (event) => {
  //     setPiece(
  //       produce((draft) => {
  //         draft[field] = event.target.value;
  //       })
  //     );
  //   },
  //   handleLengthChange: (field) => (event) => {
  //     setPiece(
  //       produce((draft) => {
  //         draft.length[field] = event.target.value;
  //       })
  //     );
  //   },
  // };

  // handlers for movement

  // const movementHandler = {
  //   add: () => {
  //     setPiece(
  //       produce((draft) => {
  //         draft.movements.push({
  //           number: 0,
  //           name: "",
  //           movementNumber: 0,
  //           tempi: [
  //             {
  //               tempo: 0,
  //               text: "",
  //             },
  //           ],
  //           settings: "",
  //           shouldPractice: false,
  //           shouldSplitIntoExcerpts: false,
  //           excerpts: [
  //             {
  //               text: "",
  //               repetitions: 0,
  //               targetTempo: 0,
  //               endMetronomeGoal: 0,
  //             },
  //           ],
  //         });
  //       })
  //     );
  //   },
  //   change: (movementIndex, field) => (e) => {
  //     setPiece(
  //       produce((draft) => {
  //         draft.movements[movementIndex][field] = e.target.value;
  //       })
  //     );
  //   },
  //   delete: (movementIndex) => {
  //     setPiece((piece) => {
  //       const newMovements = piece.movements.filter(
  //         (_, index) => index !== movementIndex
  //       );
  //       return { ...piece, movements: newMovements };
  //     });
  //   },
  // };

  // const tempiHandler = {
  //   addTempo: (movementIndex) => (event) => {
  //     setPiece(
  //       produce((draft) => {
  //         draft.movements[movementIndex].tempi.push({ tempo: 0, text: "" });
  //       })
  //     );
  //   },
  //   removeTempo: (movementIndex, tempoIndex) => (event) => {
  //     event.persist()
  //     setPiece(
  //       produce((draft) => {
  //         draft.movements[movementIndex].tempi = draft.movements[
  //           movementIndex
  //         ].tempi.filter((_, index) => index !== tempoIndex);
  //       })
  //     );
  //   },
  //   changeTempo: (movementIndex, tempoIndex, field) => (event) => {
  //     setPiece(
  //       produce((draft) => {
  //         draft.movements[movementIndex].tempi[tempoIndex][field] =
  //           event.target.value;
  //       })
  //     );
  //   },
  // };


  // const excerptHandler = {
  //   addExcerpt: (movementIndex) => {
  //     setPiece(
  //       produce((draft) => {
  //         draft.movements[movementIndex].excerpts.push({
  //           text: "",
  //           repetitions: 0,
  //           targetTempo: 0,
  //           endMetronomeGoal: 0,
  //         });
  //       })
  //     );
  //   },
  //   removeExcerpt: (movementIndex, excerptIndex) => (event) => {
  //     event.persist()
  //     setPiece(
  //       produce((draft) => {
  //         draft.movements[movementIndex].excerpts = draft.movements[
  //           movementIndex
  //         ].excerpts.filter((_, index) => index !== excerptIndex);
  //       })
  //     );
  //   },
  //   changeExcerpt: (movementIndex, excerptIndex, field) => (event) => {
  //     setPiece(
  //       produce((draft) => {
  //         draft.movements[movementIndex].excerpts[excerptIndex][field] =
  //           event.target.value;
  //       })
  //     );
  //   },
  // };



  // end of movement handlers

  // const handleSubmit = async (event) => {
  //   event.preventDefault()
  //   try {
  //     await axios.post(
  //       `http://localhost:3001/pieces`,
  //       { ...piece},
  //       {
  //         headers: { authorization: cookies.access_token },
  //       }
  //     );

  //     alert("Piece created");
  //     navigate("/pieces");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values }) => (
        <Grid
          sx={{
            width: "70%",
          }}
          container
          spacing={4}
        >
          <Form>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12}>
              <InputLabel htmlFor={`piece-lengthInSeconds`}>Length:</InputLabel>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
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
                <Grid item xs={12} sm={4}>
                  <Field
                    type="number"
                    id={`piece-minutes`}
                    name="length.minutes"
                    value={values.length.minutes}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    type="number"
                    id={`piece-seconds`}
                    name="length.seconds"
                    value={values.length.seconds}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <FieldArray
              name="movements"
              render={(arrayHelpers) => (
                <section>
                  {values.movements && values.movements.length > 0 ? (
                    values.movements.map((movement, movementIndex) => (
                      <Grid container item key={movementIndex}>
                        <Grid item xs={12}>
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
                        {movement.tempi.map((tempo, tempoIndex) => (
                          <Grid item xs={4} name="tempo">
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
                            <Button
                              sx={{
                                backgroundColor: "green",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "lightgreen",
                                },
                              }}
                            >
                              Add Tempo?
                            </Button>
                          </Grid>
                        ))}
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
                        {movement.excerpts.map((excerpt, excerptIndex) => (
                          <Grid item xs={12}>
                            <Typography variant={"h6"}>Excerpt:</Typography>
                            <Grid item xs={4}>
                              <Field
                                label="Text"
                                name={`movements.${movementIndex}.excerpts.${excerptIndex}.text`}
                                value={excerpt.text}
                                placeholder="description"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <Field
                                type="number"
                                label="Repetitions"
                                name={`movements.${movementIndex}.excerpts.${excerptIndex}.repetitions`}
                                value={excerpt.repetitions}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <Field
                                type="number"
                                label="Target Tempo"
                                name={`movements.${movementIndex}.excerpts.${excerptIndex}.targetTempo`}
                                value={excerpt.targetTempo}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <Field
                                type="number"
                                label="End Metronome Goal"
                                name={`movements.${movementIndex}.excerpts.${excerptIndex}.endMetronomeGoal`}
                                value={excerpt.endMetronomeGoal}
                                fullWidth
                              />
                            </Grid>

                            <Button variant="contained"> Add Excerpt?</Button>
                          </Grid>
                        ))}
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            arrayHelpers.push({
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
                          onClick={() => arrayHelpers.remove(movementIndex)}
                        >
                          Remove Movement
                        </Button>
                      </Grid>
                    ))
                  ) : (
                    <Button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
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
                  )}
                </section>
              )}
            />

            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Form>
        </Grid>
      )}
    </Formik>
  );
}

export default AddPieceForm;
