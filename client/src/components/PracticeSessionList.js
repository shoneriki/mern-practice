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

  const [practiceSessions, setPracticeSessions] = useState([]);

    const fetchPracticeSessions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/practiceSessions/user/${userID}`
        );
        response.data && response.data.length > 0
          ? setPracticeSessions(
              response.data.map((practicePlan) => ({
                ...practicePlan,
              }))
            )
          : setPracticeSessions([]);
      } catch (error) {
        console.error("Error fetching practice plans:", error);
      }
    };

  useEffect(() => {
    fetchPracticeSessions();
  }, [userID]);

  // edit functionality

  const handleEdit = (id) => {
    console.log("id from handleEdit: ", id);
    navigate(`/practiceSession/edit/${id}`);
  };

  // end edit functionality

  // delete functionality

  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleClickOpen = (id) => {
    console.log("Opening delete dialog for ID:", id);
    setOpen(true);
    setToDelete(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    console.log("Deleting practice plan with ID:", toDelete);
    try {
      await axios.delete(
        `http://localhost:3001/practiceSessions/practiceSession/${toDelete}`
      );
      console.log("Deleted");
      setOpen(false);
      // setPracticePlans(
      //   practicePlans.filter((practicePlan) => practicePlan._id !== id)
      // );
      fetchPracticeSessions()
    } catch (err) {
      console.log("error: ", err);
    }
  };

  // end of delete functionality

  return (
    <Box className="practiceSessionsList">
      <Typography
        variant={"h4"}
        sx={{ textAlign: "center", margin: "1rem auto" }}
      >
        Impending Practice Plans
      </Typography>
      <Grid container spacing={3}>
        {practiceSessions.map((practiceSession) => {
          return (
            <Grid item sx={12} sm={6} md={4} key={practiceSession._id}>
              <Box sx={{ border: "1px solid black", padding: "1rem" }}>
                <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                  {practiceSession.piece}
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
                    onClick={() => handleEdit(practiceSession._id)}
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
                    onClick={() => handleClickOpen(practiceSession._id)}
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
                        onClick={handleDelete}
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
