import React, { Component } from "react";
import click from "../assets/sounds/click.mp3"
import woodblock from "../assets/sounds/woodblock.mp3"
import drumstick from "../assets/sounds/drumstick.mp3"

import { Button, Slider, Box, TextField, Grid, InputAdornment, Typography} from "@mui/material";


export class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      count: 0,
      bpm: 60,
      beatsPerMeasure: 1,
      subdivision: 1,
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
    let bpm = parseInt(event.target.value);
    if (isNaN(bpm)) {
      return; // Ignore non-numeric input
    }

    if (bpm < 10) {
      bpm = 10;
    } else if (bpm > 300) {
      bpm = 300;
    }

    this.handleBpmChange(null, bpm);
  };
  handleSubdivisionChange = (event) => {
    let subdivision = parseInt(event.target.value);
    if (isNaN(subdivision)) {
      return;
    }

    if (subdivision < 1) {
      subdivision = 1;
    } else if (subdivision > 10) {
      subdivision = 10;
    }

    this.setState({ subdivision });
  };

  handleBeatsPerMeasureChange = (event) => {
    let beatsPerMeasure = parseInt(event.target.value);
    if (isNaN(beatsPerMeasure)) {
      return;
    }

    if (beatsPerMeasure < 1) {
      beatsPerMeasure = 1;
    } else if (beatsPerMeasure > 10) {
      beatsPerMeasure = 10;
    }

    this.setState({ beatsPerMeasure });
  };

  render() {
    const { isPlaying, bpm, subdivision, beatsPerMeasure } = this.state;

    function IncrementInput(props) {
      const { value, onIncrement, onDecrement, min, max, ...otherProps } =
        props;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField value={value} {...otherProps} />
          <Box sx={{ margin: "auto 1rem" }}>
            <Button
              sx={{ backgroundColor: "green", color: "white" }}
              onClick={onIncrement}
              disabled={value >= max}
            >
              +
            </Button>
            <Button
              sx={{ backgroundColor: "orange", color: "white" }}
              onClick={onDecrement}
              disabled={value <= min}
            >
              -
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ width: "80%", margin: "0 auto" }} className="metronome">
        <Typography
          variant={"h4"}
          align={"center"}
          sx={{
            margin: "1rem",
          }}
        >
          Metronome
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <IncrementInput
              label="BPM"
              type="number"
              value={bpm}
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "2rem",
                },
              }}
              sx={{
                width: "100%",
                textAlign: "center",
              }}
              min={10}
              max={300}
              onChange={this.handleBpmInputChange}
              onIncrement={() => this.handleBpmChange(null, bpm + 1)}
              onDecrement={() => this.handleBpmChange(null, bpm - 1)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <IncrementInput
              label="sub"
              type="number"
              min={1}
              max={10}
              value={subdivision}
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "2rem",
                },
                min: 1,
                max: 10,
              }}
              sx={{
                width: "100%",
              }}
              onChange={this.handleSubdivisionChange}
              onIncrement={() =>
                this.handleSubdivisionChange({
                  target: { value: subdivision + 1 },
                })
              }
              onDecrement={() =>
                this.handleSubdivisionChange({
                  target: { value: subdivision - 1 },
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <IncrementInput
              label="per bar"
              type="number"
              value={beatsPerMeasure}
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "2rem",
                },
                min: 1,
                max: 10,
              }}
              sx={{
                width: "100%",
              }}
              onChange={this.handleBeatsPerMeasureChange}
              onIncrement={() =>
                this.handleBeatsPerMeasureChange({
                  target: { value: beatsPerMeasure + 1 },
                })
              }
              onDecrement={() =>
                this.handleBeatsPerMeasureChange({
                  target: { value: beatsPerMeasure - 1 },
                })
              }
            />
          </Grid>
          <Slider
            type="range"
            min={10}
            max={300}
            value={bpm}
            onChange={this.handleBpmChange}
          />
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
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
