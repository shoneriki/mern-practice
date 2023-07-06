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
    excerpts: [excerptSchema],
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const PiecesModel = mongoose.model("Pieces", pieceSchema);
