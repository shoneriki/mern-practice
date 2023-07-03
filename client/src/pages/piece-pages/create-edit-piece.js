import { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

function AddPieceForm() {
  const [piece, setPiece] = useState({
    name: "",
    composer: "",
    length: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    movements: [
      {
        number: 0,
        name: "",
        movementNumber: 0,
        tempi: [
          {
            tempo: 0,
            text: "",
          },
        ],
        settings: "",
        shouldPractice: false,
        shouldSplitIntoExcerpts: false,
        excerpts: [
          {
            text: "",
            repetitions: 0,
            targetTempo: 0,
            endMetronomeGoal: 0,
          },
        ],
      },
    ],
  });

  const handleChange = (event) => {
    setPiece({ ...piece, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(piece);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant={"h6"}>Add a piece</Typography>
      <TextField label="Name" name="name" onChange={handleChange} fullWidth />
      <TextField
        label="Composer"
        name="composer"
        onChange={handleChange}
        fullWidth
      />
      <TextField
        type="number"
        label="Hours"
        name="hours"
        onChange={handleChange}
        fullWidth
      />
      <TextField
        type="number"
        label="Minutes"
        name="minutes"
        onChange={handleChange}
        fullWidth
      />
      <TextField
        type="number"
        label="Seconds"
        name="seconds"
        onChange={handleChange}
        fullWidth
      />
      <h3>Movement</h3>
      <TextField
        type="number"
        label="Number"
        name="number"
        onChange={handleChange}
        fullWidth
      />
      <TextField label="Name" name="name" onChange={handleChange} fullWidth />

      <h3>Tempi</h3>
      <TextField
        type="number"
        label="Tempo"
        name="tempo"
        onChange={handleChange}
        fullWidth
      />
      <TextField label="Text" name="text" onChange={handleChange} fullWidth />
      <FormControlLabel
        control={
          <Checkbox
            name="shouldPractice"
            color="primary"
            onChange={(e) =>
              setPiece({ ...piece, shouldPractice: e.target.checked })
            }
          />
        }
        label="Should Practice"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="shouldSplitIntoExcerpts"
            color="primary"
            onChange={(e) =>
              setPiece({ ...piece, shouldSplitIntoExcerpts: e.target.checked })
            }
          />
        }
        label="Should Split Into Excerpts"
      />
      <h3>Excerpt</h3>
      <TextField label="Text" name="text" onChange={handleChange} fullWidth />
      <TextField
        type="number"
        label="Repetitions"
        name="repetitions"
        onChange={handleChange}
        fullWidth
      />
      <TextField
        type="number"
        label="Target Tempo"
        name="targetTempo"
        onChange={handleChange}
        fullWidth
      />
      <TextField
        type="number"
        label="End Metronome Goal"
        name="endMetronomeGoal"
        onChange={handleChange}
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}

export default AddPieceForm;
