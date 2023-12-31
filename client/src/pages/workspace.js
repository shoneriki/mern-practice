import React, { useEffect, useState, useRef } from "react";
import { Metronome } from "../components/workspace-components/Metronome";
// import {MetronomeE6} from "../components/MetronomeE6"
import { Counter } from "../components/workspace-components/Counter";
import { Box, Grid, Typography, Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import axios from "axios";

// TempoControls.js

export const TempoControls = ({ tempoInfo, setTempo }) => {
  const [tempoState, setTempoState] = useState({
    baseTempo: 0,
    currentPercentage: 50,
    startPercentage: 50,
    tempoChangePercentage: 10,
  });

  const [startButtonClicked, setStartButtonClicked] = useState(false)

  const calculateTempo = (percentage) => {
    return Math.round((tempoState.baseTempo * percentage) / 100);
  };

  const incrementTempo = () => {
    setTempoState((prevState) => {
      const newPercentage =
        prevState.currentPercentage + prevState.tempoChangePercentage;
      const newTempo = calculateTempo(newPercentage);
      setTempo(newTempo);
      return {
        ...prevState,
        currentPercentage: newPercentage,
      };
    });
  };

  const decrementTempo = () => {
    setTempoState((prevState) => {
      const newPercentage =
        prevState.currentPercentage - prevState.tempoChangePercentage;
      const newTempo = calculateTempo(newPercentage);
      setTempo(newTempo);
      return {
        ...prevState,
        currentPercentage: newPercentage,
      };
    });
  };

  // calculate minimum so bpm can never go below 1
  const calculateMinPercentage = (bpm) => {
    return Math.ceil(1/(bpm/100))
  }

  // calculate max so bpm can never go above 300
  const calculateMaxPercentage = (bpm) => {
    return Math.floor(300/(bpm/100))
  }

  useEffect(() => {
    const newTempo = calculateTempo(tempoState.currentPercentage);
    setTempo(newTempo);
  }, [tempoState.currentPercentage]);

  return (
    <Box
      id="tempoControl-box"
      sx={{
        margin: "1rem auto",
      }}
    >
      <Box
        sx={{
          margin: "1rem auto",
          display: "flex",
        }}
      >
        <TextField
          type="number"
          label="Start Percentage"
          value={tempoState.startPercentage}
          centered
          inputProps={{
            min: calculateMinPercentage(tempoInfo.bpm),
            max: calculateMaxPercentage(tempoInfo.bpm),
          }}
          onChange={(event) =>
            setTempoState({
              ...tempoState,
              startPercentage: Number(event.target.value),
              displayPercentage: Number(event.target.value),
            })
          }
        />
        <TextField
          type="number"
          label="Tempo Change Percentage"
          value={tempoState.tempoChangePercentage}
          inputProps={{
            min: calculateMinPercentage(tempoInfo.bpm),
            max: 100,
          }}
          onChange={(event) =>
            setTempoState({
              ...tempoState,
              tempoChangePercentage: Number(event.target.value),
            })
          }
        />
      </Box>
      <Box
        name="three-btn-box"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {tempoState.startPercentage > 0 &&
          tempoInfo.bpm >= 1 &&
          tempoInfo.bpm <= 300 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const newTempoState = {
                  ...tempoState,
                  baseTempo: tempoInfo.bpm,
                  currentPercentage: tempoState.startPercentage,
                };
                const startTempo = calculateTempo(
                  newTempoState.startPercentage
                );
                setTempo(startTempo);
                setTempoState(newTempoState);
                setStartButtonClicked(true);
              }}
            >
              Start at {tempoState.startPercentage}% of {tempoInfo.bpm}?
            </Button>
          )}
        {startButtonClicked && (
          <>
            {tempoState.currentPercentage + tempoState.tempoChangePercentage <=
              calculateMaxPercentage(tempoInfo.bpm) && (
              <Button
                variant="contained"
                color="primary"
                onClick={incrementTempo}
                sx={{ margin: "1rem 0" }}
              >
                Increase tempo to{" "}
                {tempoState.currentPercentage +
                  tempoState.tempoChangePercentage}
                %?
              </Button>
            )}
            {tempoState.currentPercentage - tempoState.tempoChangePercentage >=
              calculateMinPercentage(tempoInfo.bpm) && (
              <Button
                variant="contained"
                color="warning"
                onClick={decrementTempo}
              >
                Decrease tempo to{" "}
                {tempoState.currentPercentage -
                  tempoState.tempoChangePercentage}
                %?
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export const Workspace = () => {
  const { id } = useParams();
  const [practiceSession, setPracticeSession] = useState({});
  const [pieces, setPieces] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tempo, setTempo] = useState(0);

  const [rep, setRep] = useState(10);

  const handleEdit = (id) => {
    navigate(`/practiceSession/edit/${id}`);
  };

  useEffect(() => {
    const fetchPracticeSession = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/practiceSessions/practiceSession/${id}`
          );
          setPracticeSession(response.data);

          if (response.data && response.data.pieces) {
            console.log("response.data.piece", response.data.pieces)
            const pieces = await Promise.all(
              response.data.pieces.map(async (piece) => {
                console.log("pieceId", piece)
                const pieceResponse = await axios.get(
                  `${process.env.REACT_APP_API_URL}/pieces/piece/${piece._id}`
                );
                return pieceResponse.data;
              })
            );
            setPieces(pieces);
          } else {
            setPieces({});
          }
        } else {
          setPracticeSession({});
          setPieces([]);
        }
        setLoading(false);
      } catch (error) {
        console.error(
          "I'm sorry, there was a problem when fetching the practice session: ",
          error
        );
      }
    };
    fetchPracticeSession();
  }, [id]);



  return (
    <Box
      sx={{
        height: "100vh",
        width: "90%",
        margin: "auto 0",
      }}
    >
      {loading ? (
        <Box
          sx={{
            margin: "1rem auto",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Loading...
        </Box>
      ) : Object.keys(practiceSession).length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "2rem auto",
            width: "80%",
          }}
        >
          <Metronome tempo={60} setTempo={setTempo} />
          <Counter rep={10} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "2rem auto",
            width: "80%",
          }}
        >
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid item xs={12}>
              <Typography variant={`h6`}align="center" sx={{fontWeight: "bold"}}>
                Practice Session Name:
              </Typography>
              <Typography align="center">
                {practiceSession.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                color="warning"
                variant="contained"
                sx={{ margin: "2rem auto" }}
                onClick={() => handleEdit(practiceSession._id)}
              >
                Edit Practice Session?
              </Button>
            </Grid>
            {/* container for each piece */}
            {
              pieces.map((piece, pieceIndex) => {
                return (
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography align="center">Piece name: {piece.name}</Typography>
                    </Grid>
                    {/* grid for excerpts */}
                    <Grid
                      container
                      id={"grid-outside-excerpts"}
                      justifyContent="center"
                      sx={{
                        border: "1px solid black",
                        borderRadius: "1rem",
                        margin: "1rem auto",
                        display: "flex",
                      }}
                    >
                      {piece.excerpts.map((excerpt, excerptIndex) => (
                        <Grid item xs={12} sm={12} md={4} sx={{ margin: "2rem auto" }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <Typography variant={"h6"} align="center">
                              Excerpt {excerptIndex + 1}:
                            </Typography>
                            <Typography align="center">
                              Location: {excerpt.location}
                            </Typography>
                            <Typography align="center">
                              Notes: {excerpt.notes}
                            </Typography>
                            <Typography align="center">
                              Repetitions: {excerpt.repetitions}
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setRep(excerpt.repetitions);
                              }}
                            >
                              Set Repetitions to {excerpt.repetitions}?
                            </Button>
                          </Box>
                          {/* piece's excerpt's tempi */}
                          {excerpt.tempi.map((tempoInfo, tempoInfoIndex) => (
                            <Grid
                              container
                              sx={{
                                border: "1px solid black",
                                borderRadius: "1rem",
                                padding: ".5rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                margin: "1rem auto",
                              }}
                            >
                              <Grid item xs={12}>
                                <Typography align="center">
                                  Notes for Tempo: {tempoInfo.notes}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography align="center">
                                  bpm (beats per minute): {tempoInfo.bpm}
                                </Typography>
                              </Grid>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <TempoControls
                                  tempoInfo={tempoInfo}
                                  setTempo={setTempo}
                                />
                              </Box>
                            </Grid>
                          ))}
                          {/* end of piece's excerpt's tempi */}
                        </Grid>
                      ))}
                        {/* end of piece's excerpt */}
                    </Grid>
                  </Grid>
                );
              })
            }
            </Grid>
          <Metronome tempo={tempo} setTempo={setTempo} />
          <Counter rep={rep} />
        </Box>
      )}
    </Box>
  );
};
