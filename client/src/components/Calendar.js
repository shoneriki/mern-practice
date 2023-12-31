import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../css/calendar.scss";
import { useFetchProgramsForCalendar } from "../services/useFetchProgramsForCalendar.js";
import { useFetchPracticeSessionsForCalendar } from "../services/useFetchPracticeSessionsForCalendar.js";

import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

export const ScheduledCalendar = (props) => {
  const programs = useFetchProgramsForCalendar();
  const practiceSessions = useFetchPracticeSessionsForCalendar();
  const [events, setEvents] = useState([]);

  const navigate = useNavigate()

  const [practiceSessionEvents, setPracticeSessionEvents] = useState([])

  // Transform programs into events
  useEffect(() => {
    const programEvents = programs.map((program) => {
      const programDate = new Date(program.date);
      return {
        start: programDate,
        end: new Date(
          programDate.getTime() +
            program.length.hours * 3600 * 1000 +
            program.length.minutes * 60 * 1000 +
            program.length.seconds * 1000
        ),
        title: program.name,
        programId: program._id,
      };
    });
    setEvents(programEvents);
  }, [programs]);

  // useEffect(() => {
  //   const updatedPracticeSessionEvents = practiceSessions.map((practiceSession) => {
  //     const practiceSessionDate = new Date(practiceSession.dateOfExecution);
  //     return {
  //       start: practiceSessionDate,
  //       end: new Date(
  //         practiceSession.getTime() +
  //           practiceSession.totalSessionLength.hours * 3600 * 1000 +
  //           practiceSession.totalSessionLength.minutes * 60 * 1000 +
  //           practiceSession.totalSessionLength.seconds * 1000
  //       ),
  //       title: practiceSession.name,
  //       practiceSessionId: practiceSession._id,
  //     }
  //   })
  //   setPracticeSessionEvents(updatedPracticeSessionEvents)
  // }, [practiceSessions])

  const handleEventClick = (event) => {
    // Find the clicked program
    const program = programs.find((program) => program._id === event.programId);
    if (!program) {
      console.error(`Program not found: ${event.programId}`);
      return;
    }

    navigate(`/program/edit/${event.programId}`);
  };

  return (
    <section>
      <Calendar
        localizer={localizer}
        events={events}
        // practiceSessionEvents={practiceSessionEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
      />
    </section>
  );
};
