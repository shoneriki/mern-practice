import mongoose from "mongoose";
import { ProgramsModel } from "./Programs.js";

const excerptSchema = new mongoose.Schema({
  text: { type: String },
  repetitions: { type: Number },
  targetTempo: { type: Number },
  endMetronomeGoal: { type: Number },
});

const movementSchema = new mongoose.Schema({
  movementNumber: Number,
  tempi: [
    {
      tempo: {
        type: Number,
        text: String,
      },
    },
  ],
  settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Settings",
  },
});

const practiceMovementSchema = new mongoose.Schema({
  movement: movementSchema,
  shouldPractice: {
    type: Boolean,
    default: false,
  },
  shouldSplitIntoExcerpts: {
    type: Boolean,
    default: false,
  },
  excerpts: [excerptSchema],
});

const practicePlanSchema = new mongoose.Schema(
  {
    composer: {
      type: String,
    },
    pieceTitle: {
      type: String,
    },
    pieceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Programs.pieces",
    },
    movements: [practiceMovementSchema],
    practiceStartDate: [{ type: Date }],
    daily: { type: Boolean, default: false },
    timesPerWeek: { type: Number, min: 1, max: 7 },
    untilDate: { type: Date },
    practiceLengthInMinutes: { type: Number, min: 1, max: 1440 },
    notes: { type: String },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Programs",
    },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const PracticePlansModel = mongoose.model(
  "PracticePlans",
  practicePlanSchema
);
