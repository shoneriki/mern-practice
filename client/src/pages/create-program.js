import React, {useState} from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

export const CreateProgram = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const [program, setProgram] = useState({
    name: "",
    numOfPieces: 1,
    pieces: [{name: "", composer: "", lengthInSeconds: 0}],
    length: "",
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChangeProgram = (event) => {
    const {name, value} = event.target;
    setProgram({...program, [name]: value})
  };

  const handleChangePiece = (event, index) => {
    const {name, value} = event.target;
    const newPieces = [...program.pieces];
    newPieces[index][name] = value;
    setProgram({...program, pieces: newPieces})
  };

  const addPiece = () => {
    setProgram({
      ...program,
      pieces: [...program.pieces, {name: "", composer: "", lengthInSeconds: 0}],
    });
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/programs", program, {
        headers: { authorization: cookies.access_token },
      });
      alert("New Program Added");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="create-program">
      <h2>Create Program</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Program Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={program.name}
          onChange={handleChangeProgram}
        />
        {program.pieces.map((piece, index) => {
          <div key={index}>
            <h3>Piece #{index + 1}</h3>
            <label htmlFor={`piece-${index}-name`}>Piece Name:</label>
            <input
              id={`piece-${index}-name`}
              name="name"
              value={piece.name}
              onChange={(event) => handleChangePiece(event, index)}
            />
            <label htmlFor={`piece-${index}-composer`}>Composer:</label>
            <input
              id={`piece-${index}-composer`}
              name="composer"
              value={piece.composer}
              onChange={(event) => handleChangePiece(event, index)}
            />
            <label htmlFor={`piece-${index}-lengthInSeconds`}>
              Piece Name:
            </label>
            <input
              id={`piece-${index}-lengthInSeconds`}
              name="lengthInSeconds"
              value={piece.lengthInSeconds}
              onChange={(event) => handleChangePiece(event, index)}
            />
          </div>;
        })}
        <button type="button" onClick={addPiece}>
          Add Piece?
        </button>
        <label htmlFor="numOfPieces">Number of Pieces:</label>
        <input
          type="number"
          id="numOfPieces"
          name="numOfPieces"
          value={program.numOfPieces}
          onChange={handleChangeProgram}
        />
        <label htmlFor="intermission">Intermission?</label>
        <input
          type="number"
          id="intermission"
          name="intermission"
          value={program.intermission}
          onChange={handleChangeProgram}
        />
        {/* <label htmlFor="length">Program Length:</label>
        <index
          type="text"
          id="length"
          name="length"
          value={program.length}
          onChange={handleChangeProgram}
        /> */}
        <button type="submit">Create Program</button>
      </form>
    </div>
  );
}

/*
      name: {
      type: String,
      required: true,
    },
    numOfPieces: {
      type: Number,
      required: true,
    },
    pieces: [pieceSchema],
    intermission: {
      type: Number,
    },
    length: {
      type: String,
    },
*/
