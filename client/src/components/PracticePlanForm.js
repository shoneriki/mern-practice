import React from "react";

import {Box, Button, Grid, Typography, TextField, Radio,Select, MenuItem, RadioGroup, FormControlLabel} from "@mui/material"

export const PracticePlanForm = ({
  practicePlan,
  handleValueChange,
  handleChange,
  handleSubmit,
  suggestions,
  handleChangeMovement,
  handleChangeDeeplyNested,
}) => {
  return (
    <form className="practice-plan-form" onSubmit={handleSubmit}>
      <Typography sx={{textAlign: "center", }} variant={'h6'}>Create Practice Plan</Typography>
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
                  maxHeight: "400px",
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

          {practicePlan.movements.map((movement, movementIndex) => (
            <Grid
              name="movement-grid"
              sx={{ backgroundColor: "orange" }}
              item
              xs={12}
            >
              <TextField
                id="movementNumber"
                name="movementNumber"
                label="Movement Number"
                type="number"
                value={movement.movementNumber}
                onChange={(e) => handleChangeMovement(e, 0)}
                fullWidth
              />
              <RadioGroup
                row
                name="shouldPractice"
                value={movement.shouldPractice}
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
                  label="Practice?"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="It's ok"
                />
              </RadioGroup>

              <RadioGroup
                row
                name="shouldSplitIntoExcerpts"
                value={movement.shouldSplitIntoExcerpts}
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
                  label="break it up?"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="It's ok"
                />
              </RadioGroup>

              {movement.shouldSplitIntoExcerpts &&
                movement.excerpts.map((excerpt, excerptIndex) => (
                  <Grid item xs={12}>
                    <TextField
                      id="text"
                      name="text"
                      label="Excerpt text"
                      value={excerpt.text}
                      onChange={(e) =>
                        handleChangeDeeplyNested(
                          e,
                          "movements",
                          movementIndex,
                          "excerpts",
                          excerptIndex
                        )
                      }
                    />
                    <TextField
                      id="repetitions"
                      name="repetitions"
                      label="Repetitions"
                      type="number"
                      value={excerpt.repetitions}
                      onChange={(e) =>
                        handleChangeDeeplyNested(
                          e,
                          "movements",
                          movementIndex,
                          "excerpts",
                          excerptIndex
                        )
                      }
                    />
                    <TextField
                      id="targetTempo"
                      name="targetTempo"
                      label="Target Tempo"
                      type="number"
                      value={excerpt.targetTempo}
                      onChange={(e) =>
                        handleChangeDeeplyNested(
                          e,
                          "movements",
                          movementIndex,
                          "excerpts",
                          excerptIndex
                        )
                      }
                    />
                    <Select
                      id="endMetronomeGoal"
                      name="endMetronomeGoal"
                      label="End Metronome Goal"
                      value={excerpt.endMetronomeGoal}
                      onChange={(e) =>
                        handleChangeDeeplyNested(
                          e,
                          "movements",
                          movementIndex,
                          "excerpts",
                          excerptIndex
                        )
                      }
                    >
                      {movement.tempi.map((tempi, tempiIndex) => (
                        <MenuItem value={tempi.tempo}>{tempi.tempo}</MenuItem>
                      ))}
                    </Select>
                  </Grid>
                ))}
            </Grid>
          ))}

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

          {/* programId hidden*/}
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
