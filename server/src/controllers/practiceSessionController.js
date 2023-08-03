import express from "express";
import mongoose from "mongoose";
import { PracticeSessionsModel } from "../models/PracticeSessions.js";
import { PiecesModel } from "../models/Pieces.js";

export const getPracticeSession = async (req, res) => {
  try {
    const id = req.params.id;
    // const practiceSession = await PracticeSessionsModel.findById(id).populate("piece");
    const practiceSession = await PracticeSessionsModel.findById(id).populate("pieces");
    if (practiceSession) {
      res.json(practiceSession);
      console.log("****************PRACTICESESSION", practiceSession)

    } else {
      res.status(404).json({ message: "Practice Session not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const findAllPracticeSessionsFromUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const result = await PracticeSessionsModel.find({
      userOwner: userID,
      // populate the piece field, if it's a single object
    // }).populate("piece");

    // populate the pieces field, if it's an array of objects
  }).populate("pieces")

    console.log("RESULT?!", result)

    res.json(result);
    console.log("all practice sessions", result);
  } catch (err) {
    res.json(err);
  }
};

export const saveNewPracticeSession = async (req, res) => {
  console.log("req.body from post in practiceSessions router", req.body);
  const practiceSession = new PracticeSessionsModel({
    _id: new mongoose.Types.ObjectId(),
    ...req.body,
  });

  try {
    let pieceObjs = [];
    // For multiple pieces
    if (req.body.pieces) {
      for (const pieceId of req.body.pieces) {
        const pieceObj = await PiecesModel.findById(pieceId);
        if (pieceObj) {
          await pieceObj.save();
          pieceObjs.push(pieceObj);
        } else {
          console.log(`Piece with _id ${pieceId} not found`);
        }
      }
    }

    const savedPracticeSession = await practiceSession.save();

    for (const pieceObj of pieceObjs) {
      pieceObj.practiceSessions.push(savedPracticeSession._id);
      await pieceObj.save();
    }

    res.status(201).json(savedPracticeSession);
    console.log("savedPracticeSession", savedPracticeSession);
  } catch (err) {
    console.log(
      "oh no, something went wrong in saving your piece in the practiceSession"
    );
    console.log(err);
    res.json(err);
  }
};


export const getSinglePracticeSession = async (req, res) => {
  try {
    console.log("inside mysterious .get in router");
    const practiceSession = await PracticeSessionsModel.findById(req.params.id)
      .populate("pieces");
    console.log("practiceSession inside /single/:id", practiceSession);
    res.json(practiceSession)
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editPracticeSession = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  // For multiple pieces
  let updatedPieces = [];
  for (const pieceId of req.body.pieces) {
    const pieceObj = await PiecesModel.findById(pieceId);
    await pieceObj.save();
    updatedPieces.push(pieceObj);
  }

  // Update the pieces in the practice session
  updates.pieces = updatedPieces.map((piece) => piece._id);

  try {
    const updatedPracticeSession =
      await PracticeSessionsModel.findByIdAndUpdate(id, updates, {
        new: true,
      });

    console.log(
      "updatedPracticeSession from server side put for updated practice session: ",
      updatedPracticeSession
    );
    res.status(200).json(updatedPracticeSession);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json(err);
  }
};


export const deletePracticeSession = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Received delete request for ID: ", id);
    await PracticeSessionsModel.findByIdAndRemove(id);
    res.status(200).json({ message: "Practice Session deleted successfully" });
  } catch (err) {
    console.log("error:", err);
    res.status(500).json(err);
  }
};
