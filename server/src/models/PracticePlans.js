import mongoose from "mongoose";

const practicePlanSchema = new mongoose.Schema(
  {
    pieceName: {
      type: String,
    },
    composer: {
      type: String,
    },
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
