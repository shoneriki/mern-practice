import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config.js";
import {userRouter} from './routes/users.js'
import {practiceSessionsRouter} from './routes/practiceSessions.js'
import {programsRouter} from './routes/programs.js'
import {settingsRouter} from "./routes/settings.js"
import {piecesRouter} from "./routes/pieces.js"

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter)
app.use("/programs", programsRouter)
app.use("/practiceSessions", practiceSessionsRouter)
app.use("/settings", settingsRouter)

app.use("/pieces", piecesRouter)


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.listen(3001, () => console.log("Server Started"))
