import React, { useState, useRef } from "react";
import { Button, Slider, Box, Typography } from "@mui/material";

export const Workspace = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const [bpm, setBpm] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [count, setCount] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const lookahead = 25.0;
  const scheduleAheadTime = 0.1;
  const nextNoteTime = useRef(audioContext.currentTime + 0.05);
  const timerID = useRef();
  const notesInQueue = useRef([]);

  function nextNote() {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime.current = nextNoteTime.current + secondsPerBeat;
    setCount((prevCount) => (prevCount + 1) % beatsPerMeasure);
  }

  function scheduleNote(beatNumber, time) {
    notesInQueue.current = notesInQueue.current.concat({
      note: beatNumber,
      time,
    });
    const osc = audioContext.createOscillator();
    osc.connect(audioContext.destination);
    if (beatNumber % beatsPerMeasure === 0) osc.frequency.value = 880.0;
    else osc.frequency.value = 440.0;
    osc.start(time);
    osc.stop(time + 0.05);
  }

  function scheduler() {
    while (
      nextNoteTime.current <
      audioContext.currentTime + scheduleAheadTime
    ) {
      scheduleNote(count, nextNoteTime.current);
      nextNote();
    }
    timerID.current = window.setTimeout(scheduler, lookahead);
  }

  function startStop() {
    setCount(0);
    nextNoteTime.current = audioContext.currentTime + 0.05;
    setPlaying((prevPlaying) => !prevPlaying);
    if (!playing) {
      scheduler();
    } else {
      window.clearTimeout(timerID.current);
      notesInQueue.current = [];
    }
  }

  function handleBpmChange(e, val) {
    setBpm(val);
    if(playing) {
      window.clearTimeout(timerID.current);
      notesInQueue.current = []
      setCount(0);
      nextNoteTime.current = audioContext.currentTime + 0.05;
      scheduler();
    }
  }

  return (
    <Box sx={{ width: 200 }}>
      <Typography id="input-slider" gutterBottom>
        Tempo (BPM) {bpm}
      </Typography>
      <Slider
        value={bpm}
        onChange={handleBpmChange}
        aria-labelledby="input-slider"
        valueLabelDisplay="auto"
        step={1}
        min={10}
        max={200}
      />
      <Button onClick={startStop}>{playing ? "Stop" : "Start"}</Button>
    </Box>
  );
};
