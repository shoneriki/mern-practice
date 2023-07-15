import React, {useEffect, useState} from "react";
import {Metronome} from "../components/workspace-components/Metronome"
// import {MetronomeE6} from "../components/MetronomeE6"
import {Counter} from "../components/workspace-components/Counter"
import { Box, Grid, Typography, Button } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom"

import { useParams } from "react-router-dom";
import axios from "axios";

export const Workspace = () => {
  const {id} = useParams();
  const [practiceSession, setPracticeSession] = useState({})
  const [piece, setPiece] = useState({})

  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

  const handleEdit = (id) => {
    console.log("id from handleEdit: ", id);
    navigate(`/practiceSessions/practiceSession/edit/${id}`);
  };



  useEffect(() => {
    const fetchPracticeSession = async() => {
      try {
        const response = await axios.get(`http://localhost:3001/practiceSessions/practiceSession/${id}`);
        setPracticeSession(response.data)
        console.log("response.data from useEffect in workspace for practiceSession", response.data)

        const pieceResponse = await axios.get(
          `http://localhost:3001/pieces/piece/${response.data.piece}`
        );
        setPiece(pieceResponse.data);
        console.log("response data for piece", piece)
        console.log("response data for piece", pieceResponse.data)
        setLoading(false)
      } catch (error) {
        console.error("I'm sorry, there was a problem when fetching the practice session: ", error)
      }
    }
    fetchPracticeSession();
    console.log("response data for piece", piece)
  }, [id])

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
      ): (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto 2rem",
          }}
        >
          <Grid
            container
            centered
          >
            <Grid item xs={12}>
              <Typography>Name: {practiceSession.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Piece name: {piece.name}
              </Typography>
            </Grid>
            <Grid>
              <Button
                color="warning"
                variant="contained"
                onClick={() => handleEdit(practiceSession._id)}
              >
                Edit Practice Session?
              </Button>
            </Grid>

          </Grid>
          <Metronome />
          <Counter />
        </Box>
      )}
    </Box>
  );
};
