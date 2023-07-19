import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    numOfPieces: {
      type: Number,
    },
    pieces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pieces",
      },
    ],
    intermission: {
      type: Number,
    },
    length: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, min: 0, max: 59, default: 0 },
      seconds: { type: Number, min: 0, max: 59, default: 0 },
    },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

programSchema.pre("save", async function (next) {
  await this.populate("pieces");

  let totalLengthInSeconds = 0;
  for (let i = 0; i < this.pieces.length; i++) {
    const piece = this.pieces[i];
    totalLengthInSeconds +=
      piece.length.hours * 3600 +
      piece.length.minutes * 60 +
      piece.length.seconds;
  }
  totalLengthInSeconds += this.intermission * 60;

  this.length.hours = Math.floor(totalLengthInSeconds / 3600);
  totalLengthInSeconds %= 3600;
  this.length.minutes = Math.floor(totalLengthInSeconds / 60);
  this.length.seconds = totalLengthInSeconds % 60;

  next();
});


export const ProgramsModel = mongoose.model(
  "Programs",
  programSchema
);
