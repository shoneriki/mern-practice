import React, {useState} from "react"
import {Box, Button, TextField, Grid} from "@mui/material"

export const Counter = ({rep}) => {
  const [count, setCount] = useState(0)



  const reset = () => {
    setCount(0)
  }

  const increment = () => {
    setCount(count => count + 1)
  }

  const decrement = () => {
    setCount((count) => (count > 0 ? count - 1 : 0));
  }

  return (
    <Box
      sx={{
        width: "80%",
        margin: "1rem auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <TextField
        type="number"
        value={count}
        inputProps={{
          style: { textAlign: "center", fontSize: "2rem" },
          min: 0,
        }}
        sx={{
          margin: "1rem auto",
          width: "40%",
        }}
      />
      <TextField
        type="text"
        value={`/ ${rep}`}

      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} fullWidth>
          <Button
            sx={{ backgroundColor: "red" }}
            onClick={reset}
            variant="contained"
            fullWidth
          >
            Reset?
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} fullWidth>
          <Button
            sx={{ backgroundColor: "blue" }}
            value="+"
            onClick={increment}
            variant="contained"
            fullWidth
          >
            +
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} fullWidth>
          <Button
            sx={{ backgroundColor: "#bada55" }}
            value="-"
            onClick={decrement}
            variant="contained"
            fullWidth
          >
            -
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
