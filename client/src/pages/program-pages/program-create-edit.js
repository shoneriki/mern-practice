import React, { useEffect } from "react";
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

  useEffect(() => {
    const fetchEditData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:3001/programs/program/${id}`
          );
          let programData = response.data;

          // Converting 'dayjs' instances to strings
          programData.date = dayjs(programData.date);
          programData.time = dayjs(programData.time);
        } catch (error) {
          console.error(
            "an error occurred while fetching the program: ",
            error
          );
        }
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
    const dateTime = dayjs(data.date).format("YYYY-MM-DDTHH:mm:ss");
    console.log("userID:", userID);

    try {
      const piecePromises = data.pieces.map((piece, pieceIndex) => {
        if (piece._id) {
          // If the piece has an ID, update the existing piece
          return axios.put(`http://localhost:3001/pieces/${piece._id}`, piece, {
            headers: { authorization: cookies.access_token },
          });
        } else {
          // If the piece doesn't have an ID, create a new piece
          return axios
            .post(
              `http://localhost:3001/pieces`,
              { ...piece, userOwner: userID },
              {
                headers: { authorization: cookies.access_token },
              }
            )
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
            });
        }
      });

      const updatedPieces = await Promise.all(piecePromises);

      let totalLengthInSeconds = 0;
      for (let i = 0; i < updatedPieces.length; i++) {
        const piece = updatedPieces[i];
        totalLengthInSeconds +=
          piece.length.hours * 3600 +
          piece.length.minutes * 60 +
          piece.length.seconds;
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
        pieces: updatedPieces.map((piece) => {
          if (!piece || !piece._id) {
            console.error("Invalid piece:", piece);
            return null;
          }
          return piece._id;
        }),
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





  return (
    <Box className="create-program">
      {/* <ProgramForm onSubmit={onSubmit} /> */}
      <ProgramFormRHL onSubmit={onSubmit} userID={userID}/>
    </Box>
  );
};
