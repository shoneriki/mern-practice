import React from "react";
import { useForm, useFieldArray, Controller, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  TextField,
  Box,
  Grid,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";

const TimeToSpendField = ({ control, excerptIndex, key }) => {
  const {
    field: { ref: hoursRef, ...hoursInputProps },
    fieldState: { invalid: hoursInvalid, error: hoursError },
  } = useController({
    name: `piece.excerpts.${excerptIndex}.timeToSpend.hours`,
    control,
    rules: { required: "This is required" },
    defaultValue: "",
  });

  const {
    field: { ref: minutesRef, ...minutesInputProps },
    fieldState: { invalid: minutesInvalid, error: minutesError },
  } = useController({
    name: `piece.excerpts.${excerptIndex}.timeToSpend.minutes`,
    control,
    rules: { required: "This is required" },
    defaultValue: "",
  });

  const {
    field: { ref: secondsRef, ...secondsInputProps },
    fieldState: { invalid: secondsInvalid, error: secondsError },
  } = useController({
    name: `piece.excerpts.${excerptIndex}.timeToSpend.seconds`,
    control,
    rules: { required: "This is required" },
    defaultValue: "",
  });

  return (
    <Box
      name="timeToSpend-box"
      sx={{
        width: "100%",
        margin: "1rem auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <InputLabel>Time to Spend:</InputLabel>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <TextField
            {...hoursInputProps}
            inputRef={hoursRef}
            type="number"
            label="hr"
            fullWidth
            error={hoursInvalid}
            helperText={hoursError?.message}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            {...minutesInputProps}
            inputRef={minutesRef}
            type="number"
            label="min"
            fullWidth
            error={minutesInvalid}
            helperText={minutesError?.message}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            {...secondsInputProps}
            inputRef={secondsRef}
            type="number"
            label="sec"
            fullWidth
            error={secondsInvalid}
            helperText={secondsError?.message}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const TempoField = ({ control, excerptIndex, tempoIndex, removeTempo }) => {
  const {
    field: { ref: notesRef, ...notesInputProps },
    fieldState: { invalid: notesInvalid, error: notesError },
  } = useController({
    name: `piece.excerpts.${excerptIndex}.tempi.${tempoIndex}.notes`,
    control,
    rules: { required: "This is required" },
    defaultValue: "",
  });

  const {
    field: { ref: bpmRef, ...bpmInputProps },
    fieldState: { invalid: bpmInvalid, error: bpmError },
  } = useController({
    name: `piece.excerpts.${excerptIndex}.tempi.${tempoIndex}.bpm`,
    control,
    rules: { required: "This is required" },
    defaultValue: "",
  });

  return (
    <>
      <Typography variant={"h6"}>Tempo {tempoIndex + 1}</Typography>
      <Grid item xs={12}>
        <TextField
          {...notesInputProps}
          inputRef={notesRef}
          label="Notes"
          fullWidth
          error={notesInvalid}
          helperText={notesError?.message}
        />
        <TextField
          {...bpmInputProps}
          inputRef={bpmRef}
          type="number"
          label="BPM"
          fullWidth
          error={bpmInvalid}
          helperText={bpmError?.message}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            margin: "1rem auto"
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => removeTempo(tempoIndex)}
          >
            Remove Tempo
          </Button>
        </Box>
      </Grid>
    </>
  );
};

const ExcerptField = ({
  control,
  excerptIndex,
  appendExcerpt,
  removeExcerpt,
}) => {
  const {
    fields: tempoFields,
    append: appendTempo,
    remove: removeTempo,
  } = useFieldArray({
    control,
    name: `piece.excerpts.${excerptIndex}.tempi`,
  });

  return (
    <Grid item xs={12} md={4} centered>
        <Typography variant={"h6"} sx={{ textAlign: "center" }}>
          Excerpt {excerptIndex + 1}:
        </Typography>
        <Controller
          name={`piece.excerpts.${excerptIndex}.location`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              label="location"
              sx={{ width: "100%" }}
            />
          )}
        />
        <Controller
          name={`piece.excerpts.${excerptIndex}.notes`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              label="notes"
              sx={{ width: "100%" }}
            />
          )}
        />
        <Controller
          name={`piece.excerpts.${excerptIndex}.repetitions`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Repetitions"
              sx={{ width: "100%" }}
            />
          )}
        />
        {tempoFields.map((tempoField, tempoIndex) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TempoField
              key={tempoField.id}
              control={control}
              excerptIndex={excerptIndex}
              tempoIndex={tempoIndex}
              removeTempo={removeTempo}
            />
          </Box>
        ))}
        <Box
          sx={{
            width: "100%",
            margin: "1rem auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() =>
              appendTempo({
                notes: "",
                bpm: 60,
              })
            }
          >
            Add a Tempo
          </Button>
        </Box>
        <TimeToSpendField control={control} excerptIndex={excerptIndex} />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => removeExcerpt(excerptIndex)}
            sx={{ margin: "1rem 0" }}
          >
            Remove excerpt
          </Button>
        </Box>
      </Grid>
  );
};

export const PracticeSessionForm = ({
  initialValues,
  validationSchema,
  id,
  practiceSession,
  cookies,
  navigate,
  selectedPiece,
  suggestions,
  handlePieceSearch,
  handlePieceSelection,
  onSubmit,
  handleAutocompleteChange,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const values = watch();

  const {
    fields: excerptFields,
    append: appendExcerpt,
    remove: removeExcerpt,
  } = useFieldArray({
    control,
    name: "piece.excerpts",
  });

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
          Practice Session Form:
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

        <Autocomplete
          id="autocomplete"
          value={selectedPiece || {}}
          options={suggestions}
          sx={{
            width: "100%",
          }}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          onInputChange={(event, value) => handlePieceSearch(value)}
          onChange={handleAutocompleteChange(setValue)}
          renderInput={(params) => (
            <TextField {...params} label="Piece" variant="outlined" />
          )}
        />

        <Controller
          name="composer"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Composer" sx={{ width: "100%" }} />
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
            sx={{ justifyContent: "center", margin: "auto 1rem" }}
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
                      inputProps={{ min: 0, max: 10}}
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
                      inputProps={{ min: 0, max: 59}}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          name="box-outside-grid-for-margin"
          sx={{
            margin: "2rem auto",
          }}
        >
          <Grid
            container
            spacing={4}
            name="grid-outside-excerpts"
            sx={{
              border: "1px solid black",
              borderRadius: "1rem",
            }}
          >
            {values.piece &&
              values.piece.excerpts &&
              values.piece.excerpts.map((excerpt, excerptIndex) => (
                <ExcerptField
                  key={excerptIndex}
                  excerptIndex={excerptIndex}
                  control={control}
                  appendExcerpt={appendExcerpt}
                  removeExcerpt={removeExcerpt}
                />
              ))}
          </Grid>
        </Box>

        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={() =>
              appendExcerpt({
                location: "",
                notes: "",
                repetitions: 0,
                timeToSpend: { hours: 0, minutes: 0, seconds: 0 },
              })
            }
            sx={{ margin: "1rem 0" }}
          >
            Add excerpt
          </Button>
        </Grid>

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
