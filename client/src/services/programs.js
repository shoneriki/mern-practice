import axios from 'axios';
import { Programs } from '../pages/programs';

export async function fetchPrograms() {
  const res = await axios.get("http://localhost:3001/programs");
  const programs = res.data;

  const events = [];
  for (const program of programs) {
    let currentStartTime = new Date(program.date);
    let currentEndTime = new Date(program.date);

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
  }

  return events;
}

