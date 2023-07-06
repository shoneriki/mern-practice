import {useEffect} from "react"
import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom"
import {PieceForm} from "../../components/PieceForm.js"

import * as Yup from "yup";
import axios from "axios";

function AddPieceForm() {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = {
    name: "",
    composer: "",
    length: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    //excerpt array of objects
    excerpts: [
      {
        location: "",
        notes: "",
        repetitions: 0,
        timeToSpend: {
          hours: 0,
          minutes: 0,
          seconds: 0,
        },
        tempi: [
          {
            notes: "",
            bpm: 60,
          },
        ],
      },
    ],
    userOwner: userID,
  };

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
      },
    ],
    userOwner: userID,
  };

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
      })
    ),
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
              let pieceData = response.data;

              console.log("PIECE DATA? From fetch", pieceData);

              // setProgram(programData);
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

  return (
    <PieceForm
      seedData={seedData}
      validationSchema={validationSchema}
      cookies={cookies}
      navigate={navigate}
    />
  );
}

export default AddPieceForm;
