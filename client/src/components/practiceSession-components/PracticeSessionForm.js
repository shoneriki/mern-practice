import React, { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  useController,
} from "react-hook-form";
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

const TimeToSpendField = ({ control, excerptIndex, key, pieceIndex }) => {
  const {
    field: { ref: hoursRef, ...hoursInputProps },
    fieldState: { invalid: hoursInvalid, error: hoursError },
  } = useController({
    name: `pieces.${pieceIndex}.excerpts.${excerptIndex}.timeToSpend.hours`,
    control,
    rules: { required: "This is required" },
    defaultValue: "",
  });

  const {
    field: { ref: minutesRef, ...minutesInputProps },
    fieldState: { invalid: minutesInvalid, error: minutesError },
  } = useController({
    name: `pieces.${pieceIndex}.excerpts.${excerptIndex}.timeToSpend.minutes`,
    control,
    rules: { required: "This is required" },
    defaultValue: "",
  });

  const {
    field: { ref: secondsRef, ...secondsInputProps },
    fieldState: { invalid: secondsInvalid, error: secondsError },
  } = useController({
    name: `pieces.${pieceIndex}.excerpts.${excerptIndex}.timeToSpend.seconds`,
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

const ExcerptField = ({
  control,
  pieceIndex,
  excerptIndex,
  appendExcerpt,
  removeExcerpt,
  values,
  selectedPiece,
}) => {
  const {
    fields: tempoFields,
    append: appendTempo,
    remove: removeTempo,
  } = useFieldArray({
    control,
    name: `pieces.${pieceIndex}.excerpts.${excerptIndex}.tempi`,
  });

  if (selectedPiece) {
    console.log("selectedPiece: ", selectedPiece);
  } else {
    console.log("selectedPiece is undefined");
  }

  const excerptValues =
    Array.isArray(values.pieces) &&
    values.pieces[pieceIndex] &&
    values.pieces[pieceIndex].excerpts &&
    values.pieces[pieceIndex].excerpts[excerptIndex]
      ? values.pieces[pieceIndex].excerpts[excerptIndex]
      : {};

  return (
    <Grid item xs={12} md={4}>
      <Typography variant={"h6"} sx={{ textAlign: "center" }}>
        Excerpt {excerptIndex + 1}:
      </Typography>
      <Controller
        name={`pieces.${pieceIndex}.excerpts.${excerptIndex}.location`}
        control={control}
        defaultValue={excerptValues.location || ""}
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
        name={`pieces.${pieceIndex}.excerpts.${excerptIndex}.notes`}
        control={control}
        defaultValue={excerptValues.notes || ""}
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
        name={`pieces.${pieceIndex}.excerpts.${excerptIndex}.repetitions`}
        control={control}
        defaultValue={excerptValues.repetitions || 0}
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
          key={tempoField.id}
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
            pieceIndex={pieceIndex}
            tempoIndex={tempoIndex}
            removeTempo={removeTempo}
            selectedPiece={selectedPiece}
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
      <TimeToSpendField
        control={control}
        excerptIndex={excerptIndex}
        pieceIndex={pieceIndex}
        selectedPiece={selectedPiece}
      />
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

const TempoField = ({
  control,
  excerptIndex,
  pieceIndex,
  tempoIndex,
  removeTempo,
}) => {
  const {
    field: { ref: notesRef, ...notesInputProps },
    fieldState: { invalid: notesInvalid, error: notesError },
  } = useController({
    name: `pieces.${pieceIndex}.excerpts.${excerptIndex}.tempi.${tempoIndex}.notes`,
    control,
    rules: { required: "This is required" },
    defaultValue: "",
  });

  const {
    field: { ref: bpmRef, ...bpmInputProps },
    fieldState: { invalid: bpmInvalid, error: bpmError },
  } = useController({
    name: `pieces.${pieceIndex}.excerpts.${excerptIndex}.tempi.${tempoIndex}.bpm`,
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
            margin: "1rem auto",
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

const PieceForm = ({
  control,
  pieceIndex,
  selectedPiece,
  suggestions,
  handlePieceSearch,
  handleAutocompleteChange,
  setValue,
  composer,
  values,
  appendPiece,
  reset,
}) => {
  const pieceValues = values.pieces ? values.pieces[pieceIndex] : {};

  const handleSelectionChange = async (event, newValue) => {
    const pieceData = await handleAutocompleteChange(
      event,
      newValue,
      pieceIndex
    );
  };

  useEffect(() => {
    if (selectedPiece._id && pieceValues._id !== selectedPiece._id) {
      const updatedValues = {
        ...values,
        pieces: values.pieces.map((piece, index) => {
          if (index === pieceIndex) {
            return {
              ...piece,
              composer: selectedPiece.composer,
              _id: selectedPiece._id,
              excerpts: selectedPiece.excerpts.map((excerpt, excerptIndex) => ({
                ...excerpt,
                location: excerpt.location,
                notes: excerpt.notes,
                repetitions: excerpt.repetitions,
                timeToSpend: excerpt.timeToSpend,
                tempi: excerpt.tempi.map((tempo, tempoIndex) => ({
                  ...tempo,
                  notes: tempo.notes,
                  bpm: tempo.bpm,
                })),
              })),
            };
          }
          return piece;
        }),
      };

      reset(updatedValues);
    }
  }, [selectedPiece, reset, pieceIndex, pieceValues, values]);

  useEffect(() => {
    if (selectedPiece && selectedPiece.composer) {
      setValue(`values.pieces[${pieceIndex}].composer`, selectedPiece.composer);
    }
  }, [selectedPiece, setValue, pieceIndex]);

  const {
    fields: excerptFields,
    append: appendExcerpt,
    remove: removeExcerpt,
  } = useFieldArray({
    control,
    name: `pieces.${pieceIndex}.excerpts`,
  });

  return (
    <>
      <Autocomplete
        id="autocomplete"
        value={selectedPiece || {}}
        options={[...suggestions, { isNewPiece: true, name: "Add New Piece?" }]}
        sx={{
          width: "100%",
        }}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onInputChange={(event, value) => handlePieceSearch(value)}
        onChange={handleSelectionChange}
        renderInput={(params) => (
          <TextField {...params} label="Piece" variant="outlined" />
        )}
      />
      <Controller
        name={`values.pieces[${pieceIndex}].composer`}
        control={control}
        defaultValue={selectedPiece.composer || ""}
        render={({ field }) => (
          <TextField {...field} label="Composer" sx={{ width: "100%" }} />
        )}
      />

      {excerptFields.map((excerpt, excerptIndex) => (
        <ExcerptField
          key={excerpt.id}
          control={control}
          pieceIndex={pieceIndex}
          excerptIndex={excerptIndex}
          appendExcerpt={appendExcerpt}
          removeExcerpt={() => removeExcerpt(excerptIndex)}
          selectedPiece={selectedPiece}
          values={
            (selectedPiece && selectedPiece.excerpts
              ? selectedPiece.excerpts[excerptIndex]
              : {}) || {}
          }
        />
      ))}
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
      >
        Add Excerpt
      </Button>
    </>
  );
};

export const PracticeSessionForm = ({
  initialValues,
  formValues,
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
    reset,
    getValues,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const {
    fields: pieceFields,
    append: appendPiece,
    remove: removePiece,
  } = useFieldArray({
    control,
    name: "pieces",
  });

  const values = watch();

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
                    <TextField {...field} type="number" label="hr" />
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
                    <TextField {...field} type="number" label="min" />
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
                    <TextField {...field} type="number" label="sec" />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* piece form */}

        {Array.isArray(values.pieces) &&
          values.pieces.length > 0 &&
          values.pieces.map((piece, pieceIndex) => {
            return (
              <PieceForm
                key={pieceIndex}
                control={control}
                pieceIndex={pieceIndex}
                selectedPiece={selectedPiece}
                suggestions={suggestions}
                handlePieceSearch={handlePieceSearch}
                handleAutocompleteChange={handleAutocompleteChange}
                values={values}
                setValue={setValue}
                composer={values.composer}
                appendPiece={appendPiece}
                reset={reset}
              />
            );
          })}

        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            appendPiece({
              name: "",
              composer: "",
              excerpts: [
                {
                  location: "",
                  notes: "",
                  repetitions: 0,
                  timeToSpend: { hours: 0, minutes: 0, seconds: 0 },
                  tempi: [
                    {
                      notes: "",
                      bpm: 60,
                    },
                  ],
                },
              ],
            })
          }
        >
          Add Piece
        </Button>

        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        ></Grid>

        {/* end of the piece form...  */}

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
