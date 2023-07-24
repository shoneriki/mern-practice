import express from "express";
import mongoose from "mongoose";
import { PiecesModel } from "../models/Pieces.js";
import {ProgramsModel} from "../models/Programs.js"
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

import {
  getPiecesSuggestions,
  getPiece,
  findAllPiecesFromUser,
  saveNewPiece,
  editPiece,
  deletePiece
} from "../controllers/pieceController.js";

const router = express.Router();

router.get("/suggestions", getPiecesSuggestions);

//get specific piece
router.get(`/piece/:id`, getPiece);

//get all pieces from user
router.get("/user/:userID", findAllPiecesFromUser);

//save a piece
router.post("/", saveNewPiece);

//edit a piece
router.put(`/piece/:id`, editPiece);

//delete a piece
router.delete("/piece/:id", deletePiece);


export { router as piecesRouter };
