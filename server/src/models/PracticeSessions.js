import mongoose from "mongoose";

const practiceSessionSchema = new mongoose.Schema(
  {
    piece: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pieces",
      required: true,
    },
    totalPlanLength: {
      hours: { type: Number, min: 0, max: 24 },
      minutes: { type: Number, min: 0, max: 59 },
      seconds: { type: Number, min: 0, max: 59 },
    },
    excerpts: [
      {
        excerpt: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pieces.excerpts",
        },
        location: { type: String },
        notes: { type: String },
        repetitions: { type: Number },
        timeToSpend: {
          hours: { type: Number, min: 0, max: 10 },
          minutes: { type: Number, min: 0, max: 59 },
          seconds: { type: Number, min: 0, max: 59 },
        },
        tempi: [
          {
            notes: { type: String },
            bpm: { type: Number, min: 10, max: 300 },
          },
        ],
      },
    ],
    runThrough: { type: Boolean, default: false },
    runThroughLength: {
      hours: { type: Number, min: 0, max: 10 },
      minutes: { type: Number, min: 0, max: 59 },
      seconds: { type: Number, min: 0, max: 59 },
    },
    practiceStartDate: { type: Date },
    untilDate: { type: Date },
    notes: { type: String },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const PracticeSessionsModel = mongoose.model(
  "PracticeSessions",
  practiceSessionSchema
);
