import React from "react";
import {
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";

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
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Program Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={program.name}
        onChange={handleChangeProgram}
      />
      <label htmlFor="date">Performance Date:</label>
      <input
        type="date"
        id="date"
        name="date"
        value={program.date}
        onChange={handleChangeProgram}
      />
      <label htmlFor="time">Performance Time:</label>
      <input
        type="time"
        id="time"
        name="time"
        value={program.time}
        onChange={handleChangeProgram}
      />
      {program.pieces.map((piece, pieceIndex) => {
        return (
          <Box key={pieceIndex} class="piece">
            <h3>Piece #{pieceIndex + 1}</h3>
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
            <div className="time-input">
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
            </div>
            {piece.movements.map((movement, movementIndex) => {
              return (
                <div key={movementIndex} className="movement">
                  <h4>Movement #{movementIndex + 1}</h4>
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
                </div>
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
      <label htmlFor="numOfPieces">Number of Pieces:</label>
      <input
        type="number"
        id="numOfPieces"
        name="numOfPieces"
        value={program.numOfPieces}
        onChange={handleChangeProgram}
      />
      <label htmlFor="intermission">Intermission?</label>
      <input
        type="number"
        id="intermission"
        name="intermission"
        value={program.intermission}
        onChange={handleChangeProgram}
      />
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
