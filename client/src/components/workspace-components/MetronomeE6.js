import React, { useState, useEffect } from "react";
import click from "../assets/sounds/click.mp3";
import woodblock from "../assets/sounds/woodblock.mp3";
import { Button, Slider, Box } from "@mui/material";

export const MetronomeE6 = () => {
  const [metronome, setMetronome] = useState({
    isPlaying: false,
    count: 0,
    bpm: 60,
    beatsPerMeasure: 4,
    subdivision: 1,
    click1: new Audio(click),
    click2: new Audio(woodblock),
  });

  let timer = null;

  const handleInputChange = (e, newValue) => {
    setMetronome((prevState) => ({
      ...prevState,
      bpm: newValue,
    }));
  };

  const playClick = () => {
    setMetronome((prevState) => {
      if (prevState.count % prevState.beatsPerMeasure === 0) {
        prevState.click2.play();
      } else {
        prevState.click1.play();
      }
      return {
        ...prevState,
        count: (prevState.count + 1) % prevState.beatsPerMeasure,
      };
    });
  };

  const startStop = () => {
    if (metronome.isPlaying) {
      clearInterval(timer);
      setMetronome((prevState) => ({
        ...prevState,
        isPlaying: false,
      }));
    } else {
      timer = setInterval(playClick, (60 / metronome.bpm) * 1000);
      setMetronome((prevState) => ({
        ...prevState,
        count: 0,
        isPlaying: true,
      }));
    }
  };

  useEffect(() => {
    if (metronome.isPlaying) {
      playClick();
    }
  }, [metronome.isPlaying]);

  return (
    <Box sx={{ width: "80%" }} className="metronome">
      <Box className="bpm-slider">
        <p>{metronome.bpm} BPM</p>
        <Slider
          type="range"
          min={10}
          max={300}
          value={metronome.bpm}
          onChange={handleInputChange}
        />
      </Box>
      <Button onClick={startStop}>
        {metronome.isPlaying ? "Stop" : "Start"}
      </Button>
    </Box>
  );
};
