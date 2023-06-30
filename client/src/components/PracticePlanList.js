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

export const PracticePlanList = () => {
  const userID = useGetUserID();

  const navigate = useNavigate();

  const [practicePlans, setPracticePlans] = useState([]);

  useEffect(() => {
    const fetchPracticePlans = async (id) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/practicePlans/user/${userID}`
        );
        console.log(
          "response.data from the practice plan list component",
          response.data
        );
        response.data && response.data.length > 0
          ? setPracticePlans(
              response.data.map((practicePlan) => ({
                ...practicePlan
              }))
            )
          : setPracticePlans([]);
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
    fetchPracticePlans();
  }, [userID]);

  // edit functionality

  const handleEdit = (id) => {
    navigate(`/practiceplan/edit/${id}`);
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
      await axios.delete(`http://localhost:3001/practiceplans/practiceplan/${id}`);
      console.log("Deleted");
      setOpen(false);
      setPracticePlans(practicePlans.filter((practicePlan) => practicePlan._id !== id));
    } catch (err) {
      console.log("error: ", err);
    }
  };

  // end of delete functionality

  return (
    <Box className="programList">
      <Typography
        variant={"h4"}
        sx={{ textAlign: "center", margin: "1rem auto" }}
      >
        Impending Practice Plans
      </Typography>
      <Grid container spacing={3}>
        {practicePlans.map((practicePlan) => {
          return (
            <Grid item sx={12} sm={6} md={4} key={practicePlan._id}>
              <Box sx={{ border: "1px solid black", padding: "1rem" }}>
                <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                  {practicePlan.pieceTitle}
                </Typography>
                <Box
                  name="delete-edit-btn-box"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    name="edit-btn"
                    variant="outlined"
                    sx={{
                      backgroundColor: "yellow",
                      color: "black",
                      border: "none",
                      "&:hover": {
                        backgroundColor: "orange",
                        border: "none",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleEdit(practicePlan._id)}
                  >
                    Edit?
                  </Button>
                  <Button
                    name="delete-btn"
                    variant="outlined"
                    sx={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      "&:hover": {
                        backgroundColor: "darkred",
                        border: "none",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleClickOpen(practicePlan._id)}
                  >
                    Delete
                  </Button>
                  <Dialog name="dialog" open={open} onClose={handleClose}>
                    <DialogTitle>
                      {"Are you sure you want to delete this program?"}
                    </DialogTitle>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleDelete(practicePlan._id)}
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
