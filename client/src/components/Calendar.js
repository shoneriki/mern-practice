import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import '../css/calendar.scss'

const localizer = momentLocalizer(moment);

export const ScheduledCalendar = (props) => (
  <div>
    <Calendar
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
);
