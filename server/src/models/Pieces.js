import mongoose from "mongoose";

const excerptSchema = new mongoose.Schema({
  text: { type: String },
  repetitions: { type: Number },
  timeToSpend: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, min: 0, max: 59, default: 0 },
    seconds: { type: Number, min: 0, max: 59, default: 0 },
  },
  targetTempo: { type: Number },
  endMetronomeGoal: { type: Number },
});

const tempiSchema = new mongoose.Schema({
  tempo: {
    type: Number,
    text: String,
  },
});

const movementSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  movementNumber: Number,
  tempi: [tempiSchema],
  settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Settings",
  },
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

const pieceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    composer: {
      type: String,
    },
    length: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, min: 0, max: 59, default: 0 },
      seconds: { type: Number, min: 0, max: 59, default: 0 },
    },
    movements: [movementSchema],
  },
  { timestamps: true }
);

export const PiecesModel = mongoose.model("Pieces", pieceSchema);
