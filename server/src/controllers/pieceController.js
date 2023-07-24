import mongoose from "mongoose";
import { PiecesModel } from "../models/Pieces.js";
import { ProgramsModel } from "../models/Programs.js";

export const getPiecesSuggestions = async (req, res) => {
  const { search } = req.query;
  try {
    const pieces = await PiecesModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { composer: { $regex: search, $options: "i" } },
      ],
    });
    res.json(pieces);
  } catch (error) {
    console.error("Error while fetching piece suggestions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPiece = async (req, res) => {
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
};

export const findAllPiecesFromUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const result = await PiecesModel.find({ userOwner: userID });
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

export const saveNewPiece = async (req, res) => {
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
};

export const editPiece = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("req.body from put request in piece router", req.body);
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
};

export const deletePiece = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("req.params ", req.params);
    const deletedPiece = await PiecesModel.findByIdAndRemove(id);

    // Find all programs that contain the deleted piece
    const programs = await ProgramsModel.find({ pieces: id });

    // For each program, remove the deleted piece
    for (let program of programs) {
      const pieceIndex = program.pieces.indexOf(id);
      if (pieceIndex > -1) {
        program.pieces.splice(pieceIndex, 1);
        await program.save();
      }
    }

    if (deletedPiece) {
      res.status(200).json({ message: "Piece deleted successfully" });
    } else {
      res.status(404).json({ message: "Piece not found" });
    }
  } catch (err) {
    console.log("error:", err);
    res.status(500).json(err);
  }
};
