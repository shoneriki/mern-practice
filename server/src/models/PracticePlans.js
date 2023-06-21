import mongoose from "mongoose";
import { ProgramsModel } from "./Programs.js";


const practicePlanSchema = new mongoose.Schema(
  {
    composer: {
      type: String,
    },
    pieceName: {
      type: String,
    },
    pieceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Programs.pieces",
    },
    movementNumber: {
      type: Number,
    },
    tempi: [
      {
        tempo: {
          type: Number,
        }
      }
    ],
    excerpts: [
      {
        type: String,
      },
    ],
    movements: {
      type: String,
    },
    endMetronomeGoal: {
      type: Number,
    },
    practiceStartDate: [{ type: Date }],
    daily: { type: Boolean, default: false },
    timesPerWeek: { type: Number, min: 1, max: 7 },
    untilDate: { type: Date },
    practiceLengthInMinutes: { type: Number, min: 1, max: 1440 },
    notes: { type: String },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Programs"
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
