import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreatePracticePlan = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [practicePlan, setPracticePlan] = useState({
    pieceName: "",
    composer: "",
    excerpts: [],
    movements: "",
    endMetronomeGoal: 0,
    practiceDates: new Date().toISOString().split("T")[0],
    daily: false,
    timesPerWeek: 1,
    untilDate: new Date().toISOString().split("T")[0],
    practiceLengthInMinutes: 1,
    notes: "",
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPracticePlan({ ...practicePlan, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/practicePlans",
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
  };

  return (
    <div className="create-recipe">
      <h2>Create Practice Plan</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Piece Name">Piece Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={practicePlan.pieceName}
          onChange={handleChange}
        />
        <label htmlFor="Composer">Composer:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={practicePlan.composer}
          onChange={handleChange}
        />
        <label htmlFor="Practice Dates">Dates to Practice:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={practicePlan.practiceDates}
          onChange={handleChange}
        />

        {/*
          
    excerpts: [],
    movements: "",
    endMetronomeGoal: 0,
    practiceDates: new Date().toISOString().split("T")[0],
    daily: false,
    timesPerWeek: 1,
    untilDate: new Date().toISOString().split("T")[0],
    practiceLengthInMinutes: 1,
    notes: "",
         */}
      </form>
    </div>
  );
};
