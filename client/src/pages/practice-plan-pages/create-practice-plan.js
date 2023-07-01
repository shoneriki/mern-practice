import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useForm } from "../../hooks/useForm";

import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Box, Grid, Typography } from "@mui/material";

import { PracticePlanForm } from "../../components/PracticePlanForm.js";

export const PracticePlanCreateEdit = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const { id } = useParams();

  const [programId, setProgramId] = useState(null);
  const {
    values: practicePlan,
    handleChange,
    handleSubmit,
    handleValueChange,
    handleChangeNested,
    handleChangeDeeplyNested,
  } = useForm({
    initialValues: {
      pieceTitle: "",
      composer: "",
      excerpts: [],
      movements: [
        {
          movementNumber: 1,
          shouldPractice: false,
          tempi: [
            {
              tempo: 0,
            },
          ],
          shouldSplitIntoExcerpts: false,
          excerpts: [
            {
              text: "",
              repetitions: 1,
              targetTempo: 60,
              endMetronomeGoal: 120,
            },
          ],
        },
      ],
      practiceStartDate: new Date().toISOString().split("T")[0],
      daily: false,
      timesPerWeek: 1,
      untilDate: new Date().toISOString().split("T")[0],
      practiceLengthInMinutes: 1,
      notes: "",

      programName: "",
      programId: "",

      userOwner: userID,
    },
    onValueChange: (suggestion) => {
      let formattedUntilDate = new Date().toISOString().split("T")[0];
      if (suggestion.programDate) {
        const programDate = new Date(suggestion.programDate);
        formattedUntilDate = programDate.toISOString().split("T")[0];
      }

      return {
        pieceTitle: suggestion.name,
        composer: suggestion.composer,
        programName: suggestion.programName,
        programId: suggestion.programId,
        untilDate: formattedUntilDate,
        movements: suggestion.movements,
      };
    },
  });

    useEffect(() => {
      const fetchEditData = async () => {
        if (id) {
          console.log("ID EXISTS!");
          console.log("id in fetch", id);
          try {
            console.log(
              "from inside try of fetchEditData from create-practice-plan page"
            );
            const response = await axios.get(
              `http://localhost:3001/practicePlans/practicePlan/${id}`
            );
            let practicePlanData = response.data;

            console.log("PRACTICEPLANDATA? From fetch", practicePlanData);


            // setProgram(programData);
          } catch (error) {
            console.log("Inside the fetchEditData catch");
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

  useEffect(() => {
    if (practicePlan.pieceTitle) {
      axios
        .get(
          `http://localhost:3001/programs/search?pieceTitle=${practicePlan.pieceTitle}`
        )
        .then((res) => {
          if (Array.isArray(res.data)) {
            setSuggestions(res.data);
            console.log("SUGGESTIONS FROM BACKEND", suggestions)
          } else {
            console.log("Unexpected response data:", res.data);
          }
        })
        .catch((err) => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [practicePlan.pieceTitle]);

  const navigate = useNavigate();

  const submitForm = async (practicePlan) => {
    try {
      await axios.post(
        `http://localhost:3001/practicePlans`,
        { ...practicePlan, programId },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      alert("Practice Plan Created");
      navigate("/practice-plans");
    } catch (error) {
      console.error(error);
    }
  };

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
      <PracticePlanForm
        practicePlan={practicePlan}
        handleChange={handleChange}
        handleValueChange={handleValueChange}
        handleSubmit={handleSubmit(submitForm)}
        suggestions={suggestions}
        handleChangeMovement={(e, index) =>
          handleChangeNested(e, "movements", index)
        }
      />
    </Box>
  );
};
