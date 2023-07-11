import express from "express";
import mongoose from "mongoose";
import {PracticeSessionsModel} from "../models/PracticeSessions.js"
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

//get specific practicePlan
router.get(`/practiceSession/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const practicePlan = await PracticeSessionsModel.findById(id);
    if (practiceSession) {
      res.json(practiceSession);
    } else {
      res.status(404).json({ message: "Practice Session not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all practice plans
router.get("/user/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const result = await PracticeSessionsModel.find({ userOwner: userID })
      .populate("piece")
      // populate the piece field
      .then((practiceSession) => {
        res.send(practiceSession);
      });
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

  // Create a new practice plan , add verifyToken when usable
  router.post("/", async (req, res) => {
    console.log("req.body from post in practiceSessions router", req.body);
    const practiceSession = new PracticeSessionsModel({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });

    try {
      const savedPracticeSession = await practiceSession.save();
      res.status(201).json(savedPracticeSession);
      console.log("SUBMITTED... YAY!")
    } catch (err) {
      console.log("oh no, something is wrong")
      console.log(err);
      res.json(err);
    }
  });

router.get('/single/:id', async (req,res) => {
  try {
    console.log("inside mysterious .get in router")
    const practiceSession = await PracticeSessionsModel.findById(req.params.id).populate('programId').populate('pieceId');
    console.log("practicePlan inside /single/:id", practicePlan)
  } catch (err) {
    res.status(500).json(err)
  }
})

//edit a practice plan
router.put(`/practiceSession/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedPracticeSession = await PracticeSessionsModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    console.log("updatedPracticeSession from server side put:", updatedPracticeSession)
    res.status(200).json(updatedPracticeSession);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json(err);
  }
});

//delete a practice plan
router.delete("/practiceSession/:id", async (req,res) => {
  try {
    const id = req.params.id;
    console.log("Received delete request for ID: ", id);
    await PracticePlansModel.findByIdAndRemove(id);
    res.status(200).json({ message: "Practice Session deleted successfully" });
  } catch(err) {
    console.log("error:", err)
    res.status(500).json(err)
  }
})


export { router as practiceSessionsRouter };
