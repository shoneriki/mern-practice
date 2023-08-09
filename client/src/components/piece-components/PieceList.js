import React, { useEffect, useState, useContext } from "react";
import { useGetUserID } from "../../hooks/useGetUserID";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { PieceForm } from "./PieceForm";
import { PiecesContext } from "../../contexts/PiecesContext";
import { ProgramsContext } from "../../contexts/ProgramsContext";

import { useDispatch, useSelector } from "react-redux";
import {
  addPieceToSession,
  removePieceFromSession,
} from "../../redux/practiceSessionSlice";

import {
  addPiece,
  removePiece,
} from "../../redux/piecesSlice"


import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Checkbox,
} from "@mui/material";

export const PieceList = () => {
  const userID = useGetUserID();

  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from;

  const [pieces, setPieces] = useState([]);

  // const [selectedPieces, setSelectedPieces] = useState(
  //   location.state?.selectedPieces.map((piece) => piece._id) || []
  // );

  const selectedPieces = useSelector((state) => state.selectedPieces);

  // beginning of using redux for storing the pieces for the practiceSession in the frontend to be added later into the backend




  const practiceSessionId = location.state?.practiceSessionId;
  const dispatch = useDispatch()

  const handleCheckboxChange = (event, pieceId) => {
    if (event.target.checked) {
      if (practiceSessionId) {
        // If editing a practice session, add the piece to the session
        dispatch(
          addPieceToSession({ sessionId: practiceSessionId, piece: pieceId })
        );
      } else {
        // If creating a practice session, add the piece to selected pieces
        dispatch(addPiece(pieceId));
      }
    } else {
      if (practiceSessionId) {
        // If editing a practice session, remove the piece from the session
        dispatch(
          removePieceFromSession({
            sessionId: practiceSessionId,
            piece: pieceId,
          })
        );
      } else {
        // If creating a practice session, remove the piece from selected pieces
        dispatch(removePiece(pieceId));
      }
    }
  };

  const programId = location.state?.programId;


  const handleSelect = () => {
    console.log("from: ",from);
    console.log("selectedPieces: ",selectedPieces)
    if (from === "practiceSession") {
      if(practiceSessionId) {
        console.log("selectedPieces from the edit", selectedPieces)
        navigate(`/practiceSession/edit/${practiceSessionId}`, {state: {selectedPieces}})
      } else {
        console.log("selectedPieces from the create", selectedPieces);
        navigate("/practiceSession/create", {state: {selectedPieces}})
      }
    } else if (from === "program") {
      if(programId) {
        navigate(`/program/edit/${programId}`, {state: {selectedPieces}})
      } else {
        navigate("/program/create", {state: {selectedPieces}})
      }
    }
  }



  // end of code to save pieces for the practiceSession in the

  const { setRefreshKey } = useContext(PiecesContext);

  const { updatePrograms } = useContext(ProgramsContext);

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/pieces/user/${userID}`
        );
        response.data && response.data.length > 0
          ? setPieces(
              response.data.map((piece) => ({
                ...piece,
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
    if(userID) {
      fetchPieces();
    }
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
        `${process.env.REACT_APP_API_URL}/programs/user/${userID}`
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
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/pieces/piece/${toDelete}`
      );
      setOpen(false);
      setPieces(pieces.filter((piece) => piece._id !== toDelete));
      setRefreshKey(Date.now());
      const updatedPrograms = await fetchUpdatedPrograms();
      updatePrograms(updatedPrograms);
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
      <Button variant="contained" color="primary" onClick={handleSelect}>
        {from === "practiceSession"
          ? `Select Pieces for Practice Session`
          : from === "program"
          ? `Select Pieces for the program`
          : `Your Pieces`}
      </Button>
      <Grid container spacing={3}>
        {pieces.map((piece) => {
          console.log("Piece ID:", piece._id);
          console.log("Selected Pieces:", selectedPieces);
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
                <Checkbox
                  checked={selectedPieces.includes(piece._id)}
                  onChange={(event) => handleCheckboxChange(event, piece._id)}
                />

                <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                  Piece Name:
                </Typography>
                <Typography variant={"h6"}>{piece.name}</Typography>
                <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                  Composer:
                </Typography>
                <Typography variant={"h6"}>{piece.composer}</Typography>
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
      <Box>
        <Typography variant={"h6"}>Selected Pieces:</Typography>
        {selectedPieces.map((pieceId) => {
          const piece = pieces.find((piece) => piece._id === pieceId);
          return (
            <Typography variant={"body1"} key={pieceId}>
              {piece?.name}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};
