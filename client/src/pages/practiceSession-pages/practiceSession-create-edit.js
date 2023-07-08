import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useForm } from "../../hooks/useForm";

import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Box, Grid, Typography, InputLabel } from "@mui/material";

import  {PracticeSessionForm}  from "../../components/PracticeSessionForm";

export const PracticeSessionCreateEdit = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [practiceSession, setPracticeSession] = useState(null);

  const initialValues = {
    practiceSessionLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    piece: "",
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
    runThroughLength: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    userOwner: "",
  };

  const validationSchema = Yup.object({
    piece: Yup.string(),
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
            bpm: Yup.number().min(10).max(300)
          })
        ),
        mastered: Yup.boolean(),
        untilDate: Yup.date(),
      })
    ),
    /*
      const excerptSchema = new mongoose.Schema({
  location: { type: String },
  notes: {type: String},
  repetitions: { type: Number },
  timeToSpend: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, min: 0, max: 59, default: 0 },
    seconds: { type: Number, min: 0, max: 59, default: 0 },
  },
  tempi: [
    {
      notes: {type: String},
      bpm: {type: Number, min: 10, max: 300},
    },
  ],
  mastered: {type: Boolean}
});
    */
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
            `http://localhost:3001/practicePlans/practicePlan/${id}`
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

  // useEffect(() => {
  //   if (practicePlan.piece) {
  //     axios
  //       .get(
  //         `http://localhost:3001/programs/search?piece=${practicePlan.piece}`
  //       )
  //       .then((res) => {
  //         if (Array.isArray(res.data)) {
  //           setSuggestions(res.data);
  //           console.log("SUGGESTIONS FROM BACKEND", suggestions);
  //         } else {
  //           console.log("Unexpected response data:", res.data);
  //         }
  //       })
  //       .catch((err) => console.error(err));
  //   } else {
  //     setSuggestions([]);
  //   }
  // }, [practicePlan?.piece]);

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
      />
    </Box>
  );
};
