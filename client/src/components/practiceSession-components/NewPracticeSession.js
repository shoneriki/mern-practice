import React, {
  // useEffect
} from "react";
import {
  useForm,
  // useFieldArray,
  Controller,
  // useController,
} from "react-hook-form";
import {useNavigate} from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Box,
  Grid,
  InputLabel,
  Button,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  // DatePicker
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import {useDispatch} from 'react-redux';
import {removePiece} from "../../redux/piecesSlice";



export const NewPracticeSession = ({
  initialValues,
  formValues,
  validationSchema,
  id,
  practiceSession,
  cookies,
  // useNavigate,
  selectedPieces,
  selectedPiece,
  suggestions,
  handlePieceSearch,
  handlePieceSelection,
  onSubmit,
  handleAutocompleteChange,
  resetSelectedPiece,
  useLocation,
  setSelectedPieces
}) => {

  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    watch,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const values = watch();

  const navigate = useNavigate()

  return (
    <form
      id="practiceSession-form"
      name="practiceSession-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box
        id="inside-form-box"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          margin: "2rem 0",
        }}
      >
        <Typography variant={"h6"} sx={{ margin: "1rem 0" }}>
          Practice Session:
        </Typography>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name of session"
              sx={{ width: "100%" }}
            />
          )}
        />
        <Controller
          name="dateOfExecution"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Date and Time of Execution"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          )}
        />

        <Box sx={{ width: "60%", margin: "1rem auto" }}>
          <InputLabel sx={{ textAlign: "center" }}>
            Total Session Length:
          </InputLabel>
          <Grid
            container
            sx={{
              justifyContent: "center",
              margin: "auto 1rem",
              width: "20%",
            }}
          >
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Controller
                  name="totalSessionLength.hours"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="hr"
                      inputProps={{ min: 0, max: 10 }}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Controller
                  name="totalSessionLength.minutes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="min"
                      inputProps={{ min: 0, max: 59 }}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Controller
                  name="totalSessionLength.seconds"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="sec"
                      inputProps={{ min: 0, max: 59 }}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={4}>
          {selectedPieces &&
            selectedPieces.map((piece, pieceIndex) => (
              <Grid item xs={12} sm={6} md={4} key={pieceIndex}>
                <Box
                  sx={{
                    borderRadius: "1rem",
                    border: "1px solid black",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    padding: "1rem",
                  }}
                  name="piece-box"
                >
                  <Typography>
                    Piece {pieceIndex + 1}: {piece.name}
                  </Typography>
                  <Typography>Composer: {piece.composer}</Typography>
                  <Typography>excerpts: {piece.excerpts.length}</Typography>
                  <Button
                    color="warning"
                    variant="contained"
                    onClick={() => navigate(`/piece/edit/${piece._id}`)}
                    sx={{
                      marginBottomm: "1rem",
                    }}
                  >
                    Edit?
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => {
                      dispatch(removePiece(pieceIndex));
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Grid>
            ))}
        </Grid>
        <Button
          color="success"
          variant="contained"
          onClick={() =>
            navigate("/pieces", {
              state: {
                from: "practiceSession",
                selectedPieces: selectedPieces,
              },
            })
          }
        >
          Add Pieces to PracticeSession?
        </Button>

        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem 0",
          }}
        >
          <Button type="submit" variant="contained" color="success">
            {id ? `Save?` : `Submit`}
          </Button>
        </Grid>
      </Box>
    </form>
  );
};