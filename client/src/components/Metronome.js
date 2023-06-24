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
      bpm: 90,
      beatsPerMeasure: 1,
      subdivision: 3,
    };

    // Create an AudioContext
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.offlineAudioContext = new OfflineAudioContext(2, 44100 * 40, 44100);

    // Now load the sounds
    this.loadSound(click).then((buffer) => {
      this.clickBuffer = buffer;
    });

    this.loadSound(woodblock).then((buffer) => {
      this.woodblockBuffer = buffer;
    });

    this.loadSound(drumstick).then((buffer) => {
      this.drumstickBuffer = buffer;
    });
  }

  loadSound = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.offlineAudioContext.decodeAudioData(
      arrayBuffer
    );

    return audioBuffer;
  };

  playSound = (buffer) => {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(this.audioContext.currentTime);
  };

  scheduleNote = () => {
    const { count, subdivision } = this.state;

    if (count % subdivision === 0) {
      this.playSound(this.drumstickBuffer);
    } else {
      this.playSound(this.woodblockBuffer);
    }
  };

  scheduler = () => {
    while (this.nextNoteTime < this.audioContext.currentTime + 0.1) {
      this.scheduleNote();
      this.nextNote();
    }

    this.timer = window.setTimeout(this.scheduler, 25.0);
  };

  nextNote = () => {
    const secondsPerBeat = 60.0 / this.state.bpm;
    const secondsPerSubdivision = secondsPerBeat / this.state.subdivision;

    this.nextNoteTime += secondsPerSubdivision;

    this.setState((state) => ({
      count: (state.count + 1) % (state.beatsPerMeasure * state.subdivision),
    }));
  };

  startStop = () => {
    if (this.state.isPlaying) {
      window.clearTimeout(this.timer);
      this.setState({
        isPlaying: false,
      });
    } else {
      this.nextNoteTime = this.audioContext.currentTime + 0.05;
      this.scheduler();

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

  handleBpmChange = (event, newValue) => {
    const bpm = newValue;
    this.setState({ bpm });
  };

  handleBpmInputChange = (event) => {
    const bpm = parseInt(event.target.value);
    if (isNaN(bpm)) {
      return; // Ignore non-numeric input
    }
    this.handleBpmChange(null, bpm);
  };

  handleSubdivisionChange = (event) => {
    const subdivision = parseInt(event.target.value);
    if (!isNaN(subdivision)) {
      this.setState({ subdivision });
    }
  };

  handleBeatsPerMeasureChange = (event) => {
    const beatsPerMeasure = parseInt(event.target.value);
    if (!isNaN(beatsPerMeasure)) {
      this.setState({ beatsPerMeasure });
    }
  };

  render() {
    const { isPlaying, bpm, subdivision, beatsPerMeasure } = this.state;

    return (
      <Box sx={{ width: "80%", margin: "0 auto" }} className="metronome">
        <Box className="bpm-slider">
          <Input
            type="number"
            min={10}
            max={300}
            value={bpm}
            sx={{
              width: "100%",
            }}
            onChange={this.handleBpmInputChange}
            endAdornment={<InputAdornment position="end">BPM</InputAdornment>}
          />
          <Input
            type="number"
            min={1}
            max={10}
            value={subdivision}
            sx={{
              width: "100%",
            }}
            onChange={this.handleSubdivisionChange}
            endAdornment={
              <InputAdornment position="end">subdivision</InputAdornment>
            }
          />
          <Input
            type="number"
            min={1}
            max={10}
            value={beatsPerMeasure}
            sx={{
              width: "100%",
            }}
            onChange={this.handleBeatsPerMeasureChange}
            endAdornment={
              <InputAdornment position="end">Beats Per Bar</InputAdornment>
            }
          />
          <Slider
            type="range"
            min={10}
            max={300}
            value={bpm}
            onChange={this.handleBpmChange}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center"
          }}
        >

        <Button
          sx={{
            backgroundColor: "blue",
            color: "white",
            boxShadow: "0px 0px 0px 2px rgba(0,0,0,0.5),",
            margin: "1rem auto",
            width: "50%",
            "&:hover": {
              backgroundColor: "orange",
            },
          }}
          onClick={this.startStop}
        >
          {isPlaying ? "Stop" : "Start"}
        </Button>
        </Box>
      </Box>
    );
  }
}

export default Metronome;
