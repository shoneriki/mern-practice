import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

export function useFetchProgramsForCalendar() {
  const [programs, setPrograms] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchProgramsForCalendar = async () => {
      const res = await axios.get(`http://localhost:3001/programs/:${userID}`);
      const programs = res.data;
      console.log("res.data", res.data)
      if (programs && programs.length > 0) {
        const updatedPrograms = programs.map((program) => {
              let currentStartTime = new Date(program.date);
              let currentEndTime = new Date(program.date);
              const events = [];

              for (let i = 0; i < program.pieces.length; i++) {
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
                  title: `${program.pieces[i].name} by ${program.pieces[i].composer}`,
                });

                currentStartTime = new Date(currentEndTime.getTime());
              }

              currentEndTime = new Date(
                currentEndTime.getTime() + program.intermission * 60 * 1000
              );
              events.push({
                start: new Date(currentStartTime),
                end: new Date(currentEndTime),
                title: "Intermission",
              });

        });
        setPrograms(updatedPrograms);
      } else {
        setPrograms([]);
      }
    };

    fetchProgramsForCalendar();
  }, [userID]); // userID is a dependency, so we add it to dependency array

  return programs;
}
