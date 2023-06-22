import React, {useState, useEffect} from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import '../css/calendar.scss'
import {fetchPrograms} from "../services/programs.js"

const localizer = momentLocalizer(moment);

export const ScheduledCalendar = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchPrograms().then(fetchedEvents => setEvents(fetchedEvents));
  }, [])

  return (
    <section>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </section>
  )
};
