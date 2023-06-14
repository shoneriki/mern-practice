import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import "dotenv/config.js";
import {UserModel} from '../models/Users.js'

const router = express.Router()

router.post("/register", async (req, res) => {
  const {username, password} = req.body;
  const user = await UserModel.findOne({username});

  if(user) {
    return res.json({message: "User already exists!"});
  }

  const hashedPassword = await bcrypt.hash(password,10);

  const newUser = new UserModel({username, password: hashedPassword});
  await newUser.save()

  const token = jwt.sign({id: newUser._id}, process.env.SECRET)

  res.json({message: "User Registered Successfully", token, userID: newUser._id});
})

router.post("/login", async (req, res) => {
  const {username, password} = req.body;
  const user = await UserModel.findOne({username})

  if(!user) {
    return res.json({message: "User Doesn't Exist..."})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid) {
    return res.json({message: "sorry, invalid credentials..."})
  }

  const token = jwt.sign({id: user._id}, process.env.SECRET)
  res.json({token, userID: user._id})
})

export {router as userRouter}
