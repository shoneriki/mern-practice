import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { ScheduledCalendar } from "../components/Calendar";
import {
  Button,
  Box,
} from "@mui/material";

import {ProgramList} from "../components/program-components/ProgramList"

export const Home = () => {

  const userID = useGetUserID();

  const [_, setPrograms] = useState([]);

    useEffect(() => {
      const fetchPrograms = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/programs/user/${userID}`);

          response.data && response.data.length > 0 ? setPrograms(response.data) : setPrograms([])
        } catch (err) {
          console.log(err);
        }
      }
      fetchPrograms()
  }, [userID]);

  const navigate = useNavigate();

  return (
    <Box className="container"
      sx={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}
    >
      <ProgramList />
      <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1rem auto", width: "40%"}}>
        <Button
          onClick={() => navigate("/programs")}
          color='secondary'
          variant="contained"
        >
          All Programs?
        </Button>
        <Button
          onClick={() => navigate("/practiceSessions")}
          color='secondary'
          variant="contained"
        >
          All Practice Sessions?
        </Button>
      </Box>
      <Box id="calendar">
        <ScheduledCalendar />
      </Box>
    </Box>
  );
};
