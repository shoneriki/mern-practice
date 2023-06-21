import React, { Component } from "react";
import click from "../assets/sounds/click.mp3"
import woodblock from "../assets/sounds/woodblock.mp3"

import { Button, Slider, Box, Typography, Input } from "@mui/material";


export class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      count: 0,
      bpm: 60,
      beatsPerMeasure: 4,
      subdivision: 1,
    };

    this.click1 = new Audio(click);
    this.click2 = new Audio(woodblock);
  }

  handleInputChange = (event, newValue) => {
    const bpm = newValue;

    if (this.state.isPlaying) {
      // stop old timer and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

      // set the new bpm
      // and reset the beat counter
      this.setState({
        count: 0,
        bpm,
      });
    } else {
      // otherwise, just update the bpm
      this.setState({ bpm });
    }
  };

  playClick = () => {
    const { count, beatsPerMeasure } = this.state;

    // alternate click sounds
    if (count % beatsPerMeasure === 0) {
      this.click2.play();
    } else {
      this.click1.play();
    }

    // keep track of which beat we're on
    this.setState((state) => ({
      count: (state.count + 1) % state.beatsPerMeasure,
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
      // start a timer with current bpm
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
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
    const { isPlaying, bpm, subdivision } = this.state;

    return (
      <Box sx={{ width: "80%" }} className="metronome">
        <Box className="bpm-slider">
          <p>{bpm} BPM</p>
          <p>{subdivision} subdivision</p>
          <Slider
            type="range"
            min={10}
            max={300}
            value={bpm}
            onChange={this.handleInputChange}
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
