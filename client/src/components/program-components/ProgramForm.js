import React, {useEffect} from "react";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  Grid,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import {useLocation} from "react-router-dom";

export const ProgramForm = ({
  program,
  handleChangeProgram,
  handleChangePiece,
  removePiece,
  addPiece,
  handleSubmit,
  id,
  handleDateTimeChange
}) => {
  console.log("program from ProgramForm component", program);



  return (
    <Box sx={{ "& > *": { mt: 2, mb: 2 } }}>
      <Typography sx={{ textAlign: "center" }} variant={"h6"}>
        Program
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <TextField
                type="text"
                id="name"
                name="name"
                label="Title:"
                value={program.name}
                onChange={handleChangeProgram}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date and Time"
                  name="date"
                  value={dayjs(program.date)}
                  onChange={(datetime) => handleDateTimeChange(datetime)}
                  renderInput={(props) => <TextField {...props} fullWidth />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          {program.pieces.map((piece, pieceIndex) => {
            return (
              <Grid
                sx={{ textAlign: "center" }}
                container
                spacing={1}
                key={pieceIndex}
              >
                <Grid item xs={12} sm={12}>
                  <Typography variant={"h6"}>
                    Piece #{pieceIndex + 1}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      id={`piece-${pieceIndex}-name`}
                      label="Piece Name"
                      name="name"
                      value={piece.name}
                      onChange={(event) => handleChangePiece(event, pieceIndex)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      id={`piece-${pieceIndex}-composer`}
                      label="Composer"
                      name="composer"
                      value={piece.composer}
                      onChange={(event) => handleChangePiece(event, pieceIndex)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor={`piece-${pieceIndex}-lengthInSeconds`}>
                    Length:
                  </InputLabel>
                  <Grid container spacing={1}>
                    <Grid item xs={4} sm={4}>
                      <TextField
                        type="number"
                        id={`piece-${pieceIndex}-hours`}
                        label="Hours"
                        name="length"
                        min="1"
                        max="10"
                        value={piece.length.hours}
                        onChange={(event) =>
                          handleChangePiece(event, pieceIndex, "hours")
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <TextField
                        type="number"
                        id={`piece-${pieceIndex}-minutes`}
                        name="length"
                        label="Minutes"
                        value={piece.length.minutes}
                        onChange={(event) =>
                          handleChangePiece(event, pieceIndex, "minutes")
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <TextField
                        type="number"
                        id={`piece-${pieceIndex}-seconds`}
                        name="length"
                        label="Seconds"
                        value={piece.length.seconds}
                        onChange={(event) =>
                          handleChangePiece(event, pieceIndex, "seconds")
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Button
                  sx={{
                    backgroundColor: "#E53935",
                    color: "white",
                    margin: "1rem 0",
                    "&:hover": {
                      backgroundColor: "#C62828 ",
                    },
                  }}
                  onClick={() => removePiece(pieceIndex)}
                  fullWidth
                >
                  Remove this piece
                </Button>
              </Grid>
            );
          })}
          <Button
            sx={{
              color: "white",
              backgroundColor: "#34B96F",
              margin: "1rem auto",
              "&:hover": {
                backgroundColor: "#2D944F",
              },
            }}
            onClick={addPiece}
          >
            Add Another Piece?
          </Button>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <TextField
                type="number"
                id="numOfPieces"
                label="Number of Pieces"
                name="numOfPieces"
                value={program.numOfPieces}
                onChange={handleChangeProgram}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <TextField
                type="number"
                id="intermission"
                label="intermission?"
                name="intermission"
                value={program.intermission}
                onChange={handleChangeProgram}
              />
            </FormControl>
          </Grid>
          <Button
            sx={{
              backgroundColor: "#0074D9",
              color: "white",
              margin: "1rem auto",
              "&:hover": {
                backgroundColor: "#005CBF",
              },
            }}
            type="submit"
          >
            Create Program
          </Button>
        </Grid>
      </form>
    </Box>
  );
}
