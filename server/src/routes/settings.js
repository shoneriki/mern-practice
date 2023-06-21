import express from "express";
import mongoose from "mongoose";

import {SettingsModel} from "../models/Settings.js"
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const settings = new SettingsModel({
    _id: new mongoose.Types.ObjectId(),
    minTime: req.body.minTime,
    mediumTime: req.body.mediumTime,
    longTime: req.body.longTime,
    totalPracticeTime: req.body.totalPracticeTime
  });
  console.log(settings);

  try {
    const result = await settings.save();
    res.status(201).json({
      createdSettings: {
        _id: result._id,
        minTime: result.minTime,
        mediumTime: result.mediumTime,
        longTime: result.body.longTime,
        totalPracticeTime: result.body.totalPracticeTime,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.json(err);
  }
});

//get all practice plans
// router.get("/", async (req, res) => {
//   try {
//     const result = await ProgramsModel.find({});
//     res.json(result);
//   } catch (err) {
//     res.json(err);
//   }
// });

// // Create a new practice plan , add verifyToken when usable
// router.post("/", async (req, res) => {
//   const pieces = req.body.pieces.map((piece) => ({
//     ...piece,
//     lengthInSeconds:
//       piece.length.hours * 3600 +
//       piece.length.minutes * 60 +
//       piece.length.seconds,
//   }));
//   const programPlan = new ProgramsModel({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     numOfPieces: req.body.numOfPieces,
//     pieces: req.body.pieces,
//     intermission: req.body.intermission,
//     date: req.body.date,
//   });
//   console.log(programPlan);

//   try {
//     const result = await programPlan.save();
//     res.status(201).json({
//       createdProgram: {
//         _id: result._id,
//         name: result.name,
//         numOfPieces: result.numOfPieces,
//         pieces: result.pieces,
//         intermission: result.intermission,
//         length: result.length,
//         date: req.body.date,
//       },
//     });
//   } catch (err) {
//     // console.log(err);
//     res.json(err);
//   }
// });

// router.get("/search", async (req, res) => {
//   try {
//     const pieceName = req.query.pieceName;
//     const programs = await ProgramsModel.find({
//       "pieces.name": { $regex: new RegExp(pieceName, "i") },
//     });
//     const pieces = [];
//     programs.forEach((program) => {
//       program.pieces.forEach((piece) => {
//         if (piece.name.toLowerCase().includes(pieceName.toLowerCase())) {
//           pieces.push(piece);
//         }
//       });
//     });
//     res.json(pieces);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

export { router as settingsRouter };
