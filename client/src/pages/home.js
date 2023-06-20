import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { ScheduledCalendar } from "../components/Calendar";
import {
  Button,
} from "@mui/material";

import {ProgramList} from "../components/ProgramList"

export const Home = () => {
  // const [recipes, setRecipes] = useState([]);
  // const [savedRecipes, setSavedRecipes] = useState([]);

  const userID = useGetUserID();

  const [programs, setPrograms] = useState([]);

    useEffect(() => {
      const fetchPrograms = async () => {
        try {
          const response = await axios.get("http://localhost:3001/programs");
          setPrograms(response.data);
        } catch (err) {
          console.log(err);
        }
      }
      fetchPrograms()
  }, []);

  const navigate = useNavigate();

  return (
    <section className="container">
      <section id="calendar">
        <ScheduledCalendar />
      </section>
      <ProgramList />
      <Button
        onClick={() => navigate("/programs")}
        sx={{
          color: "white",
          backgroundColor: "green",
          "&:hover": {
            backgroundColor: "red",
          },
        }}
      >
        All Programs?
      </Button>
    </section>
  );
};
