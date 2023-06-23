import React, { Component } from "react";
import click from "../assets/sounds/click.mp3"
import woodblock from "../assets/sounds/woodblock.mp3"
import drumstick from "../assets/sounds/drumstick.mp3"

import { Button, Slider, Box, Typography, Input, InputAdornment} from "@mui/material";


export class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      count: 0,
      bpm: 60,
      beatsPerMeasure: 4,
      subdivision: 3,
    };

    this.click1 = new Audio(click);
    this.woodblock1 = new Audio(woodblock);
    this.drumstick1 = new Audio(drumstick);
  }

  handleBpmChange = (event, newValue) => {
    const bpm = newValue;

    if (this.state.isPlaying) {
      // Stop old timer and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(
        this.playClick,
        (60 / (bpm * this.state.subdivision)) * 1000
      );

      // Set the new bpm and reset the beat counter
      this.setState({
        count: 0,
        bpm,
      });
    } else {
      // Otherwise, just update the bpm
      this.setState({ bpm });
    }
  };

  handleBpmInputChange = (event) => {
    const bpm = parseInt(event.target.value);
    if (isNaN(bpm)) {
      return; // Ignore non-numeric input
    }
    this.handleBpmChange(null, bpm);
  };

  playClick = () => {
    const { count, beatsPerMeasure, subdivision } = this.state;

    // If we've just played the beat, play the drumstick sound
    if (count % subdivision === 0) {
      this.drumstick1.play();
    } else {
      // Otherwise, play the woodblock sound
      this.woodblock1.play();
    }

    // Keep track of which beat we're on
    this.setState((state) => ({
      count: (state.count + 1) % (state.beatsPerMeasure * subdivision),
    }));
  };

  startStop = () => {
    if (this.state.isPlaying) {
      // stop the timer
      clearInterval(this.timer);
      this.setState({
        isPlaying: false,
      });
    } else {
      // start a timer with current bpm and subdivision
      this.timer = setInterval(
        this.playClick,
        (60 / (this.state.bpm * this.state.subdivision)) * 1000
      );
      this.setState(
        {
          count: 0,
          isPlaying: true,
          // play a click immediately (after setState finishes)
        },
        this.playClick
      );
    }
  };

  render() {
    const { isPlaying, bpm, subdivision, beatsPerMeasure } = this.state;

    return (
      <Box sx={{ width: "80%" }} className="metronome">
        <Box className="bpm-slider">
          <Input
            type="number"
            min={10}
            max={300}
            value={bpm}
            sx={{
              width: "30%",
            }}
            onChange={this.handleBpmInputChange}
            endAdornment={<InputAdornment position="end">BPM</InputAdornment>}
          />
          <Typography>
            {subdivision === 1
              ? `${subdivision} subdivision per beat`
              : `${subdivision} subdivisions per beat`}
          </Typography>
          <Typography>
            {beatsPerMeasure === 1
              ? `${beatsPerMeasure} beats per bar`
              : `${beatsPerMeasure} beats per bar`}
          </Typography>
          <Slider
            type="range"
            min={10}
            max={300}
            value={bpm}
            onChange={this.handleBpmChange}
          />
        </Box>
        <Button
          sx={{
            backgroundColor: "blue",
            color: "white",
            boxShadow: "0px 0px 0px 2px rgba(0,0,0,0.5),",
            "&:hover": {
              backgroundColor: "orange",
            },
          }}
          onClick={this.startStop}
        >
          {isPlaying ? "Stop" : "Start"}
        </Button>
      </Box>
    );
  }
}

export default Metronome;
