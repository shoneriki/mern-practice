import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

export function useFetchPracticeSessionsForCalendar() {
  const [practiceSessions, setPracticeSessions] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchPracticeSessionsForCalendar = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/practiceSessions/user/${userID}`
        );
        const practiceSessions = res.data;

        console.log("practiceSessions res.data: ", res.data);

        if (practiceSessions && practiceSessions.length > 0) {
          const updatedPracticeSessions = practiceSessions.map(
            (practiceSession) => {
              let currentStartTime = new Date(practiceSession.dateOfExecution);
              let currentEndTime = new Date(practiceSession.dateOfExecution);
              const events = [];

              for (let i = 0; i < practiceSession.totalSessionLength; i++) {
                if (practiceSession.totalSessionLength) {
                  const practiceSessionLengthInSeconds =
                    practiceSession.totalSessionLength.hours * 3600 +
                    practiceSession.totalSessionLength.minutes * 60 +
                    practiceSession.totalSessionLength.seconds;

                  currentEndTime = new Date(
                    currentEndTime.getTime() +
                      practiceSessionLengthInSeconds +
                      1000
                  );

                  events.push({
                    start: new Date(currentStartTime),
                    end: new Date(currentEndTime),
                    title: `${practiceSession.name}`,
                  });
                }
              }
              return { ...practiceSession, events };
            }
          );

          setPracticeSessions(updatedPracticeSessions);
        } else {
          setPracticeSessions([]);
        }
      } catch (error) {
        console.error("Error fetching programs: ", error);
      }
    };

    fetchPracticeSessionsForCalendar();
  }, [userID]);

  return practiceSessions;
}
