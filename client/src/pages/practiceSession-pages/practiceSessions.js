import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { format } from "date-fns";
import { Button, Box } from "@mui/material";
import { PracticeSessionList } from "../../components/practiceSession-components/PracticeSessionList";
import { ScheduledCalendar } from "../../components/Calendar";

export const PracticeSessions = () => {
  return (
    <Box
      sx={{
        width: "80%"
      }}
    >
      <PracticeSessionList />;
      <ScheduledCalendar/>;
    </Box>
  )
};
