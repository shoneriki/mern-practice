import React, {useState} from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";


export const CreateProgram = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);


const initialTempo = 0;

const initialMovement = {
  number: 1,
  name: "",
  tempi: [initialTempo]
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

const [program, setProgram] = useState(initialProgram);


const navigate = useNavigate();

  const handleChangeProgram = (event) => {
    const { name, value } = event.target;
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
            tempi: [
              {
                tempo: 0,
              },
            ],
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


const addTempo = (pieceIndex, movementIndex) => {
  setProgram((prevState) => {
    const newPieces = [...prevState.pieces];
    const newMovements = [...newPieces[pieceIndex].movements];
    const newTempi = [...newMovements[movementIndex].tempi];

    newTempi.push(initialTempo);

    const newMovement = {
      ...newMovements[movementIndex],
      tempi: newTempi,
    };

    newMovements[movementIndex] = newMovement;
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


const handleChangeTempo = (event, pieceIndex, movementIndex, tempoIndex) => {
  const { value } = event.target;
  const tempoValue = Number(value); // Convert the value to a number
  setProgram((prevState) => {
    const newPieces = [...prevState.pieces];
    const newMovements = [...newPieces[pieceIndex].movements];
    const newTempi = [...newMovements[movementIndex].tempi];

    const newTempo = { ...newTempi[tempoIndex], tempo: tempoValue };

    newTempi[tempoIndex] = newTempo;

    const newMovement = {
      ...newMovements[movementIndex],
      tempi: newTempi,
    };

    newMovements[movementIndex] = newMovement;
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




  const addMovement = (pieceIndex) => {
    setProgram((prevState) => {
      const newPieces = [...prevState.pieces];
      const newMovements = [...newPieces[pieceIndex].movements];

      newMovements.push({
        number: newMovements.length + 1,
        name: "",
        tempi: [initialTempo],
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



  const handleSubmit = async (event) => {
    event.preventDefault();
    const dateTime = new Date(`${program.date}T${program.time}`).toISOString();
    try {
      await axios.post(
        "http://localhost:3001/programs",
        { ...program, date: dateTime },
        {
          headers: { authorization: cookies.access_token },
        }
      );
      alert("New Program Added");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

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
        {program.pieces.map((piece, pieceIndex) => {
          return (
            <div key={pieceIndex} class="piece">
              <h3>Piece #{pieceIndex + 1}</h3>
              <label htmlFor={`piece-${pieceIndex}-name`}>Piece Name:</label>
              <input
                id={`piece-${pieceIndex}-name`}
                name="name"
                value={piece.name}
                onChange={(event) => handleChangePiece(event, pieceIndex)}
              />
              <label htmlFor={`piece-${pieceIndex}-composer`}>Composer:</label>
              <input
                id={`piece-${pieceIndex}-composer`}
                name="composer"
                value={piece.composer}
                onChange={(event) => handleChangePiece(event, pieceIndex)}
              />
              <label htmlFor={`piece-${pieceIndex}-lengthInSeconds`}>
                Length:
              </label>
              <div className="time-input">
                <article>
                  <input
                    type="number"
                    id={`piece-${pieceIndex}-hours`}
                    name="length"
                    value={piece.length.hours}
                    onChange={(event) =>
                      handleChangePiece(event, pieceIndex, "hours")
                    }
                  />
                  <label htmlFor={`piece-${pieceIndex}-hours`}>hr</label>
                </article>
                <article>
                  <input
                    type="number"
                    id={`piece-${pieceIndex}-minutes`}
                    name="length"
                    value={piece.length.minutes}
                    onChange={(event) =>
                      handleChangePiece(event, pieceIndex, "minutes")
                    }
                  />
                  <label htmlFor={`piece-${pieceIndex}-minutes`}>min</label>
                </article>
                <article>
                  <input
                    type="number"
                    id={`piece-${pieceIndex}-seconds`}
                    name="length"
                    value={piece.length.seconds}
                    onChange={(event) =>
                      handleChangePiece(event, pieceIndex, "seconds")
                    }
                  />
                  <label htmlFor={`piece-${pieceIndex}-seconds`}>sec</label>
                </article>
              </div>
              {piece.movements.map((movement, movementIndex) => {
                return (
                  <div key={movementIndex} className="movement">
                    <h4>Movement #{movementIndex + 1}</h4>
                    <label
                      htmlFor={`piece-${pieceIndex}-movement-${movementIndex}-name`}
                    >
                      Movement Name:
                    </label>
                    <input
                      id={`piece-${pieceIndex}-movement-${movementIndex}-name`}
                      name="name"
                      value={movement.name}
                      onChange={(event) =>
                        handleChangeMovement(event, pieceIndex, movementIndex)
                      }
                    />

                    {movement.tempi.map((tempo, tempoIndex) => {
                      return (
                        <div key={tempoIndex} className="tempo">
                          <label
                            htmlFor={`piece-${pieceIndex}-movement-${movementIndex}-tempo-${tempoIndex}`}
                          >
                            Tempo:
                          </label>
                          <input
                            id={`piece-${pieceIndex}-movement-${movementIndex}-tempo-${tempoIndex}`}
                            name="tempo"
                            type="number"
                            onChange={(event) =>
                              handleChangeTempo(
                                event,
                                pieceIndex,
                                movementIndex,
                                tempoIndex
                              )
                            }
                          />
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => addTempo(pieceIndex, movementIndex)}
                    >
                      Add New Tempo?
                    </button>
                  </div>
                );
              })}

              <button type="button" onClick={() => addMovement(pieceIndex)}>
                Add New Movement?
              </button>

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
