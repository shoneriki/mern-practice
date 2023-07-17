import React from "react";
// import { Formik, Form, FastField, Field, FieldArray } from "formik";

// import { debounce } from "lodash";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Typography,
  Switch,
} from "@mui/material";

import axios from "axios";
import * as yup from 'yup';

/* react hook library form */

const ExcerptField = ({control, excerptIndex, removeExcerpt}) => {
  const {
    fields: tempoFields,
    append: appendTempo,
    remove: removeTempo,
  } = useFieldArray ({
    control,
    name: `excerpts.${excerptIndex}.tempi`
  })
  return (
    <Grid item xs={12} sm={4}>
      <Typography variant={"h6"}>Excerpt {excerptIndex + 1}</Typography>

      <Grid item xs={12}>
        <Controller
          name={`excerpts.${excerptIndex}.location`}
          control={control}
          defaultValue=""
          multiline
          render={({ field }) => (
            <TextField
              {...field}
              label="Location"
              placeholder="Location"
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name={`excerpts.${excerptIndex}.notes`}
          control={control}
          defaultValue=""
          multiline
          render={({ field }) => (
            <TextField {...field} label="Notes" placeholder="Notes" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name={`excerpts.${excerptIndex}.repetitions`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} type="number" label="Repetitions" fullWidth />
          )}
        />
      </Grid>

      <Box>
        <Typography sx={{ textAlign: "center" }}>Time To Spend:</Typography>
      </Box>
      <Grid container name="timeToSpend-grid-container">
        <Grid item xs={12} sm={4}>
          <Controller
            name={`excerpts.${excerptIndex}.timeToSpend.hours`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} type="number" label="hours" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name={`excerpts.${excerptIndex}.timeToSpend.minutes`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} type="number" label="minutes" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name={`excerpts.${excerptIndex}.timeToSpend.seconds`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} type="number" label="seconds" fullWidth />
            )}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Controller
          name={`excerpts.${excerptIndex}.mastered`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} {...field} />}
              label="Excerpt Mastered?"
            />
          )}
        />
      </Grid>

      <Button
        type="button"
        variant="contained"
        color="error"
        onClick={() => removeExcerpt(excerptIndex)}
      >
        Remove Excerpt
      </Button>
    </Grid>
  );
}

export const PieceForm = ({
  key,
  piece,
  initialValues,
  validationSchema,
  id,
  cookies,
  navigate,
  onSubmit,
}) => {
  const {register, handleSubmit, control, formState: {errors}} = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  })

  const {fields: excerptFields, append: appendExcerpt, remove: removeExcerpt} = useFieldArray({
    control,
    name: "excerpts",
  })
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant={"h6"} sx={{ textAlign: "center" }}>
          Add a piece
        </Typography>
        <Grid
          name="name-composer-length-container"
          container
          spacing={4}
          sx={{
            width: "100%",
          }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("name")}
              label="Name"
              placeholder="Piece Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("composer")}
              label="Composer"
              placeholder="Composer"
              fullWidth
              error={!!errors.composer}
              helperText={errors.composer?.message}
            />
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Grid item name="length-container" xs={12} sm={4}>
              <InputLabel sx={{ textAlign: "center" }}>Length:</InputLabel>
              <Grid container name="time-container" sx={{ width: "100%" }}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="length.hours"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Hr"
                        placeholder="Hr"
                        error={!!errors.length?.hours}
                        helperText={errors.length?.hours?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="length.minutes"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Min"
                        placeholder="Min"
                        error={!!errors.length?.minutes}
                        helperText={errors.length?.minutes?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="length.seconds"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Sec"
                        placeholder="Sec"
                        error={!!errors.length?.seconds}
                        helperText={errors.length?.seconds?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {excerptFields.map((excerptField, excerptIndex) => (
            <ExcerptField
              key={excerptField.id}
              control={control}
              excerptIndex={excerptIndex}
              removeExcerpt={removeExcerpt}
            />
          ))}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              margin: "1rem auto",
            }}
          >
            <Box>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() =>
                  appendExcerpt({
                    location: "",
                    notes: "",
                    repetitions: 0,
                    timeToSpend: {
                      hours: 0,
                      minutes: 0,
                      seconds: 0,
                    },
                    tempi: [
                      {
                        notes: "",
                        bpm: 60,
                      },
                    ],
                  })
                }
              >
                Add an Excerpt
              </Button>
            </Box>
          </Box>

          <Box
            name="submit-btn-mastered-container"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "2rem auto",
            }}
          >
            <Controller
              name="mastered"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} {...field} />}
                  label="Piece Mastered?"
                />
              )}
            />
            {id ? (
              <Button
                type="submit"
                variant="contained"
                color="warning"
                sx={{ width: "50%" }}
              >
                Edit Piece?
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: "60%" }}
              >
                Add Piece?
              </Button>
            )}
          </Box>
        </Grid>
      </form>
    </Box>
  );
};
