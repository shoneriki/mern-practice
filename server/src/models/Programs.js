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
    lengthInMinutes: {
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
    lengthInMinutes: {
      type: Number,
    },
  },
  { timestamps: true }
);

programSchema.pre("save", function (next) {
  let totalLength = 0;
  for (let i = 0; i < this.pieces.length; i++) {
    totalLength += this.pieces[i].lengthInMinutes;
  }
  this.lengthInMinutes = totalLength;
  next();
});

export const ProgramsModel = mongoose.model(
  "Programs",
  programSchema
);
