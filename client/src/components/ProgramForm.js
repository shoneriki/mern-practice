import React from "react";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Input,
  Typography,
  TextField,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export const ProgramForm = ({
  program,
  handleChangeProgram,
  handleChangePiece,
  removePiece,
  handleChangeMovement,
  addMovement,
  removeMovement,
  addPiece,
  handleSubmit,
}) => {
  const handleDateChange = (date) => {
    handleChangeProgram({ target: { name: "date", value: date } });
  };

  const handleTimeChange = (time) => {
    handleChangeProgram({ target: { name: "time", value: time } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ margin: "1rem 0 " }}>
        <InputLabel htmlFor="name">Program Name:</InputLabel>
        <Input
          type="text"
          id="name"
          name="name"
          value={program.name}
          onChange={handleChangeProgram}
        />
      </FormControl>
      <FormControl sx={{ margin: "1rem 0 " }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Performance Date"
            name="date"
            value={program.date}
            onChange={handleDateChange}
            renderInput={(props) => <TextField {...props} />}
          />
        </LocalizationProvider>
      </FormControl>
      <FormControl sx={{ margin: "1rem 0 " }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            type="time"
            id="time"
            name="time"
            value={program.time}
            onChange={handleTimeChange}
            renderInput={(props) => <TextField {...props} />}
          />
        </LocalizationProvider>
      </FormControl>
      {program.pieces.map((piece, pieceIndex) => {
        return (
          <Box key={pieceIndex} class="piece">
            <Typography variant={'h6'}>Piece #{pieceIndex + 1}</Typography>
            <label htmlFor={`piece-${pieceIndex}-name`}>Piece Name:</label>
            <input
              id={`piece-${pieceIndex}-name`}
              name="name"
              value={piece.name}
              onChange={(event) => handleChangePiece(event, pieceIndex)}
            />
            <label htmlFor={`piece-${pieceIndex}-composer`}>Composer:</label>
            <input
              id={`piece-${pieceIndex}-composer`}
              name="composer"
              value={piece.composer}
              onChange={(event) => handleChangePiece(event, pieceIndex)}
            />
            <label htmlFor={`piece-${pieceIndex}-lengthInSeconds`}>
              Length:
            </label>
            <section className="time-input">
              <article>
                <input
                  type="number"
                  id={`piece-${pieceIndex}-hours`}
                  name="length"
                  value={piece.length.hours}
                  onChange={(event) =>
                    handleChangePiece(event, pieceIndex, "hours")
                  }
                />
                <label htmlFor={`piece-${pieceIndex}-hours`}>hr</label>
              </article>
              <article>
                <input
                  type="number"
                  id={`piece-${pieceIndex}-minutes`}
                  name="length"
                  value={piece.length.minutes}
                  onChange={(event) =>
                    handleChangePiece(event, pieceIndex, "minutes")
                  }
                />
                <label htmlFor={`piece-${pieceIndex}-minutes`}>min</label>
              </article>
              <article>
                <input
                  type="number"
                  id={`piece-${pieceIndex}-seconds`}
                  name="length"
                  value={piece.length.seconds}
                  onChange={(event) =>
                    handleChangePiece(event, pieceIndex, "seconds")
                  }
                />
                <label htmlFor={`piece-${pieceIndex}-seconds`}>sec</label>
              </article>
            </section>
            {piece.movements.map((movement, movementIndex) => {
              return (
                <Box key={movementIndex} className="movement">
                  <Typography variant={'h6'}>Movement #{movementIndex + 1}</Typography>
                  <label
                    htmlFor={`piece-${pieceIndex}-movement-${movementIndex}-name`}
                  >
                    Movement Name:
                  </label>
                  <input
                    id={`piece-${pieceIndex}-movement-${movementIndex}-name`}
                    name="name"
                    value={movement.name}
                    onChange={(event) =>
                      handleChangeMovement(event, pieceIndex, movementIndex)
                    }
                  />
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "green",
                      margin: "1rem 0",
                      width: "100%",
                      "&:hover": {
                        backgroundColor: "purple",
                      },
                    }}
                    onClick={() => addMovement(pieceIndex)}
                  >
                    Add Another Movement?
                  </Button>
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "red",
                      width: "100%",
                      margin: "1rem 0",
                    }}
                    onClick={() => removeMovement(pieceIndex, movementIndex)}
                  >
                    Remove this movement
                  </Button>
                </Box>
              );
            })}
            <Button
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": {
                  backgroundColor: "darkred",
                },
              }}
              onClick={() => removePiece(pieceIndex)}
            >
              Remove this piece
            </Button>
          </Box>
        );
      })}
      <Button
        sx={{
          color: "white",
          backgroundColor: "green",
          margin: "1rem 0",
          width: "100%",
          "&:hover": {
            backgroundColor: "purple",
          },
        }}
        onClick={addPiece}
      >
        Add Another Piece?
      </Button>
      <FormControl>
        <InputLabel htmlFor="numOfPieces">Number of Pieces:</InputLabel>
        <Input
          type="number"
          id="numOfPieces"
          name="numOfPieces"
          value={program.numOfPieces}
          onChange={handleChangeProgram}
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="intermission">Intermission?</InputLabel>
        <Input
          type="number"
          id="intermission"
          name="intermission"
          value={program.intermission}
          onChange={handleChangeProgram}
        />
      </FormControl>
      <Button
        sx={{
          backgroundColor: "blue",
          color: "white",
          margin: "1rem 0",
          "&:hover": {
            backgroundColor: "lightblue",
          },
        }}
        type="submit"
      >
        Create Program
      </Button>
    </form>
  );
}
