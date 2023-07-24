import express from "express";
import mongoose from "mongoose";
import { PracticeSessionsModel } from "../models/PracticeSessions.js";
import { PiecesModel } from "../models/Pieces.js";
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

import {
  getPracticeSession,
  findAllPracticeSessionsFromUser,
  saveNewPracticeSession,
  getSinglePracticeSession,
  editPracticeSession,
  deletePracticeSession,
} from "../controllers/practiceSessionController.js";

//get specific practice session
router.get(`/practiceSession/:id`, getPracticeSession);

//get all practice sessions
router.get("/user/:userID", findAllPracticeSessionsFromUser);

// Create a new practice session , add verifyToken when usable
router.post("/", saveNewPracticeSession);

router.get("/single/:id", getSinglePracticeSession);

//edit a practice session
router.put(`/practiceSession/:id`, editPracticeSession);

//delete a practice plan
router.delete("/practiceSession/:id", deletePracticeSession);

export { router as practiceSessionsRouter };
