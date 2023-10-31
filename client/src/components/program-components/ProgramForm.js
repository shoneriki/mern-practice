import React, { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import dayjs from "dayjs";

export const ProgramForm = ({ onSubmit, userID, id, program, setProgram }) => {
  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: program,
  });

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
          axios.get(`${process.env.REACT_APP_API_URL}/pieces/piece/${pieceId}`)
        );
        const pieceResponses = await Promise.all(piecePromises);
        const pieces = pieceResponses.map((response) => response.data);

        // Set the program data with the pieces data
        setProgram({ ...program, pieces });
      };
      fetchPieces();
    }
  }, [program]);

  const [allPieces, setAllPieces] = useState([]);

  useEffect(() => {
    const fetchAllPieces = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/pieces/user/${userID}`
      ); // Assuming this endpoint fetches all pieces
      setAllPieces(response.data);
    };
    fetchAllPieces();
  }, []);

  const [inputModes, setInputModes] = useState([]);

  // const [inputModes, setInputModes] = useState(
  //   program.pieces.map((piece) => (piece._id ? "dropdown" : "text"))
  // );

  useEffect(() => {
    setInputModes(
      program.pieces.map((piece) => (piece._id ? "dropdown" : "text"))
    );
  }, [program.pieces]);

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

  useEffect(() => {
    console.log("inside useEffect for inputModes");
    console.log("Input Modes:", inputModes);
  }, [inputModes]);

  const formRef = useRef(null);

  useEffect(() => {
    const formEl = document.getElementById("program-form");

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT") {
        e.preventDefault();
      }
    };

    formEl.addEventListener("keydown", handleKeyDown);

    return () => {
      formEl.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box sx={{ "& > *": { mt: 2, mb: 2 } }}>
      <Typography sx={{ textAlign: "center" }} variant={"h6"}>
        Program
      </Typography>
      <form ref={formRef} id="program-form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                {...register("name")}
                type="text"
                id="name"
                name="name"
                label="Title:"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date and Time"
                  name="date"
                  value={dayjs(program.date || new Date())}
                  onChange={handleDateTimeChange}
                  renderInput={(props) => <TextField {...props} />}
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
                <FormControl>
                  <InputLabel htmlFor={`piece-${index}-existing`}></InputLabel>
                  {inputModes[index] === "text" ||
                  inputModes[index] === undefined ? (
                    <>
                      <TextField
                        {...register(`pieces.${index}.name`)}
                        id={`piece-${index}-name`}
                        // label="Piece Name"
                        name={`pieces.${index}.name`}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          const updatedModes = [...inputModes];
                          updatedModes[index] = "dropdown";
                          setInputModes(updatedModes);
                          setValue(`pieces.${index}._id`, "");
                        }}
                      >
                        Select from list
                      </Button>
                    </>
                  ) : (
                    <>
                      <Select
                        value={pieces[index]._id || ""}
                        onChange={(e) => {
                          const updatedModes = [...inputModes];
                          updatedModes[index] =
                            e.target.value === "new" ? "text" : "dropdown";
                          console.log(
                            "Select onChange triggered",
                            e.target.value
                          );
                          setInputModes(updatedModes);
                          if (e.target.value === "new") {
                            console.log("new?", e.target.value);
                            setValue(`pieces.${index}.name`, "");
                            setValue(`pieces.${index}.composer`, "");
                            setValue(`pieces.${index}.length`, {
                              hours: 0,
                              minutes: 0,
                              seconds: 0,
                            });
                          } else if (e.target.value === "") {
                            setValue(`pieces.${index}._id`, "");
                            setValue(`pieces.${index}.name`, "");
                            setValue(`pieces.${index}.composer`, "");
                            setValue(`pieces.${index}.length`, {
                              hours: 0,
                              minutes: 0,
                              seconds: 0,
                            });
                          } else {
                            const selectedPiece = allPieces.find(
                              (p) => p._id === e.target.value
                            );
                            console.log("selectedPiece", selectedPiece);
                            // Update the piece data in the form
                            setValue(`pieces.${index}._id`, selectedPiece._id);
                            setValue(
                              `pieces.${index}.name`,
                              selectedPiece.name
                            );
                            setValue(
                              `pieces.${index}.composer`,
                              selectedPiece.composer || ""
                            );
                            setValue(
                              `pieces.${index}.length`,
                              selectedPiece.length || {
                                hours: 0,
                                minutes: 0,
                                seconds: 0,
                              }
                            );
                          }
                        }}
                        inputProps={{
                          name: `pieces.${index}.existing`,
                          id: `piece-${index}-existing`,
                        }}
                      >
                        <MenuItem value=""></MenuItem>
                        {allPieces.map((piece) => (
                          <MenuItem key={piece._id} value={piece._id}>
                            {piece.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          const updatedModes = [...inputModes];
                          updatedModes[index] = "text";
                          setInputModes(updatedModes);

                          // Reset the values for this piece
                          setValue(`pieces.${index}.name`, "");
                          setValue(`pieces.${index}.composer`, "");
                          setValue(`pieces.${index}.length`, {
                            hours: 0,
                            minutes: 0,
                            seconds: 0,
                          });
                        }}
                      >
                        Create a New Piece?
                      </Button>
                    </>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
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
                <Grid container spacing={1} sx={{width: "40%"}}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register(`pieces.${index}.length.hours`)}
                      type="number"
                      id={`piece-${index}-hours`}
                      label="Hours"
                      name={`pieces.${index}.length.hours`}
                      min="0"
                      max="10"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register(`pieces.${index}.length.minutes`)}
                      type="number"
                      id={`piece-${index}-minutes`}
                      name={`pieces.${index}.length.minutes`}
                      label="Minutes"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register(`pieces.${index}.length.seconds`)}
                      type="number"
                      id={`piece-${index}-seconds`}
                      name={`pieces.${index}.length.seconds`}
                      label="Seconds"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
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
                >
                  Remove this piece
                </Button>
              </Box>
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
            onClick={() => {
              append({
                name: "",
                composer: "",
                length: { hours: 0, minutes: 0, seconds: 0 },
              });
              setInputModes((prevModes) => [...prevModes, "text"]);
            }}
          >
            Add A Piece?
          </Button>
          <Grid item xs={12} md={12}>
            <FormControl>
              <TextField
                {...register("numOfPieces")}
                type="number"
                id="numOfPieces"
                label="Number of Pieces"
                name="numOfPieces"
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl>
              <TextField
                {...register("intermission")}
                type="number"
                id="intermission"
                label="intermission?"
                name="intermission"
              />
            </FormControl>
          </Grid>
          {id ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                margin: "1rem auto",
              }}
            >
              <Button variant="contained" color="warning" type="submit">
                Save?
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                margin: "1rem auto",
              }}
            >
              <Button variant="contained" color="success" type="submit">
                Create Program
              </Button>
            </Box>
          )}
        </Grid>
      </form>
    </Box>
  );
};
