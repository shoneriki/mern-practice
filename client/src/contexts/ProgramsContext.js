import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../hooks/useGetUserID";

export const ProgramsContext = createContext();

export const ProgramsProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const updatePrograms = (updatedPrograms) => {
    setPrograms(updatedPrograms);
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/programs/user/${userID}`
        );
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    if(userID) {
      fetchPrograms();
    }

  }, [userID]);

  return (
    <ProgramsContext.Provider
      value={{
        programs,
        setPrograms,
        refreshKey,
        setRefreshKey,
        updatePrograms,
      }}
    >
      {children}
    </ProgramsContext.Provider>
  );
};
