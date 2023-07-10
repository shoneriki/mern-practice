import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useForm } from "../../hooks/useForm";

import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Box, Grid, Typography, InputLabel, TextField, Autocomplete } from "@mui/material";

import  {PracticeSessionForm}  from "../../components/practiceSession-components/PracticeSessionForm";

export const PracticeSessionCreateEdit = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [practiceSession, setPracticeSession] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const initialValues = {
    dateOfExecution:  new Date(),
    name: "",
    totalSessionLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    piece: null,
    excerpts: [
      {
        excerpt: "",
        location: "",
        repetitions: 0,
        timeToSpend: {
          hours: 0,
          minutes: 0,
          seconds: 0,
        },
        tempi: [
          {
            notes: "",
            bpm: 60,
          },
        ],
        mastered: false,
        untilDate: new Date(),
        notes: "",
      },
    ],
    runThrough: false,
    pieceLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    userOwner: "",
  };

  const validationSchema = Yup.object({
    dateOfExecution: Yup.date(),
    name: Yup.string(),
    totalSessionLength: Yup.object({
      hours: Yup.number().min(0).max(10),
      minutes: Yup.number().min(0).max(59),
      seconds: Yup.number().min(0).max(59),
    }),
    piece: Yup.object().nullable().required("Piece is required"), // Updated to require a selected piece
    excerpts: Yup.array(
      Yup.object({
        excerpt: Yup.string(),
        location: Yup.string(),
        notes: Yup.string(),
        repetitions: Yup.number().min(1).max(100),
        timeToSpend: Yup.object({
          hours: Yup.number().min(0).max(10),
          minutes: Yup.number().min(0).max(59),
          seconds: Yup.number().min(0).max(59),
        }),
        tempi: Yup.array(
          Yup.object({
            notes: Yup.string(),
            bpm: Yup.number().min(10).max(300),
          })
        ),
        mastered: Yup.boolean(),
        untilDate: Yup.date(),
      })
    ),
    runThrough: Yup.boolean(),
    runThroughLength: Yup.object({
      hours: Yup.number().min(0).max(10),
      minutes: Yup.number().min(0).max(59),
      seconds: Yup.number().min(0).max(59),
    }),
    userOwner: Yup.string(),
  });

  useEffect(() => {
    const fetchEditData = async () => {
      if (id) {
        console.log("id in fetch", id);
        try {
          console.log(
            "from inside try of fetchEditData from create-edit practicePlan page"
          );
          const response = await axios.get(
            `http://localhost:3001/practiceSessions/practiceSession/${id}`
          );
          const practiceSessionData = response.data;
          console.log("practiePlanData: ", practiceSessionData);
          setPracticeSession(practiceSessionData);

          console.log("PIECE DATA? From fetch", practiceSessionData);
        } catch (error) {
          console.log("Inside the fetchEditData catch for practicePlan");
          console.error(
            "an error occurred while fetching the program: ",
            error
          );
        }
      }
    };
    fetchEditData();
  }, [id]);

  const [suggestions, setSuggestions] = useState([]);

  const handlePieceSearch = async (searchValue) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/pieces?search=${searchValue}`
      );
      const pieceSuggestions = response.data;
      setSuggestions(pieceSuggestions);
    } catch (error) {
      console.error("Error while fetching piece suggestions:", error);
    }
  };

  const handlePieceSelection = (event, value) => {
    setSelectedPiece(value);
  };


  if (practiceSession === null && id) {
    return <section>Loading...</section>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
      }}
    >
      <Autocomplete
        options={suggestions}
        getOptionLabel={(option) => option.name}
        onInputChange={(event, value) => handlePieceSearch(value)}
        onChange={handlePieceSelection}
        renderInput={(params) => (
          <TextField {...params} label="Piece" variant="outlined" />
        )}
      />
      <PracticeSessionForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        id={id}
        practiceSession={practiceSession}
        cookies={cookies}
        navigate={navigate}
      />
    </Box>
  );
};
