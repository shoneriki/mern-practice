import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    minTime: {
      type: Number,
    },
    mediumTime: {
      type: Number,
    },
    longTime: {
      type: Number,
    },
    totalPracticeTime: {
      type: Number,
    },
    startingTempoPercentage: {
      type: Number
    }
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.model(
  "Settings",
  SettingsSchema
);
