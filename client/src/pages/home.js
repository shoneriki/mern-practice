import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { ScheduledCalendar } from "../components/Calendar";
import {
  Button,
  Box,
  Grid,
} from "@mui/material";

import {ProgramList} from "../components/program-components/ProgramList"

export const Home = () => {

  const userID = useGetUserID();


  const navigate = useNavigate();

  return (
    <Box
      className="container"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ProgramList />
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{
          margin: "1rem auto",
          width: "80%",
        }}
      >
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => navigate("/programs")}
            color="secondary"
            variant="contained"
          >
            All Programs?
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => navigate("/practiceSessions")}
            color="secondary"
            variant="contained"
          >
            All Practice Sessions?
          </Button>
        </Grid>
      </Grid>
      <Box id="calendar" sx={{ width: "80%", margin: "2rem auto" }}>
        <ScheduledCalendar />
      </Box>
    </Box>
  );
};
