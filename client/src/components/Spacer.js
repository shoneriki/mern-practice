
import React from "react";
import { Box } from "@mui/material";
import {NAVBAR_HEIGHT} from "./constants"

export const Spacer = () => {
  return (
    <Box sx={{ height: NAVBAR_HEIGHT }} /> // assuming your navbar height is '5rem'
  );
};
