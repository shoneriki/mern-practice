import express from "express";
import mongoose from "mongoose";
import { PiecesModel } from "../models/Pieces.js";
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

router.get("/suggestions", async (req, res) => {
  const { search } = req.query;
  try {
    // Fetch pieces matching the search query from the database
    const pieces = await PiecesModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } }, // Match by name
        { composer: { $regex: search, $options: "i" } }, // Match by composer
      ],
    })

    res.json(pieces);
    console.log("all pieces related to search", pieces)
  } catch (error) {
    console.error("Error while fetching piece suggestions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
    console.log("req.params ", req.params)
    await PiecesModel.findByIdAndRemove(id);
    res.status(200).json({ message: "Piece deleted successfully" });
  } catch (err) {
    console.log("error:", err);
    res.status(500).json(err);
  }
});

export { router as piecesRouter };
