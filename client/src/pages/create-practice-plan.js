import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import {useForm} from "../hooks/useForm"

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import {PracticePlanForm} from "../components/PracticePlanForm.js"

export const CreatePracticePlan = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const {
    values: practicePlan,
    handleChange,
    handleSubmit,
    handleValueChange,
  } = useForm({
    initialValues: {
      pieceTitle: "",
      composer: "",
      excerpts: [],
      movements: "",
      endMetronomeGoal: 0,
      practiceStartDate: new Date().toISOString().split("T")[0],
      daily: false,
      timesPerWeek: 1,
      untilDate: new Date().toISOString().split("T")[0],
      practiceLengthInMinutes: 1,
      notes: "",
      userOwner: userID,
    },
    onValueChange: (suggestion) => ({
      pieceTitle: suggestion.pieceTitle,
      composer: suggestion.composer,
    }),
  });


  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (practicePlan.pieceTitle && practicePlan.pieceTitle.length >= 2) {
      axios
        .get(`http://localhost:3001/programs/search?pieceTitle=${practicePlan.pieceTitle}`)
        .then((res) => {
          console.log("res.data ?", res.data);
          if (Array.isArray(res.data)) {
            console.log("inside the isArray", res.data)
            setSuggestions(res.data);
          } else {
            console.log("Unexpected response data:", res.data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [practicePlan.pieceTitle]);


  const navigate = useNavigate();

  const submitForm = async (practicePlan) => {
    try {
      await axios.post(
        `http://localhost:3001/practicePlans`,
        { ...practicePlan },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      alert("Practice Plan Created");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="create-practice-plan">
      <h2>Create Practice Plan</h2>
      <PracticePlanForm
        practicePlan={practicePlan}
        handleChange={handleChange}
        handleValueChange={handleValueChange}
        handleSubmit={handleSubmit(submitForm)}
        suggestions={suggestions}
      />
    </div>
  );
};
