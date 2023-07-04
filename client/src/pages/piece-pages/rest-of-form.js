// {
//   piece.movements.map((movement, movementIndex) => (
//     <Grid container item key={movementIndex}>
//       <Grid item xs={12}>
//         <Typography variant={"h6"}>Movement {movementIndex + 1} </Typography>
//         <TextField
//           type="number"
//           label="Number"
//           name="number"
//           onChange={movementHandler.change(movementIndex, "number")}
//           fullWidth
//         />
//         <TextField
//           label="Name"
//           name="name"
//           onChange={movementHandler.change(movementIndex, "name")}
//           fullWidth
//         />
//       </Grid>
//       {movement.tempi.map((tempo, tempoIndex) => (
//         <Grid item xs={4} name="tempo">
//           <Typography variant={"h6"}>
//             Movement {movementIndex + 1} Tempi
//           </Typography>
//           <TextField
//             type="number"
//             label="Tempo"
//             name="tempo"
//             onChange={tempiHandler.changeTempo(
//               movementIndex,
//               tempoIndex,
//               "tempo"
//             )}
//             fullWidth
//           />
//           <TextField
//             label="Text"
//             name="text"
//             onChange={tempiHandler.changeTempo(
//               movementIndex,
//               tempoIndex,
//               "text"
//             )}
//             fullWidth
//           />
//           <Button
//             name="tempo tap"
//             sx={{
//               backgroundColor: "orange",
//               color: "white",
//               "&:hover": {
//                 backgroundColor: "red",
//               },
//             }}
//           >
//             Tempo Tap
//           </Button>
//           <Button
//             onClick={tempiHandler.addTempo(movementIndex)}
//             sx={{
//               backgroundColor: "green",
//               color: "white",
//               "&:hover": {
//                 backgroundColor: "lightgreen",
//               },
//             }}
//           >
//             Add Tempo?
//           </Button>
//         </Grid>
//       ))}
//       <Grid item xs={12}>
//         <FormControlLabel
//           control={
//             <Checkbox
//               name="shouldPractice"
//               color="primary"
//               onChange={(e) =>
//                 setPiece({ ...piece, shouldPractice: e.target.checked })
//               }
//             />
//           }
//           label="Should Practice"
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               name="shouldSplitIntoExcerpts"
//               color="primary"
//               onChange={(e) =>
//                 setPiece({
//                   ...piece,
//                   shouldSplitIntoExcerpts: e.target.checked,
//                 })
//               }
//             />
//           }
//           label="Should Split Into Excerpts"
//         />
//       </Grid>
//       <Grid item xs={4}>
//         <Button type="button" onClick={movementHandler.add()}>
//           Add a movement?
//         </Button>
//       </Grid>
//       {movement.excerpts.map((excerpt, excerptIndex) => (
//         <Grid item xs={12}>
//           <Typography variant={"h6"}>Excerpt:</Typography>
//           <TextField
//             label="Text"
//             name="text"
//             onChange={excerptHandler.changeExcerpt(
//               movementIndex,
//               excerptIndex,
//               "name"
//             )}
//             fullWidth
//           />
//           <TextField
//             type="number"
//             label="Repetitions"
//             name="repetitions"
//             onChange={excerptHandler.changeExcerpt(
//               movementIndex,
//               excerptIndex,
//               "repetitions"
//             )}
//             fullWidth
//           />
//           <TextField
//             type="number"
//             label="Target Tempo"
//             name="targetTempo"
//             onChange={excerptHandler.changeExcerpt(
//               movementIndex,
//               excerptIndex,
//               "targetTempo"
//             )}
//             fullWidth
//           />
//           <TextField
//             type="number"
//             label="End Metronome Goal"
//             name="endMetronomeGoal"
//             onChange={excerptHandler.changeExcerpt(
//               movementIndex,
//               excerptIndex,
//               "endMetronomeGoal"
//             )}
//             fullWidth
//           />
//           <Button onClick={excerptHandler.addExcerpt(movementIndex)}>
//             Add Excerpt?
//           </Button>
//         </Grid>
//       ))}
//     </Grid>
//   ));
// }



              {
                movement.tempi.map((tempo, tempoIndex) => (
                  <Grid item xs={4} name="tempo">
                    <Typography variant={"h6"}>
                      Movement {movementIndex + 1} Tempi
                    </Typography>
                    <TextField
                      type="number"
                      label="Tempo"
                      name="tempo"
                      onChange={tempiHandler.changeTempo(
                        movementIndex,
                        tempoIndex,
                        "tempo"
                      )}
                      fullWidth
                    />
                    <TextField
                      label="Text"
                      name="text"
                      onChange={tempiHandler.changeTempo(
                        movementIndex,
                        tempoIndex,
                        "text"
                      )}
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
                      onClick={tempiHandler.addTempo(movementIndex)}
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
                ));
              }


                          {
                            movement.excerpts.map((excerpt, excerptIndex) => (
                              <Grid item xs={12}>
                                <Typography variant={"h6"}>Excerpt:</Typography>
                                <TextField
                                  label="Text"
                                  name="text"
                                  onChange={excerptHandler.changeExcerpt(
                                    movementIndex,
                                    excerptIndex,
                                    "name"
                                  )}
                                  fullWidth
                                />
                                <TextField
                                  type="number"
                                  label="Repetitions"
                                  name="repetitions"
                                  onChange={excerptHandler.changeExcerpt(
                                    movementIndex,
                                    excerptIndex,
                                    "repetitions"
                                  )}
                                  fullWidth
                                />
                                <TextField
                                  type="number"
                                  label="Target Tempo"
                                  name="targetTempo"
                                  onChange={excerptHandler.changeExcerpt(
                                    movementIndex,
                                    excerptIndex,
                                    "targetTempo"
                                  )}
                                  fullWidth
                                />
                                <TextField
                                  type="number"
                                  label="End Metronome Goal"
                                  name="endMetronomeGoal"
                                  onChange={excerptHandler.changeExcerpt(
                                    movementIndex,
                                    excerptIndex,
                                    "endMetronomeGoal"
                                  )}
                                  fullWidth
                                />
                                <Button
                                  onClick={excerptHandler.addExcerpt(
                                    movementIndex
                                  )}
                                >
                                  Add Excerpt?
                                </Button>
                              </Grid>
                            ));
                          }










