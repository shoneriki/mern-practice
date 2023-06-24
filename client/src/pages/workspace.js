import React from "react";
import {Metronome} from "../components/Metronome"
// import {MetronomeE6} from "../components/MetronomeE6"
import {Counter} from "../components/Counter"
import { Box } from "@mui/material";


export const Workspace = () => {


  return (
    <Box
      sx={{
        height: "100vh",
        width: "90%",
        margin: "auto 0",
      }}
    >
      <Metronome />
      <Counter/>
    </Box>
  );
};
