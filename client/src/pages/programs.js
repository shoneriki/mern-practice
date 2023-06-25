import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { format } from "date-fns";
import { Button } from "@mui/material";
import {ProgramList} from "../components/ProgramList"

export const Programs = () => {

  const userID = useGetUserID();

  const [programs, setPrograms] = useState([]);

// useEffect(() => {
//   const fetchPrograms = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/programs");

//       response.data && response.data.length > 0
//         ? setPrograms(response.data)
//         : setPrograms([]);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   fetchPrograms();
// }, []);

  return (
    <ProgramList/>
  )
}
