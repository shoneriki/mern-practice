import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import {PracticePlanForm} from "../components/PracticePlanForm.js"

export const CreatePracticePlan = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [practicePlan, setPracticePlan] = useState({
    pieceName: "",
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
  });

  const [pieceName, setPieceName] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if(pieceName.length >= 2) {
      axios.get(`http://localhost:3001/programs/search?pieceName=${pieceName}`)
        .then(res => {
          setSuggestions(res.data);
        })
        .catch(err => console.error(err));
    }
  }, [pieceName])

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    // check if the name is 'daily'
    if (name === "daily") {
      const parsedValue = value === "true";
      setPracticePlan({ ...practicePlan, [name]: parsedValue });
    } else {
      setPracticePlan({ ...practicePlan, [name]: value });
    }
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
    <div className="create-practice-plan">
      <h2>Create Practice Plan</h2>
      <PracticePlanForm
        practicePlan={practicePlan}
        setPracticePlan={setPracticePlan}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        pieceName={pieceName}
        setPieceName={setPieceName}
        suggestions={suggestions}
      />
      {/* <form onSubmit={handleSubmit}>
        <label htmlFor="Composer">Composer:</label>
        <input
          type="text"
          id="composer"
          name="composer"
          value={practicePlan.composer}
          onChange={handleChange}
        />
        <div>
          <label htmlFor="pieceName">Piece Name:</label>
          <input
            type="text"
            id="pieceName"
            name="pieceName"
            value={pieceName}
            onChange={(e) => setPieceName(e.target.value)}
          />
          {suggestions.length > 0 && (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginTop: "2px",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  style={{ padding: "5px", cursor: "pointer" }}
                  onClick={() => {
                    setPieceName(suggestion.name);
                    setPracticePlan((prevPlan) => ({
                      ...prevPlan,
                      programId: suggestion.programId,
                    }));
                  }}
                >
                  {suggestion.name} by {suggestion.composer}
                </div>
              ))}
            </div>
          )}
        </div>

        <label htmlFor="Practice Start Date">Date of Practice Start:</label>
        <input
          type="date"
          id="practiceStartDate"
          name="practiceStartDate"
          value={practicePlan.practiceStartDate}
          onChange={handleChange}
        />
        <div>
          <label htmlFor="daily">Daily?</label>
          <input
            type="radio"
            id="daily-yes"
            name="daily"
            value={true}
            checked={practicePlan.daily === true}
            onChange={handleChange}
          />
          Yes
          <input
            type="radio"
            id="daily-no"
            name="daily"
            value={false}
            checked={practicePlan.daily === false}
            onChange={handleChange}
          />
          No
        </div>
        {!practicePlan.daily ? (
          <>
            <label htmlFor="timesPerWeek">Times Per Week</label>
            <input
              type="number"
              id="timesPerWeek"
              name="timesPerWeek"
              min="1"
              max="7"
              value={practicePlan.timesPerWeek}
              onChange={handleChange}
            />
          </>
        ) : null}
        <label htmlFor="untilDate">Until Date:</label>
        <input
          type="date"
          id="untilDate"
          name="untilDate"
          value={practicePlan.untilDate}
          onChange={handleChange}
        />
        <label htmlFor="practiceLengthInMinutes">
          Length of practice session(minutes)
        </label>
        <input
          type="number"
          id="practiceLengthInMinutes"
          name="practiceLengthInMinutes"
          value={practicePlan.practiceLengthInMinutes}
          onChange={handleChange}
        />
        <label htmlFor="notes">Extra notes?:</label>
        <textarea
          type="date"
          id="notes"
          name="notes"
          value={practicePlan.notes}
          onChange={handleChange}
        />
        <button type="submit">Create Plan</button>
      </form> */}
    </div>
  );
};
