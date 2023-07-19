import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Box } from "@mui/material";

import { ProgramForm } from "../../components/program-components/ProgramForm";
import  {ProgramFormRHL} from "../../components/program-components/ProgramFormRHL";

import dayjs from "dayjs";

export const ProgramCreateEdit = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const { id } = useParams();

  const navigate = useNavigate();
  const [program, setProgram] = useState({pieces: []})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEditData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:3001/programs/program/${id}`
          );
          let programData = response.data;
          console.log("programData: ", programData)

          // Converting 'dayjs' instances to strings
          programData.date = dayjs(programData.date);
          programData.time = dayjs(programData.time);

          if (Array.isArray(programData.pieces)) {
            // Fetch the full data for each piece
            const piecePromises = programData.pieces.map((pieceId) =>
              axios.get(`http://localhost:3001/pieces/piece/${pieceId}`)
            );
            const pieceResponses = await Promise.all(piecePromises);
            programData.pieces = pieceResponses.map(
              (response) => response.data
            );
          } else {
            programData.pieces = [];
          }
          setProgram(programData)
          setIsLoading(false)
        } catch (error) {
          console.error(
            "an error occurred while fetching the program: ",
            error
          );
          setIsLoading(false);
        }
      } else {
        setIsLoading(false)
      }
    };
    fetchEditData();
  }, [id]);

  // const onSubmit = async (data) => {
  //   const dateTime = dayjs(data.date).format("YYYY-MM-DDTHH:mm:ss");

  //   try {
  //     if (id) {
  //       await axios.put(
  //         `http://localhost:3001/programs/program/${id}`,
  //         { ...data, date: dateTime },
  //         {
  //           headers: { authorization: cookies.access_token },
  //         }
  //       );
  //       alert("program updated");
  //     } else {
  //       await axios.post(
  //         "http://localhost:3001/programs",
  //         { ...data, date: dateTime },
  //         {
  //           headers: { authorization: cookies.access_token },
  //         }
  //       );
  //       alert("New Program Added");
  //     }
  //     navigate("/");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  const onSubmit = async (data) => {
    console.log("is there data in this program form submission? Data: ", data);
    const dateTime = dayjs(data.date).format("YYYY-MM-DDTHH:mm:ss");
    console.log("userID:", userID);

    try {
      const piecePromises = data.pieces.map((piece, pieceIndex) => {
        const pieceData = { ...piece, userOwner: userID };
        console.log("pieceData? ", pieceData);
        if (piece._id) {
          // If the piece has an ID, update the existing piece
          return axios
            .put(`http://localhost:3001/pieces/piece/${piece._id}`, pieceData, {
              headers: { authorization: cookies.access_token },
            })
            .catch((error) => {
              console.error("Error updating piece:", error);
              return null;
            });
        } else {
          // If the piece doesn't have an ID, create a new piece
          return axios
            .post(`http://localhost:3001/pieces`, pieceData, {
              headers: { authorization: cookies.access_token },
            })
            .then((response) => {
              if (!response || !response.data) {
                console.error("Invalid response:", response);
              }
              return response.data;
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
        if (piece) {
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
          `http://localhost:3001/programs/program/${id}`,
          programData,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("program updated");
      } else {
        await axios.post(`http://localhost:3001/programs`, programData, {
          headers: { authorization: cookies.access_token },
        });
        alert("New Program Added!");
      }
      navigate("/programs");
    } catch (error) {
      alert("an error occurred");
      console.error(error.response.data);
    }
  };


  if (isLoading) {
    return <section>Loading...</section>
  }





  return (
    <Box className="create-program">
      {/* <ProgramForm onSubmit={onSubmit} /> */}
      <ProgramFormRHL
        onSubmit={onSubmit}
        userID={userID}
        id={id}
        program={program}
        setProgram={setProgram}
      />
    </Box>
  );
};
