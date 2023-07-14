import React, {useEffect, useState} from "react";
import {Metronome} from "../components/workspace-components/Metronome"
// import {MetronomeE6} from "../components/MetronomeE6"
import {Counter} from "../components/workspace-components/Counter"
import { Box } from "@mui/material";
import {useLocation} from "react-router-dom"
import { Typography } from "@mui/material";

import { useParams } from "react-router-dom";
import axios from "axios";

export const Workspace = () => {
  const {id} = useParams();
  const [practiceSession, setPracticeSession] = useState({})

  useEffect(() => {
    const fetchPracticeSession = async() => {
      try {
        const response = await axios.get(`http://localhost:3001/practiceSessions/practiceSession/${id}`);
        setPracticeSession(response.data)
        console.log("response.data from useEffect in workspace", response.data)
      } catch (error) {
        console.error("I'm sorry, there was a problem when fetching the practie session: ", error)
      }
    }
    fetchPracticeSession();
  }, [id])
  
  return (
    <Box
      sx={{
        height: "100vh",
        width: "90%",
        margin: "auto 0",
      }}
    >
      <Metronome />
      <Counter />
    </Box>
  );
};
