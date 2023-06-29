import React, {useState, useEffect} from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import {useNavigate, useParams} from "react-router-dom";
import {useCookies} from "react-cookie";

import {Box, Typography} from "@mui/material"

import {ProgramForm} from "../components/ProgramForm"

import dayjs from "dayjs"

export const CreateProgram = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const {id} = useParams();


const initialMovement = {
  number: 1,
  name: "",
};

const initialPiece = {
  name: "",
  composer: "",
  length: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  movements: [initialMovement]
}

const initialProgram = {
  name: "",
  numOfPieces: 1,
  pieces: [initialPiece],
  length: "",
  date: "",
  time: "",
  userOwner: userID,
}

const dataObject = dayjs('2024-01-01')
const timeObject = dayjs("2024-01-01T12:00:00");

const seedData = {
  name: "Test Program",
  date: dataObject,
  time: timeObject,
  pieces: [
    {
      name: "Test Piece 1",
      composer: "Test Composer 1",
      length: {
        hours: 1,
        minutes: 30,
        seconds: 0,
      },
      movements: [
        {
          name: "Test Movement 1",
        },
        {
          name: "Test Movement 2",
        },
      ],
    },
    {
      name: "Test Piece 2",
      composer: "Test Composer 2",
      length: {
        hours: 0,
        minutes: 45,
        seconds: 0,
      },
      movements: [
        {
          name: "Test Movement 1",
        },
        {
          name: "Test Movement 2",
        },
      ],
    },
  ],
  numOfPieces: 2,
  intermission: 15,
  userOwner: userID,
};

const [program, setProgram] = useState(seedData);

const navigate = useNavigate();

useEffect(() => {
  const fetchEditData = async () => {
    if (id) {
      console.log("id from fetchEditDate from create-program page", id)
      console.log("program from the if inside fetchEditData", program)
      try {
        console.log("from inside try of fetchEditData from create-program page")
        const response = await axios.get(
          `http://localhost:3001/program/${id}`
          );
          let programData = response.data;
          console.log("programData from fetchEditData", programData)

          // Converting 'dayjs' instances to strings
          programData.date = dayjs(programData.date).format("YYYY-MM-DD");
          programData.time = dayjs(programData.time).format("HH:mm:ss");

          console.log("Program Data from server: ", programData)

          setProgram(programData);
        } catch (error) {
        console.log("Inside the fetchEditData catch")
        console.error("an error occurred while fetching the program: ", error);
      }
    }
  };
  fetchEditData();
}, [id]);


const handleChangeProgram = (event) => {
  const { name, value } = event.target;
  console.log("Program State from handleChangeProgram: " , program);
  setProgram({ ...program, [name]: value });
};

const addPiece = () => {
  setProgram({
    ...program,
    numOfPieces: program.numOfPieces + 1,
    pieces: [
      ...program.pieces,
      {
        name: "",
        composer: "",
        length: { hours: 0, minutes: 0, seconds: 0 },
        movements: [
          {
            name: "",
          },
        ],
      },
    ],
  });
};


  const handleChangePiece = (event, index, subfield) => {
    const { name, value } = event.target;
    setProgram((prevState) => {
      const newPieces = [...prevState.pieces];
      if (subfield) {
        newPieces[index][name][subfield] = Number(value);
      } else {
        newPieces[index][name] = value;
      }
      return {
        ...prevState,
        pieces: newPieces,
      };
    });
  };

  const addMovement = (pieceIndex) => {
    setProgram((prevState) => {
      const newPieces = [...prevState.pieces];
      const newMovements = [...newPieces[pieceIndex].movements];

      newMovements.push({
        number: newMovements.length + 1,
        name: "",
      });

      newPieces[pieceIndex] = {
        ...newPieces[pieceIndex],
        movements: newMovements,
      };

      return {
        ...prevState,
        pieces: newPieces,
      };
    });
  };

  const handleChangeMovement = (event, pieceIndex, movementIndex) => {
    const { name, value } = event.target;
    setProgram((prevState) => {
      const newPieces = [...prevState.pieces];
      const newMovements = [...newPieces[pieceIndex].movements];

      newMovements[movementIndex] = {
        ...newMovements[movementIndex],
        [name]: value,
      };

      newPieces[pieceIndex] = {
        ...newPieces[pieceIndex],
        movements: newMovements,
      };

      return {
        ...prevState,
        pieces: newPieces,
      };
    });
  };

  const removePiece = (pieceIndex) => {
    setProgram((prevState) => {
      if (prevState.pieces.length <= 1) {
        alert("At least one piece must remain.");
        return prevState;
      }
      const newPieces = [...prevState.pieces];
      newPieces.splice(pieceIndex, 1);
      return {
        ...prevState,
        numOfPieces: prevState.numOfPieces - 1,
        pieces: newPieces,
      };
    });
  };

  const removeMovement = (pieceIndex, movementIndex) => {
    setProgram((prevState) => {
      const newPieces = [...prevState.pieces];
      if (newPieces[pieceIndex].movements.length <= 1) {
        alert("At least one movement must remain in each piece.");
        return prevState;
      }
      const newMovements = [...newPieces[pieceIndex].movements];
      newMovements.splice(movementIndex, 1);
      newPieces[pieceIndex] = {
        ...newPieces[pieceIndex],
        movements: newMovements,
      };
      return {
        ...prevState,
        pieces: newPieces,
      };
    });
  };



const handleSubmit = async (event) => {
  event.preventDefault();
  const dateString = program.date.format("YYYY-MM-DD");
  const timeString = program.time.format("HH:mm:ss");
  const dateTime = new Date(`${dateString}T${timeString}`).toISOString();


  try {
    if (id) {
      console.log("inside the edit submit path in create-program page")
      await axios.put(
        `http://localhost:3001/programs/program/${id}`,
        {...program, date: dateTime},
        {
          headers: {authorization: cookies.access_token },
        }
      );
      alert("program updated")
    } else {
      await axios.post(
        "http://localhost:3001/programs",
        { ...program, date: dateTime },
        {
          headers: { authorization: cookies.access_token },
        }
      );
      alert("New Program Added");
    }
    navigate("/");
  } catch (error) {
    console.error(error);
  }
};


  return (
    <Box className="create-program">
      <Typography variant={'h6'}>Program</Typography>
      <ProgramForm
        program={program}
        handleChangeProgram={handleChangeProgram}
        handleChangePiece={handleChangePiece}
        removePiece={removePiece}
        handleChangeMovement={handleChangeMovement}
        addMovement={addMovement}
        removeMovement={removeMovement}
        addPiece={addPiece}
        handleSubmit={handleSubmit}
        id={id}
      />
    </Box>
  );
}
