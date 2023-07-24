import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../hooks/useGetUserID";

export const PiecesContext = createContext();

export const PiecesProvider = ({ children }) => {
  const [pieces, setPieces] = useState([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/pieces/user/${userID}`
        );
        setPieces(response.data);
      } catch (error) {
        console.error("Error fetching pieces:", error);
      }
    };

    if (userID) {
      fetchPieces();
    }
  }, [userID]);

  return (
    <PiecesContext.Provider
      value={{ pieces, setPieces, refreshKey, setRefreshKey }}
    >
      {children}
    </PiecesContext.Provider>
  );
};
