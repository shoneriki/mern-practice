import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../css/calendar.scss";
import { fetchPrograms } from "../services/programs.js";

const localizer = momentLocalizer(moment);

export const ScheduledCalendar = (props) => {
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchPrograms().then((programs) => {
      setPrograms(programs);
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
    });
  }, []);


  const handleEventClick = (event) => {
    // Find the clicked program
    const program = programs.find((program) => program._id === event.programId);
    if (!program) {
      console.error(`Program not found: ${event.programId}`);
      return;
    }

    console.log(program.events);
  };

  return (
    <section>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
      />
    </section>
  );
};
