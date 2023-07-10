import {useState, useEffect} from "react"
import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom"
import {PieceForm} from "../../components/piece-components/PieceForm.js"

import * as Yup from "yup";
import axios from "axios";

import {
  Box,
} from "@mui/material";

function AddPieceForm() {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const { id } = useParams();


  const seedData = {
    name: "Symphony No. 5",
    composer: "Ludwig van Beethoven",
    length: {
      hours: 1,
      minutes: 7,
      seconds: 30,
    },
    excerpts: [
      {
        location: "Allegro con brio",
        notes: "The piece begins with a four-note motif.",
        repetitions: 5,
        timeToSpend: {
          hours: 0,
          minutes: 15,
          seconds: 0,
        },
        tempi: [
          {
            notes: "Medium pace",
            bpm: 108,
          },
        ],
        mastered: false,
      },
      {
        location: "Andante con moto",
        notes: "This movement is in double variation form.",
        repetitions: 3,
        timeToSpend: {
          hours: 0,
          minutes: 10,
          seconds: 0,
        },
        tempi: [
          {
            notes: "Slow pace",
            bpm: 72,
          },
        ],
        mastered: false,
      },
    ],
    mastered: false,
    userOwner: userID,
  };

  const [piece, setPiece] = useState(null)

  const validationSchema = Yup.object({
    name: Yup.string(),
    composer: Yup.string(),
    length: Yup.object({
      hours: Yup.number().min(1).max(10),
      minutes: Yup.number().min(0).max(59),
      seconds: Yup.number().min(0).max(59),
    }),
    excerpts: Yup.array(
      Yup.object({
        location: Yup.string(),
        notes: Yup.string(),
        repetitions: Yup.number().min(0),
        timeToSpend: Yup.object({
          hours: Yup.number().min(0).max(10),
          minutes: Yup.number().min(0).max(59),
          seconds: Yup.number().min(0).max(59),
        }),
        tempi: Yup.array(
          Yup.object({
            notes: Yup.string(),
            bpm: Yup.number().min(10).max(300),
          })
        ),
        mastered: Yup.boolean(),
      })
    ),
    mastered: Yup.boolean(),
    userOwner: Yup.string().test(
      "userOwner",
      "User Owner ID does not match",
      (value) => value === userID
    ),
  });

      useEffect(() => {
        console.log("id from useEffect", id)
        const fetchEditData = async () => {
          if (id) {
            console.log("ID EXISTS!");
            console.log("id in fetch", id);
            try {
              console.log(
                "from inside try of fetchEditData from create-piece page"
              );
              const response = await axios.get(
                `http://localhost:3001/pieces/piece/${id}`
              );
              const pieceData = response.data;
              console.log("pieceData: ", pieceData)
              setPiece(pieceData)

              console.log("PIECE DATA? From fetch", pieceData);

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

      if(piece === null && id) {
        return (
          <section>
            Loading...
          </section>
        )
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
      />

    </Box>
  );
}

export default AddPieceForm;
