import express from "express";
import mongoose from "mongoose";
import { ProgramsModel } from "../models/Programs.js";
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const pieceTitle = req.query.pieceTitle;
    const programs = await ProgramsModel.find({
      "pieces.name": { $regex: new RegExp(pieceTitle, "i") },
    });
    const pieces = [];
    programs.forEach((program) => {
      program.pieces.forEach((piece) => {
        if (piece.name.toLowerCase().includes(pieceTitle.toLowerCase())) {
          pieces.push(piece);
        }
      });
    });
    res.json(pieces);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all practice plans
router.get("/:userID", async (req, res) => {
  console.log("req.params", req.params)
  try {
    const userID = req.params.userID;
    const result = await ProgramsModel.find({userOwner: userID});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});


router.post("/", async (req, res) => {
  console.log("req.body from post",req.body)
  const programPlan = new ProgramsModel({
    _id: new mongoose.Types.ObjectId(),
    ...req.body,
  });

  console.log(programPlan);

  try {
    const result = await programPlan.save();
    res.status(201).json({
      createdProgram: {
        _id: result._id,
        name: result.name,
        numOfPieces: result.numOfPieces,
        pieces: result.pieces,
        intermission: result.intermission,
        length: result.length,
        date: result.date,
        userOwner: result.userOwner,
      },
    });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

export { router as programsRouter };
