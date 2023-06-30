import express from "express";
import mongoose from "mongoose";
import {PracticePlansModel} from "../models/PracticePlans.js"
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

//get specific practicePlan
router.get(`/practicePlan/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const practicePlan = await PracticePlansModel.findById(id);
    if (practicePlan) {
      res.json(program);
    } else {
      res.status(404).json({ message: "PracticePlan not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all practice plans
router.get("/user/:userID", async (req, res) => {
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
    console.log("req.body from post", req.body);
    const practicePlan = new PracticePlansModel({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });

    try {
      const savedPracticePlan = await practicePlan.save();
      res.status(201).json(savedPracticePlan);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  });

router.get('/single/:id', async (req,res) => {
  try {
    console.log("inside mysterious .get in router")
    const practicePlan = await PracticePlansModel.findById(req.params.id).populate('programId').populate('pieceId');
    console.log("practicePlan inside /single/:id", practicePlan)
  } catch (err) {
    res.status(500).json(err)
  }
})

//edit a practice plan
router.put(`/practiceplan/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedPracticePlan = await PracticePlansModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    console.log("updatedPracticePlan from server side put:", updatedPracticePlan)
    res.status(200).json(updatedPracticePlan);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json(err);
  }
});

//delete a practice plan
router.delete("/practiceplan/:id", async (req,res) => {
  try {
    const id = req.params.id;
    console.log("Received delete request for ID: ", id);
    await PracticePlansModel.findByIdAndRemove(id);
    res.status(200).json({ message: "Practice Plan deleted successfully" });
  } catch(err) {
    console.log("error:", err)
    res.status(500).json(err)
  }
})


export { router as practicePlansRouter };
