import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { format } from "date-fns";

import {Box, Typography, Grid} from "@mui/material"

export const ProgramList = () => {

  const userID = useGetUserID();

  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/programs/${userID}`);

        console.log("response.data ", response.data)
        response.data && response.data.length > 0
          ? setPrograms(response.data)
          : setPrograms([]);
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
    fetchPrograms();
  }, []);

  return (
    <Box className="programList">
      <Typography variant={'h4'} sx={{textAlign: "center", margin: "1rem auto"}}>Impending Programs</Typography>
      <Grid container spacing={3}>
        {programs.map((program) => {
          return (
            <Grid item sx={12} sm={4} spacing={3} key={program._id}>
              <Box sx={{border: "1px solid black", padding: "1rem"}}>
                <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                  {program.name}
                </Typography>
                <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
                  {format(new Date(program.date), "MMMM do, yyyy 'at' H:mm")}
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
                        <Typography sx={{fontWeight: "bold"}}>
                          Piece {index + 1}: {piece.name}
                        </Typography>
                        <Typography sx={{fontWeight: "bold"}}>Composer: {piece.composer}</Typography>
                        <Typography>
                          Length: {pieceHours}hr: {pieceMinutes}min:{" "}
                          {pieceSeconds}sec
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                <Typography>Intermission: {program.intermission} minutes</Typography>
                <Typography>
                  Length: {program.length.hours}hr: {program.length.minutes}min:{" "}
                  {program.length.seconds}sec
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
