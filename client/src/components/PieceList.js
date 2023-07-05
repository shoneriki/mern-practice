import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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

  useEffect(() => {
    const fetchPieces = async (id) => {
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
                ...piece,
                dateTime: new Date(piece.date),
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
  const [_, setToDelete] = useState(null);

  const handleClickOpen = (id) => {
    setOpen(true);
    setToDelete(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/pieces/piece/${id}`);
      console.log("Deleted");
      setOpen(false);
      setPieces(pieces.filter((piece) => piece._id !== id));
    } catch (err) {
      console.log("error: ", err);
    }
  };

  // end of delete functionality

  return (
    <h2>Pieces List</h2>
  );
};
