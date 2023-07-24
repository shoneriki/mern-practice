import { useState, useEffect } from "react";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PieceForm } from "../../components/piece-components/PieceForm.js";

import * as Yup from "yup";
import axios from "axios";

import { Box } from "@mui/material";

function AddPieceForm() {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const seedData = {
    name: "Piece",
    composer: "Composer",
    length: {
      hours: 0,
      minutes: 30,
      seconds: 0,
    },
    excerpts: [
      {
        location: "Spot 1, bars 20-50",
        notes: "needs attention in coordination",
        repetitions: 10,
        timeToSpend: {
          hours: 0,
          minutes: 15,
          seconds: 0,
        },
        tempi: [
          {
            notes: "speed for first part",
            bpm: 108,
          },
          {
            notes: "speed for second part",
            bpm: 120,
          },
        ],
        mastered: false,
      },
      {
        location: "Spot 2, bars 80-100",
        notes: "familiarize with passage",
        repetitions: 5,
        timeToSpend: {
          hours: 0,
          minutes: 10,
          seconds: 0,
        },
        tempi: [
          {
            notes: "Goal Tempo",
            bpm: 72,
          },
        ],
        mastered: false,
      },
    ],
    mastered: false,
    userOwner: userID,
  };

  const [piece, setPiece] = useState(null);

  const hourValidation = Yup.number().min(0).max(10);
  const timeValidation = Yup.number().min(0).max(59);

  const tempoValidation = Yup.object({
    notes: Yup.string(),
    bpm: Yup.number().min(10).max(300),
  });

  const excerptValidation = Yup.object({
    location: Yup.string(),
    notes: Yup.string(),
    repetitions: Yup.number().min(0),
    timeToSpend: Yup.object({
      hours: hourValidation,
      minutes: timeValidation,
      seconds: timeValidation,
    }),
    tempi: Yup.array(tempoValidation),
    mastered: Yup.boolean(),
  });

  const validationSchema = Yup.object({
    name: Yup.string(),
    composer: Yup.string(),
    length: Yup.object({
      hours: hourValidation,
      minutes: timeValidation,
      seconds: timeValidation,
    }),
    excerpts: Yup.array(excerptValidation),
    mastered: Yup.boolean(),
    userOwner: Yup.string().test(
      "userOwner",
      "User Owner ID does not match",
      (value) => value === userID
    ),
  });

  useEffect(() => {
    const fetchEditData = async () => {
      if (id) {

        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/pieces/piece/${id}`
          );
          const pieceData = response.data;
          setPiece(pieceData);
        } catch (error) {
          console.log("Inside the fetchEditData catch");
          console.error(
            "an error occurred while fetching the program: ",
            error
          );
        }
      }
    };
    fetchEditData();
  }, [id]);

  const onSubmit = async (values) => {
    try {
      if (id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/pieces/piece/${id}`,
          { ...values },
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("piece updated");
        navigate("/pieces");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/pieces`,
          { ...values },
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("piece created");
        navigate("/pieces");
      }
    } catch (error) {
      alert("I'm sorry, there's an error in submitting this form");
      console.log("error", error);
    }
  };

  if (piece === null && id) {
    return <section>Loading...</section>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
      }}
    >
      <PieceForm
        id={id}
        initialValues={piece || seedData}
        validationSchema={validationSchema}
        cookies={cookies}
        navigate={navigate}
        onSubmit={onSubmit}
      />
    </Box>
  );
}

export default AddPieceForm;
