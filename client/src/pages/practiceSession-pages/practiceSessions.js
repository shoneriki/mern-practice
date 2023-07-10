import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { format } from "date-fns";
import { Button } from "@mui/material";
import { PracticePlanList } from "../../components/practiceSession-components/PracticeSessionList";

export const PracticeSessions = () => {
  return <PracticePlanList />;
};
