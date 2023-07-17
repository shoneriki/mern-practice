import React, {useEffect, useState, useRef} from "react";
import {Metronome} from "../components/workspace-components/Metronome"
// import {MetronomeE6} from "../components/MetronomeE6"
import {Counter} from "../components/workspace-components/Counter"
import { Box, Grid, Typography, Button,TextField } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom"

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
          }}
        >
          <TextField
            type="number"
            label="Start Percentage"
            value={tempoState.startPercentage}
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
            onChange={(event) =>
              setTempoState({
                ...tempoState,
                tempoChangePercentage: Number(event.target.value),
              })
            }
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const newTempoState = {
              ...tempoState,
              baseTempo: tempoInfo.bpm,
              currentPercentage: tempoState.startPercentage,
            };
            const startTempo = calculateTempo(newTempoState.startPercentage);
            setTempo(startTempo);
            setTempoState(newTempoState);
          }}
        >
          Start at {tempoState.startPercentage}% of {tempoInfo.bpm}?
        </Button>
        <Button variant="contained" color="primary" onClick={incrementTempo}>
          Increase tempo to{" "}
          {tempoState.currentPercentage + tempoState.tempoChangePercentage}%?
        </Button>
        <Button variant="contained" color="warning" onClick={decrementTempo}>
          Decrease tempo to{" "}
          {tempoState.currentPercentage - tempoState.tempoChangePercentage}%?
        </Button>
      </Box>
    );
  };


export const Workspace = () => {
  const { id } = useParams();
  const [practiceSession, setPracticeSession] = useState({});
  const [piece, setPiece] = useState({});

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tempo, setTempo] = useState(0);

  const [rep, setRep] = useState(10);

  const handleEdit = (id) => {
    console.log("id from handleEdit: ", id);
    navigate(`/practiceSessions/practiceSession/edit/${id}`);
  };

  useEffect(() => {
    const fetchPracticeSession = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/practiceSessions/practiceSession/${id}`
        );
        setPracticeSession(response.data);
        console.log(
          "response.data from useEffect in workspace for practiceSession",
          response.data
        );

        const pieceResponse = await axios.get(
          `http://localhost:3001/pieces/piece/${response.data.piece}`
        );
        setPiece(pieceResponse.data);
        console.log("response data for piece", piece);
        console.log("response data for piece", pieceResponse.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "I'm sorry, there was a problem when fetching the practice session: ",
          error
        );
      }
    };
    fetchPracticeSession();
    console.log("response data for piece", piece);
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
              margin: "2rem auto",
            }}
          >
            <Grid item xs={12}>
              <Typography align="center">
                Name: {practiceSession.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align="center">Piece name: {piece.name}</Typography>
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
            <Grid
              container
              id={"grid-outside-excerpts"}
              spacing={4}
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
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Metronome tempo={tempo} setTempo={setTempo} />
          <Counter rep={rep} />
        </Box>
      )}
    </Box>
  );
};
