import mongoose from "mongoose";

const pieceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    composer: {
      type: String,
    },
    lengthInSeconds: {
      type: Number,
    },
  },
  {timestamps: true},
)

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    numOfPieces: {
      type: Number,
      required: true,
    },
    pieces: [pieceSchema],
    intermission: {
      type: Number,
    },
    length: {
      type: String,
    },
  },
  { timestamps: true }
);

programSchema.pre("save", function (next) {
  let totalLengthInSeconds = 0;
  for (let i = 0; i < this.pieces.length; i++) {
    totalLengthInSeconds += this.pieces[i].lengthInSeconds;
  }
  this.length = formatSeconds(totalLengthInSeconds);

  function formatSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${hours}hr:${minutes}m:${seconds}sec`;
  }
  next();
});

export const ProgramsModel = mongoose.model(
  "Programs",
  programSchema
);
