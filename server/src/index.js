import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config.js";
import {userRouter} from './routes/users.js'
import {recipesRouter} from './routes/recipes.js'

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter)
app.use("/recipes", recipesRouter)


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.listen(3001, () => console.log("Server Started"))