<Grid
  sx={{
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  <form onSubmit={(e) => handleSubmit}>
    <Grid
      sx={{
        width: "70%",
      }}
      container
      spacing={4}
    >
      <Grid item xs={12} sm={4}>
        <Typography variant={"h6"}>
          Add a piece
        </Typography>
        <TextField
          label="Name"
          name="name"
          onChange={unnestedFieldHandler.handleFieldChange(
            "name"
          )}
          fullWidth
        />
        <TextField
          label="Composer"
          name="composer"
          onChange={unnestedFieldHandler.handleFieldChange(
            "composer"
          )}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <InputLabel
          htmlFor={`piece-lengthInSeconds`}
        >
          Length:
        </InputLabel>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              type="number"
              id={`piece-hours`}
              label="Hours"
              name="length"
              min="1"
              max="10"
              value={piece.length.hours}
              onChange={(event) =>
                unnestedFieldHandler.handleLengthChange(
                  "hours"
                )
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="number"
              id={`piece-minutes`}
              name="length"
              label="Minutes"
              value={piece.length.minutes}
              onChange={(event) =>
                unnestedFieldHandler.handleLengthChange(
                  "minutes"
                )
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="number"
              id={`piece-seconds`}
              name="length"
              label="Seconds"
              value={piece.length.seconds}
              onChange={(event) =>
                unnestedFieldHandler.handleLengthChange(
                  "seconds"
                )
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>

      {piece.movements.map(
        (movement, movementIndex) => (
          <Grid
            container
            item
            key={movementIndex}
          >
            <Grid item xs={12}>
              <Typography variant={"h6"}>
                Movement {movementIndex + 1}{" "}
              </Typography>
              <TextField
                type="number"
                label="Number"
                name="number"
                onChange={movementHandler.change(
                  movementIndex,
                  "number"
                )}
                fullWidth
              />
              <TextField
                label="Name"
                name="name"
                onChange={movementHandler.change(
                  movementIndex,
                  "name"
                )}
                fullWidth
              />
            </Grid>
            {movement.tempi.map(
              (tempo, tempoIndex) => (
                <Grid item xs={4} name="tempo">
                  <Typography variant={"h6"}>
                    Movement {movementIndex + 1}{" "}
                    Tempi
                  </Typography>
                  <TextField
                    type="number"
                    label="Tempo"
                    name="tempo"
                    onChange={tempiHandler.changeTempo(
                      movementIndex,
                      tempoIndex,
                      "tempo"
                    )}
                    fullWidth
                  />
                  <TextField
                    label="Text"
                    name="text"
                    onChange={tempiHandler.changeTempo(
                      movementIndex,
                      tempoIndex,
                      "text"
                    )}
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
                    onClick={tempiHandler.addTempo(
                      movementIndex
                    )}
                    sx={{
                      backgroundColor: "green",
                      color: "white",
                      "&:hover": {
                        backgroundColor:
                          "lightgreen",
                      },
                    }}
                  >
                    Add Tempo?
                  </Button>
                </Grid>
              )
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="shouldPractice"
                    color="primary"
                    onChange={(e) =>
                      setPiece({
                        ...piece,
                        shouldPractice:
                          e.target.checked,
                      })
                    }
                  />
                }
                label="Should Practice"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="shouldSplitIntoExcerpts"
                    color="primary"
                    onChange={(e) =>
                      setPiece({
                        ...piece,
                        shouldSplitIntoExcerpts:
                          e.target.checked,
                      })
                    }
                  />
                }
                label="Should Split Into Excerpts"
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                type="button"
                onClick={movementHandler.add}
              >
                Add a movement?
              </Button>
            </Grid>
            {movement.excerpts.map(
              (excerpt, excerptIndex) => (
                <Grid item xs={12}>
                  <Typography variant={"h6"}>
                    Excerpt:
                  </Typography>
                  <TextField
                    label="Text"
                    name="text"
                    onChange={excerptHandler.changeExcerpt(
                      movementIndex,
                      excerptIndex,
                      "name"
                    )}
                    fullWidth
                  />
                  <TextField
                    type="number"
                    label="Repetitions"
                    name="repetitions"
                    onChange={excerptHandler.changeExcerpt(
                      movementIndex,
                      excerptIndex,
                      "repetitions"
                    )}
                    fullWidth
                  />
                  <TextField
                    type="number"
                    label="Target Tempo"
                    name="targetTempo"
                    onChange={excerptHandler.changeExcerpt(
                      movementIndex,
                      excerptIndex,
                      "targetTempo"
                    )}
                    fullWidth
                  />
                  <TextField
                    type="number"
                    label="End Metronome Goal"
                    name="endMetronomeGoal"
                    onChange={excerptHandler.changeExcerpt(
                      movementIndex,
                      excerptIndex,
                      "endMetronomeGoal"
                    )}
                    fullWidth
                  />
                  <Button
                    onClick={() => excerptHandler.addExcerpt(movementIndex)}
                  >
                    Add Excerpt?
                  </Button>
                </Grid>
              )
            )}
          </Grid>
        )
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
      >
        Submit
      </Button>
    </Grid>
  </form>
</Grid>;
