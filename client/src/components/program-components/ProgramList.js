import React, { useEffect, useState, useContext } from "react";
import { useGetUserID } from "../../hooks/useGetUserID";
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
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

import { ProgramsContext } from "../../contexts/ProgramsContext";

export const ProgramList = () => {
  const userID = useGetUserID();

  const navigate = useNavigate();

  const { programs, setPrograms, refreshKey, setRefreshKey } =
    useContext(ProgramsContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async (id) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/programs/user/${userID}`
        );
        console.log(
          "response.data from the program list component",
          response.data
        );
        if (response.data && response.data.length > 0) {
          const programs = await Promise.all(
            response.data.map(async (program) => {
              const pieces = await Promise.all(
                program.pieces.map(async (pieceId) => {
                  try {
                    const pieceResponse = await axios.get(
                      `${process.env.REACT_APP_API_URL}/pieces/piece/${pieceId}`
                    );
                    console.log("Piece response data: ", pieceResponse.data);
                    return pieceResponse.data;
                  } catch (error) {
                    console.error(
                      `Failed to fetch piece with id ${pieceId}: `,
                      error
                    );
                    return null;
                  }
                })
              ).then((pieces) => pieces.filter((piece) => piece !== null)); // Filter out any null pieces

              return {
                ...program,
                dateTime: new Date(program.date),
                pieces,
              };
            })
          );
          console.log("Programs:", programs);
          setPrograms(programs);
          console.log("programs after setPrograms?", programs);
          setLoading(false); // Set loading to false once all data has been fetched
        } else {
          setPrograms([]);
          setLoading(false); // Set loading to false if there are no programs
        }
      } catch (error) {
        console.error("error: ", error);
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [userID, setPrograms, refreshKey]);

  // edit functionality

  const handleEdit = (id) => {
    navigate(`/program/edit/${id}`);
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
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/programs/program/${id}`
      );
      console.log("Deleted");
      setOpen(false);
      setPrograms(programs.filter((program) => program._id !== id));
    } catch (err) {
      console.log("error: ", err);
    }
  };

  // end of delete functionality

  return (
    <>
      {loading ? (
        <section>Loading...</section>
      ) : (
        <Box className="programList" sx={{ width: "80%", margin: "2rem auto" }}>
          <Typography
            variant={"h4"}
            sx={{ textAlign: "center", margin: "1rem auto", width: "80%" }}
          >
            Programs
          </Typography>
          <Grid container spacing={3}>
            {Array.isArray(programs) && programs.length !== 0 ? (
              programs.map((program, programIndex) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={program._id}>
                    <Card
                      sx={{
                        border: "1px solid black",
                        borderRadius: "1rem",
                        padding: "1rem",
                        width: "80%",
                      }}
                    >
                      <CardContent>
                        <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                          Program No. {programIndex + 1}:
                        </Typography>
                        <Typography variant={"h6"}>{program.name}</Typography>
                        <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                          Date:
                        </Typography>
                        <Typography variant={"h6"}>
                          {format(
                            new Date(program.date),
                            "MMMM do, yyyy 'at' H:mm"
                          )}
                        </Typography>
                        <Box>
                          {program.pieces.map((piece, index) => {
                            const {
                              hours: pieceHours,
                              minutes: pieceMinutes,
                              seconds: pieceSeconds,
                            } = piece.length;
                            return (
                              <Box className="piece-display" key={piece._id}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                  Piece {index + 1}:
                                </Typography>
                                <Typography>{piece.name}</Typography>
                                <Typography sx={{ fontWeight: "bold" }}>
                                  Composer:
                                </Typography>
                                <Typography>{piece.composer}</Typography>
                                <Typography sx={{ fontWeight: "bold" }}>
                                  Length Of Piece:
                                </Typography>
                                <Typography>
                                  {pieceHours}hr: {pieceMinutes}min:{" "}
                                  {pieceSeconds}
                                  sec
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                        <Typography>
                          Intermission: {program.intermission} minutes
                        </Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Program Length:
                        </Typography>
                        <Typography>
                          {program.length.hours}hr: {program.length.minutes}
                          min: {program.length.seconds}sec
                        </Typography>
                      </CardContent>

                      <CardActions
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
                          onClick={() => handleEdit(program._id)}
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
                          onClick={() => handleClickOpen(program._id)}
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
                              onClick={() => handleDelete(program._id)}
                              color="primary"
                              autoFocus
                            >
                              Yes, Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Box sx={{ textAlign: "center", marginTop: "2rem", width: "100%" }}>
                <Typography variant="h6">
                  There are no programs yet. Would you like to add one?
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/program/create`)}
                >
                  Add Program?
                </Button>
              </Box>
            )}
          </Grid>
        </Box>
      )}
    </>
  );
};
