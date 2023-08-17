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
        <Modal
          open={isModalOpen}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid black",
            borderRadius: "1rem",
          }}
        >
          <Box
            sx={{
              width: "80%",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>
              Welcome! It seems you haven't added any pieces yet.
            </Typography>
            <Typography>
              If you are in a hurry to prepare for a program, you can add pieces
              through the program
            </Typography>
            <Button variant="contained" color="success" href="/program/create">
              Add a program
            </Button>
            <Typography>
              You can also add detailed info for each piece individually
            </Typography>
            <Button variant="contained" color="success" href="/piece/create">
              Add a piece
            </Button>
          </Box>
        </Modal>
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
