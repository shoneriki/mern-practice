import React from "react";

import {Box, Button, Grid, TextField, Radio, RadioGroup, FormControlLabel} from "@mui/material"

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
        name="Form Box"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={2} name="form-grid">
          <Grid item xs={12}>
            <TextField
              id="pieceTitle"
              name="pieceTitle"
              label="Piece Title"
              value={practicePlan.pieceTitle}
              onChange={handleChange}
              fullWidth
            />
            {suggestions.length > 0 && (
              <Box
                name="suggestion-box"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginTop: "2px",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((suggestion) => (
                  <Box
                    name="suggestion-item"
                    key={suggestion._id}
                    sx={{ padding: "4px", cursor: "pointer" }}
                    onClick={() => handleValueChange(suggestion)}
                  >
                    {suggestion.name} by {suggestion.composer},
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
          <Grid name="composer-grid" item xs={12}>
            <TextField
              id="composer"
              name="composer"
              label="Composer"
              value={practicePlan.composer}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="programName"
              name="programName"
              label="Program"
              value={practicePlan.programName}
              disabled
              fullWidth
            />
          </Grid>

          <Grid name="practiceStartDate-grid" item xs={12}>
            <TextField
              id="practiceStartDate"
              name="practiceStartDate"
              label="Date of Practice Start"
              type="date"
              value={practicePlan.practiceStartDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid name="daily-grid" item xs={12}>
            <RadioGroup
              row
              name="daily"
              value={practicePlan.daily}
              onChange={(event) => {
                handleChange({
                  target: {
                    name: event.target.name,
                    value: event.target.value === "true",
                  },
                });
              }}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Daily"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Not Daily"
              />
            </RadioGroup>
          </Grid>

          {!practicePlan.daily && (
            <Grid name="timesPerWeek-grid" item xs={12}>
              <TextField
                id="timesPerWeek"
                name="timesPerWeek"
                label="Times Per Week"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 7 } }}
                value={practicePlan.timesPerWeek}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          )}

          <Grid name="untilDate-grid" item xs={12}>
            <TextField
              id="untilDate"
              name="untilDate"
              label="Until Date"
              type="date"
              value={practicePlan.untilDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid name="practiceLengthInMinutes-grid" item xs={12}>
            <TextField
              id="practiceLengthInMinutes"
              name="practiceLengthInMinutes"
              label="Length of practice session(minutes)"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 1440 } }}
              value={practicePlan.practiceLengthInMinutes}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid name="notes-grid" item xs={12}>
            <TextField
              id="notes"
              name="notes"
              label="Extra notes"
              multiline
              rows={4}
              value={practicePlan.notes}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Add this inside your form, anywhere before the submit button */}
          <input
            type="hidden"
            name="programId"
            value={practicePlan.programId}
          />

          <Grid name="create-plan-btn-grid" item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Create Plan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};
