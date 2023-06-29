import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { ScheduledCalendar } from "../components/Calendar";
import {
  Button,
  Box,
} from "@mui/material";

import {ProgramList} from "../components/ProgramList"

export const Home = () => {
  // const [recipes, setRecipes] = useState([]);
  // const [savedRecipes, setSavedRecipes] = useState([]);

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
    <Box className="container">
      <ProgramList />
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Button
          onClick={() => navigate("/programs")}
          sx={{
            color: "white",
            backgroundColor: "green",
            textAlign: "center",
            margin: "1rem auto",
            "&:hover": {
              backgroundColor: "yellow",
            },
          }}
        >
          All Programs?
        </Button>
      </Box>
      <Box id="calendar">
        <ScheduledCalendar />
      </Box>
    </Box>
  );
};
