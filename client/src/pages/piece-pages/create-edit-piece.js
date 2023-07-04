import { useState } from "react";

import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { useNavigate} from "react-router-dom";
// import {useParams} from "react-router-dom"

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

  const [piece, setPiece] = useState({
    name: "",
    composer: "",
    length: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    //movements array of objects
    // movements: [
    //   {
    //     number: 0,
    //     name: "",
    //     movementNumber: 0,
    //     tempi: [],
    //     settings: "",
    //     shouldPractice: false,
    //     shouldSplitIntoExcerpts: false,
    //     excerpts: [],
    //   },
    // ],

    movements: [
      {
        number: 0,
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
            targetTempo: 0,
            endMetronomeGoal: 0,
          },
        ],
      },
    ],
    userOwner: userID,
  });


  const unnestedFieldHandler = {
    handleFieldChange: (field) => (e) => {
      setPiece(
        produce((draft) => {
          draft[field] = e.target.value;
        })
      );
    },
    handleLengthChange: (field) => (e) => {
      setPiece(
        produce((draft) => {
          draft.length[field] = e.target.value;
        })
      );
    },
  };

  // handlers for movement

  const movementHandler = {
    add: () => {
      setPiece(
        produce((draft) => {
          draft.movements.push({ name: "", number: 0, tempi: [], excerpts: [] });
        })
      );
    },
    change: (movementIndex, field) => (e) => {
      setPiece(
        produce((draft) => {
          draft.movements[movementIndex][field] = e.target.value;
        })
      );
    },
    delete: (movementIndex) => {
      setPiece(
        produce((draft) => {
          draft.movements.splice(movementIndex, 1);
        })
      );
    },
  };

  const tempiHandler = {
    addTempo: (movementIndex) => (e) => {
      setPiece(
        produce((draft) => {
          draft.movements[movementIndex].tempi.push({ tempo: 0, text: "" });
        })
      );
    },
    removeTempo: (movementIndex, tempoIndex) => {
      setPiece(
        produce((draft) => {
          draft.movements[movementIndex].tempi.splice(tempoIndex, 1);
        })
      );
    },
    changeTempo: (movementIndex, tempoIndex, field) => (e) => {
      setPiece(
        produce((draft) => {
          draft.movements[movementIndex].tempi[tempoIndex][field] =
            e.target.value;
        })
      );
    },
  };


  const excerptHandler = {
    addExcerpt: (movementIndex) => {
      setPiece(
        produce((draft) => {
          draft.movements[movementIndex].excerpts.push({
            text: "",
            repetitions: 0,
            targetTempo: 0,
            endMetronomeGoal: 0,
          });
        })
      );
    },
    removeExcerpt: (movementIndex, excerptIndex) => {
      setPiece(
        produce((draft) => {
          draft.movements[movementIndex].excerpts.splice(excerptIndex, 1);
        })
      );
    },
    changeExcerpt: (movementIndex, excerptIndex, field) => (e) => {
      setPiece(
        produce((draft) => {
          draft.movements[movementIndex].excerpts[excerptIndex][field] =
            e.target.value;
        })
      );
    },
  };



  // end of movement handlers

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        `http://localhost:3001/pieces`,
        { ...piece},
        {
          headers: { authorization: cookies.access_token },
        }
      );

      alert("Piece created");
      navigate("/pieces");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      name="outer-box-outside-form"
    >
      <form name="add-piece-form" onSubmit={(e) => handleSubmit}>
        <Grid
          sx={{
            width: "70%",
          }}
          container
          spacing={4}
          name="outer-grid-container"
        >
          <Grid name="gr-con-name-composer" item xs={12} sm={4}>
            <Typography variant={"h6"}>Add a piece</Typography>
            <TextField
              label="Name"
              name="name"
              onChange={unnestedFieldHandler.handleFieldChange("name")}
              fullWidth
            />
            <TextField
              label="Composer"
              name="composer"
              onChange={unnestedFieldHandler.handleFieldChange("composer")}
              fullWidth
            />
          </Grid>

          <Grid name="gr-container-length" item xs={12}>
            <InputLabel htmlFor={`piece-lengthInSeconds`}>Length:</InputLabel>

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
                  unnestedFieldHandler.handleLengthChange("hours")
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
                  unnestedFieldHandler.handleLengthChange("minutes")
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
                  unnestedFieldHandler.handleLengthChange("seconds")
                }
                fullWidth
              />
            </Grid>
          </Grid>

          {piece.movements.map((movement, movementIndex) => (
            <Grid
              container
              item
              name="movement-outer-container"
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
                  onChange={movementHandler.change(movementIndex, "number")}
                  fullWidth
                />
                <TextField
                  label="Name"
                  name="name"
                  onChange={movementHandler.change(movementIndex, "name")}
                  fullWidth
                />
              </Grid>

              {movement.tempi.map((tempo, tempoIndex) => (
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
              ))}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="shouldPractice"
                      color="primary"
                      onChange={(e) =>
                        setPiece({
                          ...piece,
                          shouldPractice: e.target.checked,
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
                          shouldSplitIntoExcerpts: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Should Split Into Excerpts"
                />
              </Grid>
              <Grid item xs={4}>
                <Button type="button" onClick={movementHandler.add}>
                  Add a movement?
                </Button>
              </Grid>

              {/* outer movement container */}
            </Grid>
          ))}
        </Grid>
      </form>
    </Box>
  );
}

export default AddPieceForm;
