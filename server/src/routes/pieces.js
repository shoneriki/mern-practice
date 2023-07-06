import express from "express";
import mongoose from "mongoose";
import { PiecesModel } from "../models/Pieces.js";
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

// router.get("/search", async (req, res) => {
//   try {
//     const pieceTitle = req.query.pieceTitle;
//     const programs = await ProgramsModel.find({
//       "pieces.name": { $regex: new RegExp(pieceTitle, "i") },
//     });
//     const pieces = [];
//     programs.forEach((program) => {
//       program.pieces.forEach((piece) => {
//         if (piece.name.toLowerCase().includes(pieceTitle.toLowerCase())) {
//           const pieceWithProgramId = program._id
//             ? {
//                 ...piece._doc,
//                 programId: program._id,
//                 programName: program.name,
//                 programDate: program.date,
//               }
//             : {
//                 ...piece._doc,
//               };
//           pieces.push(pieceWithProgramId);
//         }
//       });
//     });
//     res.json(pieces);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//get specific program
router.get(`/piece/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const piece = await PiecesModel.findById(id);
    if (piece) {
      res.json(piece);
    } else {
      res.status(404).json({ message: "Piece not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pieces from user
router.get("/user/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const result = await PiecesModel.find({ userOwner: userID });
    console.log("result from get?", result)
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

//save a piece
router.post("/", async (req, res) => {
  console.log("req.body from post", req.body);
  const piecePlan = new PiecesModel({
    _id: new mongoose.Types.ObjectId(),
    ...req.body,
  });

  try {
    const savedPiece = await piecePlan.save();
    res.status(201).json(savedPiece);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//edit a program
router.put(`/piece/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedPiece = await PiecesModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    console.log("updatedPiece from server side put:", updatedPiece);
    res.status(200).json(updatedPiece);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json(err);
  }
});

//delete a program
router.delete("/piece/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await PiecesModel.findByIdAndRemove(id);
    res.status(200).json({ message: "Piece deleted successfully" });
  } catch (err) {
    console.log("error:", err);
    res.status(500).json(err);
  }
});

export { router as piecesRouter };
