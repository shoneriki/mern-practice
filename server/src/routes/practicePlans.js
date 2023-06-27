import express from "express";
import mongoose from "mongoose";
import {PracticePlansModel} from "../models/PracticePlans.js"
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

//get all practice plans
router.get("/user/:userID", async (req, res) => {
  console.log("req.params from practicePlans router")
  try {
    const userID = req.params.userID;
    const result = await PracticePlansModel.find({userOwner: userID});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// Create a new practice plan , add verifyToken when usable
router.post("/", async (req, res) => {
  const {
    composer,
    pieceTitle,
    pieceId,
    movements,
    practiceStartDate,
    daily,
    timesPerWeek,
    untilDate,
    practiceLengthInMinutes,
    notes,
    programId,
    userOwner,
  } = req.body


  const practicePlan = new PracticePlansModel({
    _id: new mongoose.Types.ObjectId(),
    composer,
    pieceTitle,
    pieceId,
    movements,
    practiceStartDate,
    daily,
    timesPerWeek,
    untilDate,
    practiceLengthInMinutes,
    notes,
    programId,
    userOwner,
  });
  console.log(practicePlan);

  try {
    const result = await practicePlan.save();
    res.status(201).json({ createdPracticePlan: result});
  } catch (err) {
    res.json(err);
  }
});

router.get('/single/:id', async (req,res) => {
  try {
    const practicePlan = await PracticePlansModel.findById(req.params.id).populate('programId').populate('pieceId');
    res.json(practicePlan);
  } catch (err) {
    res.status(500).json(err)
  }
})


export { router as practicePlansRouter };
