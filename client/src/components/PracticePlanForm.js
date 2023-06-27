import React from "react";

import {Box} from "@mui/material"

export const PracticePlanForm = ({
  practicePlan,
  handleValueChange,
  handleChange,
  handleSubmit,
  suggestions,
}) => {
  return (
    <form className="practice-plan-form" onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label htmlFor="pieceTitle">Piece Title:</label>
        <input
          type="text"
          id="pieceTitle"
          name="pieceTitle"
          value={practicePlan.pieceTitle}
          onChange={handleChange}
        />
        {suggestions.length > 0 && (
          <section
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "2px",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {suggestions.map((suggestion) => (
              <section
                key={suggestion._id}
                style={{ padding: "4px", cursor: "pointer" }}
                onClick={() => handleValueChange(suggestion)}
              >
                {suggestion.name} by {suggestion.composer},
              </section>
            ))}
          </section>
        )}
      </Box>
      <label htmlFor="Composer">Composer:</label>
      <input
        type="text"
        id="composer"
        name="composer"
        value={practicePlan.composer}
        onChange={handleChange}
      />

      <label htmlFor="Practice Start Date">Date of Practice Start:</label>
      <input
        type="date"
        id="practiceStartDate"
        name="practiceStartDate"
        value={practicePlan.practiceStartDate}
        onChange={handleChange}
      />
      <section>
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
      </section>
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
    </form>
  );
};
