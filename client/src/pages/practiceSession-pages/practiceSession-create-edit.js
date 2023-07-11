import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useForm } from "../../hooks/useForm";

import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Box, Grid, Typography, InputLabel, TextField, Autocomplete } from "@mui/material";

import  {PracticeSessionForm}  from "../../components/practiceSession-components/PracticeSessionForm";

export const PracticeSessionCreateEdit = (props) => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [practiceSession, setPracticeSession] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    console.log("selectedPiece updated", selectedPiece);
  }, [selectedPiece]);

  const initialValues = {
    dateOfExecution:  new Date(),
    name: "",
    totalSessionLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    piece: selectedPiece,
    excerpts: [
      {
        excerpt: "",
        location: "",
        repetitions: 1,
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
    userOwner: userID,
  };

  const validationSchema = Yup.object({
    dateOfExecution: Yup.date(),
    name: Yup.string(),
    totalSessionLength: Yup.object({
      hours: Yup.number().min(0).max(10),
      minutes: Yup.number().min(0).max(59),
      seconds: Yup.number().min(0).max(59),
    }),
    piece: Yup.object().nullable(),
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

  const handlePieceSearch = async (searchValue) => {
    if (searchValue) {
      try {
        const response = await axios.get(
          `http://localhost:3001/pieces/suggestions?search=${searchValue}`
        );
        const pieceSuggestions = response.data;
        setSuggestions(pieceSuggestions);
      } catch (error) {
        console.error("Error while fetching piece suggestions:", error);
      }
    }
  };

  const handlePieceSelection = (event, value) => {
    setSelectedPiece(value);
  };

  const onSubmit= async (values, { setSubmitting }) => {
    console.log("entering the submit?");
    try {
      if (id) {
        await axios.put(
          `http://localhost:3001/practiceSessions/practiceSession/${id}`,
          { ...values },
          {
            headers: { authorization: cookies.access_token },
          }
        );
        await axios.put(
          `http://localhost:3001/pieces/piece/${values.piece._id}`,
          { ...values.piece },
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("practiceSession updated");
        navigate("/practiceSessions");
      } else {
        console.log("inside the else... for submitting");
        await axios.post(
          `http://localhost:3001/practiceSessions`,
          { ...values },
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("Practice Session created");
        navigate("/practiceSessions");
      }
    } catch (error) {
      alert("I'm sorry, there's an error in submitting this form");
      console.log("error", error);
    } finally {
      setSubmitting(false);
    }
  }

  const errors = {};
  try {
    validationSchema.validateSync(initialValues, { abortEarly: false });
  } catch (validationErrors) {
    validationErrors.inner.forEach((error) => {
      errors[error.path] = error.message;
    });
  }

  if (Object.keys(errors).length === 0) {
    console.log("No validation errors.");
  } else {
    console.log("Validation errors:");
    console.log(errors);
  }


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
      <PracticeSessionForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        id={id}
        practiceSession={practiceSession}
        cookies={cookies}
        navigate={navigate}
        selectedPiece={selectedPiece}
        suggestions={suggestions}
        handlePieceSearch={handlePieceSearch}
        handlePieceSelection={handlePieceSelection}
        onSubmit={onSubmit}
      />
    </Box>
  );
};
