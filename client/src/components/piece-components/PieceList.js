import React, { useEffect, useState, useContext } from "react";
import { useGetUserID } from "../../hooks/useGetUserID";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {PieceForm} from "./PieceForm"
import {PiecesContext} from "../../contexts/PiecesContext"
import {ProgramsContext} from "../../contexts/ProgramsContext"

import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";


export const PieceList = () => {
  const userID = useGetUserID();

  const navigate = useNavigate();

  const [pieces, setPieces] = useState([]);

  const {setRefreshKey} = useContext(PiecesContext)

  const {updatePrograms} = useContext(ProgramsContext)

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/pieces/user/${userID}`
        );
        console.log(
          "response.data from the pieces list component",
          response.data
        );
        response.data && response.data.length > 0
          ? setPieces(
              response.data.map((piece) => ({
                ...piece
              }))
            )
          : setPieces([]);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.log("Data:", error.response.data);
          console.log("Status:", error.response.status);
          console.log("Headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error:", error.message);
        }
      }
    };
    fetchPieces();
  }, [userID]);

  // edit functionality

  const handleEdit = (id) => {
    navigate(`/piece/edit/${id}`);
  };

  // end edit functionality

  // delete functionality

  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleClickOpen = (id) => {
    setOpen(true);
    setToDelete(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // when a piece is deleted, we fetch the updated programs (if the deleted piece was inside of the program)
  const fetchUpdatedPrograms = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/programs/user/${userID}`
      );
      console.log(
        "response.data from the updated programs fetch",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching updated programs:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log("id in toDelete", toDelete)
    try {
      await axios.delete(`http://localhost:3001/pieces/piece/${toDelete}`);
      setOpen(false);
      setPieces(pieces.filter((piece) => piece._id !== toDelete));
      setRefreshKey(Date.now())
      const updatedPrograms = await fetchUpdatedPrograms();
      updatePrograms(updatedPrograms)
      console.log("updated Programs?", updatedPrograms)
    } catch (err) {
      console.log("error: ", err);
    }
  };

  // end of delete functionality

  return (
    <Box
      className="piecelist"
      sx={{
        width: "80%",
      }}
    >
      <Typography
        variant={"h4"}
        sx={{ textAlign: "center", margin: "1rem auto" }}
      >
        List of Pieces
      </Typography>
      <Grid
        container
        spacing={3}
      >
        {pieces.map((piece) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={piece._id}>
              <Box
                name="piece-box"
                sx={{
                  border: "1px solid black",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                  Piece Name:
                </Typography>
                <Typography variant={"h6"}>
                  {piece.name}
                </Typography>
                <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                  Composer:
                </Typography>
                <Typography variant={"h6"}>
                  {piece.composer}
                </Typography>
                <Box
                  name="delete-edit-btn-box"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    name="edit-btn"
                    variant="contained"
                    color="warning"
                    onClick={() => handleEdit(piece._id)}
                  >
                    Edit?
                  </Button>
                  <Button
                    name="delete-btn"
                    variant="contained"
                    color="error"
                    onClick={() => handleClickOpen(piece._id)}
                  >
                    Delete
                  </Button>
                  <Dialog name="dialog" open={open} onClose={handleClose}>
                    <DialogTitle>
                      {"Are you sure you want to delete this piece?"}
                    </DialogTitle>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleDelete(piece._id)}
                        color="primary"
                        autoFocus
                      >
                        Yes, Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
