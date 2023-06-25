import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { format } from "date-fns";

export const ProgramList = () => {

  const userID = useGetUserID();

  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/programs/${userID}`);
        console.log("",response)
        response.data && response.data.length > 0
          ? setPrograms(response.data)
          : setPrograms([]);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.log("Data:", error.response.data);
          console.log("Status:", error.response.status);
          console.log("Headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error:", error.message);
        }
      }
    };
    fetchPrograms();
  }, []);

  return (
    <section className="programList">
      <h1>Impending Programs</h1>
      <ul>
        {programs.map((program) => {
          return (
            <li key={program._id}>
              <section>
                <h2>{program.name}</h2>
                <h2>
                  Date:{" "}
                  {format(new Date(program.date), "MMMM do, yyyy 'at' H:mm")}
                </h2>
                <div>
                  {program.pieces.map((piece, index) => {
                    const {
                      hours: pieceHours,
                      minutes: pieceMinutes,
                      seconds: pieceSeconds,
                    } = piece.length;
                    return (
                      <div className="piece-display" key={piece._id}>
                        <h3>
                          Piece {index + 1}: {piece.name}
                        </h3>
                        <p>
                          Composer: {piece.composer}
                        </p>
                        <p>
                          Length: {pieceHours}hr:{" "}
                          {pieceMinutes}min: {pieceSeconds}sec
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p>Intermission: {program.intermission} minutes</p>
                <p>
                  Length: {program.length.hours}hr: {program.length.minutes}min:{" "}
                  {program.length.seconds}sec
                </p>
              </section>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
