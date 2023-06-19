import express from "express";
import mongoose from "mongoose";
import {PracticePlansModel} from "../models/PracticePlans.js"
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

//get all practice plans
router.get("/", async (req, res) => {
  try {
    const result = await PracticePlansModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// Create a new practice plan , add verifyToken when usable
router.post("/", async (req, res) => {
  const practicePlan = new PracticePlansModel({
    _id: new mongoose.Types.ObjectId(),
    composer: req.body.composer,
    pieceName: req.body.pieceName,
    excerpts: req.body.excerpts,
    movements: req.body.movements,
    endMetronomeGoal: req.body.endMetronomeGoal,
    practiceStartDate: req.body.practiceStartDate,
    daily: req.body.daily,
    timesPerWeek: req.body.timesPerWeek,
    untilDate: req.body.untilDate,
    practiceLengthInMinutes: req.body.practiceLengthInMinutes,
    userOwner: req.body.userOwner,
  });
  console.log(practicePlan);

  try {
    const result = await practicePlan.save();
    res.status(201).json({
      createdPracticePlan: {
        _id: result._id,
        composer: result.composer,
        pieceName: result.pieceName,
        excerpts: result.excerpts,
        movements: result.movements,
        endMetronomeGoal: result.endMetronomeGoal,
        practiceStartDate: result.practiceStartDate,
        daily: result.daily,
        timesPerWeek: result.timesPerWeek,
        untilDate: result.untilDate,
        practiceLengthInMinutes: result.practiceLengthInMinutes,
        userOwner: result.userOwner,
      },
    });
  } catch (err) {
    // console.log(err);
    res.json(err);
  }
});

router.get('/:id', async (req,res) => {
  try {
    const practicePlan = await PracticePlansModel.findById(req.params.id).populate('programId');
    res.json(practicePlan);
  } catch (err) {
    res.status(500).json(err)
  }
})


export { router as practicePlansRouter };
