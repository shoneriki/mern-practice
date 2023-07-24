import express from "express";
import mongoose from "mongoose";
import { ProgramsModel } from "../models/Programs.js";
import { UserModel } from "../models/Users.js";
// import { verifyToken } from "../controllers/UserController.js";

const router = express.Router();

import {
  search,
  getProgram,
  getAllProgramsFromUser,
  saveNewProgram,
  editProgram,
  deleteProgram,
} from "../controllers/programController.js";

router.get("/search", search);

//get specific program
router.get(`/program/:id`, getProgram);

//get all programs from user
router.get("/user/:userID", getAllProgramsFromUser);

//save a program
router.post("/", saveNewProgram);

//edit a program
router.put(`/program/:id`, editProgram);

//delete a program
router.delete("/program/:id", deleteProgram)

export { router as programsRouter };
