import React, {useState} from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";


export const CreateProgram = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const [piece, setPiece] = useState({
    name: "",
    composer: "",
    length: {
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  })

  const [program, setProgram] = useState({
    name: "",
    numOfPieces: 1,
    pieces: [
      { name: "", composer: "", length: { hours: 0, minutes: 0, seconds: 0 } },
    ],
    length: "",
    date: "",
    time: "",
    userOwner: userID,
  });


  const navigate = useNavigate();

  const handleChangeProgram = (event) => {
    const {name, value} = event.target;
    setProgram({...program, [name]: value})
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


const addPiece = () => {
  setProgram({
    ...program,
    numOfPieces: program.numOfPieces + 1,
    pieces: [
      ...program.pieces,
      { name: "", composer: "", length: { hours: 0, minutes: 0, seconds: 0 } },
    ],
  });
};

  const handleSubmit = async(event) => {
    event.preventDefault();
    const dateTime = new Date(`${program.date}T${program.time}`).toISOString();
    try {
      await axios.post("http://localhost:3001/programs", {...program, date: dateTime}, {
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
        <label htmlFor="date">Performance Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={program.date}
          onChange={handleChangeProgram}
        />
        <label htmlFor="time">Performance Time:</label>
        <input
          type="time"
          id="time"
          name="time"
          value={program.time}
          onChange={handleChangeProgram}
        />
        {program.pieces.map((piece, index) => {
          return (
            <div key={index} class="piece">
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
              <label htmlFor={`piece-${index}-lengthInSeconds`}>Length:</label>
              <div className="time-input">
                <article>
                  <input
                    type="number"
                    id={`piece-${index}-hours`}
                    name="length"
                    value={piece.length.hours}
                    onChange={(event) => handleChangePiece(event, index, "hours")}
                  />
                  <label htmlFor={`piece-${index}-hours`}>hr</label>
                </article>
                <article>
                  <input
                    type="number"
                    id={`piece-${index}-minutes`}
                    name="length"
                    value={piece.length.minutes}
                    onChange={(event) =>
                      handleChangePiece(event, index, "minutes")
                    }
                  />
                  <label htmlFor={`piece-${index}-minutes`}>min</label>
                </article>
                <article>
                  <input
                    type="number"
                    id={`piece-${index}-seconds`}
                    name="length"
                    value={piece.length.seconds}
                    onChange={(event) =>
                      handleChangePiece(event, index, "seconds")
                    }
                  />
                  <label htmlFor={`piece-${index}-seconds`}>sec</label>
                </article>
              </div>

              <div className="btn-div">
                <button type="button" onClick={addPiece}>
                  Add New Piece?
                </button>
              </div>
            </div>
          );
        })}
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
        <button type="submit">Create Program</button>
      </form>
    </div>
  );
}
