import mongoose from "mongoose";

const practiceSessionSchema = new mongoose.Schema(
  {
    dateOfExecution: { type: Date },
    name: {
      type: String,
    },
    totalSessionLength: {
      hours: { type: Number, min: 0, max: 24 },
      minutes: { type: Number, min: 0, max: 59 },
      seconds: { type: Number, min: 0, max: 59 },
    },
    pieces: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pieces",
    }],
    performanceDate: { type: Date },
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
