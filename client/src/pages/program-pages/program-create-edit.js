import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Box } from "@mui/material";

import { ProgramForm } from "../../components/program-components/ProgramForm";

import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import {
  setProgram,
  addPieceToProgram,
  removePieceFromProgram,
  setTempProgram,
  addPieceToTempProgram,
  removePieceFromTempProgram,
} from "../../redux/programSlice";

export const ProgramCreateEdit = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const { id } = useParams();

  const navigate = useNavigate();
  const [program, setProgram] = useState({ pieces: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEditData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/programs/program/${id}`
          );
          let programData = response.data;

          // Converting 'dayjs' instances to strings
          programData.date = dayjs(programData.date);
          programData.time = dayjs(programData.time);

          if (Array.isArray(programData.pieces)) {
            // Fetch the full data for each piece
            const piecePromises = programData.pieces.map((pieceId) =>
              axios
                .get(`${process.env.REACT_APP_API_URL}/pieces/piece/${pieceId}`)
                .then((response) => response.data)
                .catch((error) => {
                  if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 404
                  ) {
                    // If the piece was not found, return null
                    return null;
                  } else {
                    // If it was another error, throw it to be caught by the outer catch block
                    throw error;
                  }
                })
            );
            let pieceResponses = await Promise.all(piecePromises);
            // Filter out any pieces that could not be fetched
            pieceResponses = pieceResponses.filter((piece) => piece !== null);
            // Update the program data with the fetched pieces
            programData.pieces = pieceResponses;
            await axios.put(
              `${process.env.REACT_APP_API_URL}/programs/program/${programData._id}`,
              programData
            );
          }
          setProgram(programData);
          

          setIsLoading(false);
        } catch (error) {
          console.error(
            "an error occurred while fetching the program: ",
            error
          );
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchEditData();
  }, [id]);

  //redux for pieces

  const currentProgram = useSelector((state) => {
    if (id) {
      return state.practiceSession.sessions[id];
    } else {
      return state.practiceSession.tempSession;
    }
  });

  //end of lone functions dealing with redux

  const onSubmit = async (data) => {
    console.log("is there data in this program form submission? Data: ", data);
    const dateTime = dayjs(data.date).format("YYYY-MM-DDTHH:mm:ss");

    try {
      const piecePromises = data.pieces.map((piece, pieceIndex) => {
        const pieceData = { ...piece, userOwner: userID };
        if (piece._id) {
          // If the piece has an ID, update the existing piece
          return axios
            .put(
              `${process.env.REACT_APP_API_URL}/pieces/piece/${piece._id}`,
              pieceData,
              {
                headers: { authorization: cookies.access_token },
              }
            )
            .then((response) => {
              if (!response || !response.data) {
                console.error("Invalid response:", response);
              }
              return response;
            })
            .catch((error) => {
              console.error("Error updating piece:", error);
              return null;
            });
        } else {
          // If the piece doesn't have an ID, create a new piece
          return axios
            .post(`${process.env.REACT_APP_API_URL}/pieces`, pieceData, {
              headers: { authorization: cookies.access_token },
            })
            .then((response) => {
              if (!response || !response.data) {
                console.error("Invalid response:", response);
              }
              return response;
            })
            .catch((error) => {
              alert("an error occurred");
              if (error.response) {
                console.error(error.response.data);
              } else {
                console.error(error);
              }
              // Return null if an error occurs
              return null;
            });
        }
      });

      const updatedPieces = await Promise.all(piecePromises);

      let totalLengthInSeconds = 0;
      for (let i = 0; i < updatedPieces.length; i++) {
        const piece = updatedPieces[i];
        if (piece && piece.data) {
          totalLengthInSeconds +=
            piece.data.length.hours * 3600 +
            piece.data.length.minutes * 60 +
            piece.data.length.seconds;
        }
      }

      totalLengthInSeconds += data.intermission * 60;

      const length = {
        hours: Math.floor(totalLengthInSeconds / 3600),
        minutes: Math.floor((totalLengthInSeconds % 3600) / 60),
        seconds: totalLengthInSeconds % 60,
      };

      const programData = {
        ...data,
        date: dateTime,
        length: length,
        pieces: updatedPieces.map((piece) => {
          if (!piece || !piece.data || !piece.data._id) {
            console.error("Invalid piece:", piece);
            return null;
          }
          return piece.data._id;
        }),
        userOwner: userID,
      };

      if (id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/programs/program/${id}`,
          programData,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("program updated");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/programs`,
          programData,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("New Program Added!");
      }
      navigate("/programs");
    } catch (error) {
      alert("an error occurred");
      console.error(error.response.data);
    }
  };

  if (isLoading) {
    return <section>Loading...</section>;
  }

  return (
    <Box className="create-program">
      <ProgramForm
        onSubmit={onSubmit}
        userID={userID}
        id={id}
        program={program}
        setProgram={setProgram}
      />
    </Box>
  );
};
