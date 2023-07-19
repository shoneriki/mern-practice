import React, {useState, useEffect} from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  Grid,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios"
import dayjs from "dayjs";

export const ProgramFormRHL = ({ onSubmit, userID, id, program, setProgram }) => {


  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: program
  })

  useEffect(() => {
    if (
      program &&
      program.pieces &&
      program.pieces.length > 0 &&
      !program.pieces[0]._id
    ) {
      // Fetch each piece and set its data
      const fetchPieces = async () => {
        const piecePromises = program.pieces.map((pieceId) =>
          axios.get(`http://localhost:3001/pieces/${pieceId}`)
        );
        const pieceResponses = await Promise.all(piecePromises);
        const pieces = pieceResponses.map((response) => response.data);

        // Set the program data with the pieces data
        setProgram({ ...program, pieces });
      };
      fetchPieces();
    }
  }, [program]);




  const { fields, append, remove } = useFieldArray({
    control,
    name: "pieces",
  });

  const pieces = watch("pieces");

  const handleDateTimeChange = (datetime) => {
    setValue("date", datetime);
  };

  useEffect(() => {
    setValue("numOfPieces", pieces.length);
  }, [pieces, setValue]);

  return (
    <Box sx={{ "& > *": { mt: 2, mb: 2 } }}>
      <Typography sx={{ textAlign: "center" }} variant={"h6"}>
        Program
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <TextField
                {...register("name")}
                type="text"
                id="name"
                name="name"
                label="Title:"
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date and Time"
                  name="date"
                  value={dayjs()}
                  onChange={handleDateTimeChange}
                  renderInput={(props) => <TextField {...props} fullWidth />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          {fields.map((item, index) => (
            <Grid
              sx={{ textAlign: "center" }}
              container
              spacing={1}
              key={item.id}
            >
              <Grid item xs={12} sm={12}>
                <Typography variant={"h6"}>Piece #{index + 1}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    {...register(`pieces.${index}.name`)}
                    id={`piece-${index}-name`}
                    label="Piece Name"
                    name={`pieces.${index}.name`}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    {...register(`pieces.${index}.composer`)}
                    id={`piece-${index}-composer`}
                    label="Composer"
                    name={`pieces.${index}.composer`}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor={`piece-${index}-lengthInSeconds`}>
                  Length:
                </InputLabel>
                <Grid container spacing={1}>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      {...register(`pieces.${index}.length.hours`)}
                      type="number"
                      id={`piece-${index}-hours`}
                      label="Hours"
                      name={`pieces.${index}.length.hours`}
                      min="0"
                      max="10"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      {...register(`pieces.${index}.length.minutes`)}
                      type="number"
                      id={`piece-${index}-minutes`}
                      name={`pieces.${index}.length.minutes`}
                      label="Minutes"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <TextField
                      {...register(`pieces.${index}.length.seconds`)}
                      type="number"
                      id={`piece-${index}-seconds`}
                      name={`pieces.${index}.length.seconds`}
                      label="Seconds"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Button
                sx={{
                  backgroundColor: "#E53935",
                  color: "white",
                  margin: "1rem 0",
                  "&:hover": {
                    backgroundColor: "#C62828 ",
                  },
                }}
                onClick={() => remove(index)}
                fullWidth
              >
                Remove this piece
              </Button>
            </Grid>
          ))}
          <Button
            sx={{
              color: "white",
              backgroundColor: "#34B96F",
              margin: "1rem auto",
              "&:hover": {
                backgroundColor: "#2D944F",
              },
            }}
            onClick={() =>
              append({
                name: "",
                composer: "",
                length: { hours: 0, minutes: 0, seconds: 0 },
              })
            }
          >
            Add Another Piece?
          </Button>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <TextField
                {...register("numOfPieces")}
                type="number"
                id="numOfPieces"
                label="Number of Pieces"
                name="numOfPieces"
                disabled
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <TextField
                {...register("intermission")}
                type="number"
                id="intermission"
                label="intermission?"
                name="intermission"
              />
            </FormControl>
          </Grid>
          <Button
            sx={{
              backgroundColor: "#0074D9",
              color: "white",
              margin: "1rem auto",
              "&:hover": {
                backgroundColor: "#005CBF",
              },
            }}
            type="submit"
          >
            Create Program
          </Button>
        </Grid>
      </form>
    </Box>
  );
};
