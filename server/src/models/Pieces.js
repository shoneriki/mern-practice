import mongoose from "mongoose";

const excerptSchema = new mongoose.Schema({
  location: { type: String },
  notes: {type: String},
  repetitions: { type: Number },
  timeToSpend: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, min: 0, max: 59, default: 0 },
    seconds: { type: Number, min: 0, max: 59, default: 0 },
  },
  tempi: [
    {
      notes: {type: String},
      bpm: {type: Number, min: 10, max: 300},
    },
  ],
  mastered: {type: Boolean}
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
    mastered: {type: Boolean},
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const PiecesModel = mongoose.model("Pieces", pieceSchema);
