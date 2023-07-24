import React, { useEffect, useState } from "react";
import { useGetUserID } from "../../hooks/useGetUserID";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
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

export const PracticeSessionList = () => {
  const userID = useGetUserID();

  const navigate = useNavigate();

  const [practiceSessions, setPracticeSessions] = useState([]);

  const fetchPracticeSessions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/practiceSessions/user/${userID}`
      );
      response.data && response.data.length > 0
        ? setPracticeSessions(
            response.data.map((practiceSession) => ({
              ...practiceSession,
            }))
          )
        : setPracticeSessions([]);
    } catch (error) {
      console.error("Error fetching practice plans:", error);
    }
  };

  useEffect(() => {
    if(userID) {
      fetchPracticeSessions();
    }
  }, [userID]);

  // edit functionality

  const handleEdit = (id) => {
    navigate(`/practiceSession/edit/${id}`);
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

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/practiceSessions/practiceSession/${toDelete}`
      );
      setOpen(false);
      fetchPracticeSessions();
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
        Practice Sessions
      </Typography>
      <Grid container spacing={3}>
        {practiceSessions.map((practiceSession, practiceSessionIndex) => {
          return (
            <Grid item sx={12} sm={6} md={4} key={practiceSessionIndex}>
              <Box
                sx={{
                  border: "1px solid black",
                  borderRadius: "1rem",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant={"h6"}
                  sx={{ fontWeight: "bold" }}
                  align="center"
                >
                  Title:
                </Typography>
                <Typography variant={"h6"} align="center">
                  {practiceSession.name}
                </Typography>
                <Box>
                  <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                    Length Of Session:
                  </Typography>
                  <Grid container sx={{ width: "50%" }}>
                    <Grid item sx={4} sm={4}>
                      <Typography>
                        {practiceSession.totalSessionLength.hours > 0
                          ? practiceSession.totalSessionLength.hours
                          : 0}
                        hr
                      </Typography>
                    </Grid>
                    <Grid item sx={4} sm={4}>
                      <Typography>
                        {practiceSession.totalSessionLength.minutes > 0
                          ? practiceSession.totalSessionLength.minutes
                          : 0}{" "}
                        min
                      </Typography>
                    </Grid>
                    <Grid item sx={4} sm={4}>
                      <Typography>
                        {practiceSession.totalSessionLength.seconds > 0
                          ? practiceSession.totalSessionLength.seconds
                          : 0}
                        sec
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Grid
                    id="piece"
                    container
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Grid item sx={12}>
                      <Typography
                        variant={"h6"}
                        sx={{ fontWeight: "bold" }}
                        align="center"
                      >
                        Piece Name:
                      </Typography>
                      <Typography variant={"h6"} align="center">
                        {practiceSession.piece.name}
                      </Typography>
                    </Grid>
                    <Grid item sx={12}>
                      <Typography
                        variant={"h6"}
                        sx={{ fontWeight: "bold" }}
                        align="center"
                      >
                        Composer:
                      </Typography>
                      <Typography variant={"h6"} align="center">
                        {practiceSession.piece.composer}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

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
                    variant="contained"
                    color="warning"
                    onClick={() => handleEdit(practiceSession._id)}
                  >
                    Edit?
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() =>
                      navigate(`/workspace/${practiceSession._id}`)
                    }
                  >
                    Go to Workspace
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
                      <Button onClick={handleDelete} color="primary" autoFocus>
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
