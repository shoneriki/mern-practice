import React, {useState} from "react"
import {Box, Button, TextField, Grid, Typography} from "@mui/material"

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
      <Typography
        variant="h5"
        sx={{
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        Counter
      </Typography>
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
      >
        {`${count}/${rep}`}
      </TextField>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Button
            sx={{ backgroundColor: "red", width: "100%" }}
            onClick={reset}
            variant="contained"
          >
            Reset?
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            sx={{ backgroundColor: "blue", width: "100%" }}
            value="+"
            onClick={increment}
            variant="contained"
          >
            +
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            sx={{ backgroundColor: "#bada55", width: "100%" }}
            value="-"
            onClick={decrement}
            variant="contained"
          >
            -
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
