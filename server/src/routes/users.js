import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import "dotenv/config.js";
import {UserModel} from '../models/Users.js'
import {register, login} from '../controllers/UserController.js'

const router = express.Router()

router.post("/register", register)

router.post("/login", login)

export {router as userRouter}
