import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

export function useFetchProgramsForCalendar() {
  const [programs, setPrograms] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchProgramsForCalendar = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/programs/user/${userID}`
        );
        const programs = res.data;

        console.log("HTTP status: ", res.status);

        if (programs && programs.length > 0) {
          const updatedPrograms = programs.map((program) => {
            let currentStartTime = new Date(program.date);
            let currentEndTime = new Date(program.date);
            const events = [];

            if (program.pieces) {
              console.log("Program.pieces: ", program.pieces);
              for (let i = 0; i < program.pieces.length; i++) {
                if (program.pieces[i].length) {
                  const pieceLengthInSeconds =
                    program.pieces[i].length.hours * 3600 +
                    program.pieces[i].length.minutes * 60 +
                    program.pieces[i].length.seconds;

                  currentEndTime = new Date(
                    currentEndTime.getTime() + pieceLengthInSeconds * 1000
                  );

                  events.push({
                    start: new Date(currentStartTime),
                    end: new Date(currentEndTime),
                    title: `${program.pieces[i].pieceTitle} by ${program.pieces[i].composer}`,
                  });

                  currentStartTime = new Date(currentEndTime.getTime());
                }
              }
            }

            currentEndTime = new Date(
              currentEndTime.getTime() + program.intermission * 60 * 1000
            );

            events.push({
              start: new Date(currentStartTime),
              end: new Date(currentEndTime),
              title: "Intermission",
            });

            return { ...program, events };
          });

          setPrograms(updatedPrograms);
        } else {
          setPrograms([]);
        }
      } catch (error) {
        console.error("Error fetching programs: ", error);
      }
    };

    fetchProgramsForCalendar();
  }, [userID]);

  return programs;
}
