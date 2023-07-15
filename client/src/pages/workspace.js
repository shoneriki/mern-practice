import React, {useEffect, useState} from "react";
import {Metronome} from "../components/workspace-components/Metronome"
// import {MetronomeE6} from "../components/MetronomeE6"
import {Counter} from "../components/workspace-components/Counter"
import { Box, Grid, Typography, Button } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom"

import { useParams } from "react-router-dom";
import axios from "axios";

export const Workspace = () => {
  const { id } = useParams();
  const [practiceSession, setPracticeSession] = useState({});
  const [piece, setPiece] = useState({});

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tempo, setTempo] = useState(0);

  const [incrementPercentage, setIncrementPercentage] = useState(10); // default increment percentage is 10%
  const [startPercentage, setStartPercentage] = useState(50); // default start percentage is 50%

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

  const incrementTempo = () => {
    setTempo(
      (prevTempo) =>
    Math.round(prevTempo + (prevTempo * incrementPercentage) / 100)

    );
  };

  const calculateStartTempo = (baseTempo) => {
    return (baseTempo * startPercentage) / 100;
  };

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
              margin: "auto 2rem",
            }}
          >
            <Grid item xs={12}>
              <Typography>Name: {practiceSession.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Piece name: {piece.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                color="warning"
                variant="contained"
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
                        border: "2px solid black",
                        borderRadius: "1rem",
                        padding: ".5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
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
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setTempo(tempoInfo.bpm);
                            console.log("tempo bpm: ", tempo);
                          }}
                        >
                          Add {tempoInfo.bpm} to Metronome?
                        </Button>
                      </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const startTempo = calculateStartTempo(tempoInfo.bpm);
                        setTempo(startTempo);
                        console.log("start tempo: ", startTempo);
                      }}
                    >
                      Start at {startPercentage}% of {tempoInfo.bpm}?
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={incrementTempo}
                    >
                      Increase tempo by {incrementPercentage}%?
                    </Button>
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
