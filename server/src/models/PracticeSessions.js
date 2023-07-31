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
    // piece: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Pieces",
    // },
    pieces: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pieces",
    }],
    // excerpts: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Pieces.excerpts",
    //   },
    // ],
    runThrough: { type: Boolean, default: false },
    pieceLength: {
      hours: { type: Number, min: 0, max: 10 },
      minutes: { type: Number, min: 0, max: 59 },
      seconds: { type: Number, min: 0, max: 59 },
    },
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


// {
//   "_id": {
//     "$oid": "64c7258bca5edaee28c0bbfc"
//   },
//   "dateOfExecution": "2023-08-01T00:00:00.000Z",
//   "name": "My Practice Session",
//   "totalSessionLength": {
//     "hours": 1,
//     "minutes": 30,
//     "seconds": 0
//   },
//   "pieces": [
//     "64c211a1c8b97f79c2a6179a",
//     "64c211c4c8b97f79c2a617ae"
//   ],
//   "runThrough": false,
//   "pieceLength": {
//     "hours": 0,
//     "minutes": 45,
//     "seconds": 0
//   },
//   "performanceDate": "2023-08-30T00:00:00.000Z",
//   "notes": "Some notes about the practice session",
//   "userOwner": "64c210eec8b97f79c2a6177d"
// }
