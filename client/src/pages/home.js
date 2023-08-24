import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { ScheduledCalendar } from "../components/Calendar";
import {
  Button,
  Box,
  Grid,
  Modal,
  Typography,
} from "@mui/material";

import {ProgramList} from "../components/program-components/ProgramList"

import {IntroModal} from "../components/IntroModal"

export const Home = () => {


  const userID = useGetUserID();

  const navigate = useNavigate();

  const [pieces, setPieces] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
      const fetchPieces = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/pieces/user/${userID}`
          );
          if (response.data && response.data.length > 0) {
            setPieces(response.data.map((piece) => ({ ...piece })));
            setIsModalOpen(false); // close the modal if there are pieces
          } else {
            setPieces([]);
            setIsModalOpen(true); // open the modal if there are no pieces
          }
        } catch (error) {
          if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.log("Data:", error.response.data);
            console.log("Status:", error.response.status);
            console.log("Headers:", error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log("Request:", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error:", error.message);
          }
        }
      };
      if (userID) {
        fetchPieces();
      }
    }, [userID]);

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
      {isModalOpen ? (
        <IntroModal isModalOpen={isModalOpen}/>
      ) : (
        <>
          <ProgramList />
          <Grid
            container
            justifyContent="center"
            sx={{
              width: "80%",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
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
        </>
      )}
    </Box>
  );
};
