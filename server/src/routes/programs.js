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
          const pieceWithProgramId = program._id
            ? {
              ...piece._doc,
              programId: program._id,
              programName: program.name,
              programDate: program.date,
            }
            : {
              ...piece._doc
            }
          pieces.push(pieceWithProgramId);
        }
      });
    });
    res.json(pieces);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get specific program
router.get(`/program/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const program = await ProgramsModel.findById(id);
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ message: "Program not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all programs from user
router.get("/user/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const result = await ProgramsModel.find({userOwner: userID});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

//save a program
router.post("/", async (req, res) => {
  console.log("req.body from post",req.body)
  const programPlan = new ProgramsModel({
    _id: new mongoose.Types.ObjectId(),
    ...req.body,
  });

  try {
    const savedProgram = await programPlan.save();
    res.status(201).json(savedProgram)
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});


//edit a program
router.put(`/program/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedProgram = await ProgramsModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    console.log("updatedProgram from server side put:", updatedProgram)
    res.status(200).json(updatedProgram);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json(err);
  }
});

//delete a program
router.delete("/program/:id", async (req,res) => {
  try {
    const id = req.params.id;
    await ProgramsModel.findByIdAndRemove(id);
    res.status(200).json({message: "Program deleted successfully"})
  } catch(err) {
    console.log("error:", err)
    res.status(500).json(err)
  }
})

export { router as programsRouter };
