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
app.use(
  cors({
    origin: ["http://localhost:3000", "https://practice-planner.onrender.com"],
    credentials: true,
    allowedHeaders: [
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    ],
    methods: ["GET, POST, PUT, DELETE, UPDATE"],
  })
);

app.use("/auth", userRouter)
app.use("/programs", programsRouter)
app.use("/practiceSessions", practiceSessionsRouter)
app.use("/settings", settingsRouter)

app.use("/pieces", piecesRouter)

let mongoUri;

if (process.env.NODE_ENV === "production") {
  mongoUri = process.env.MONGO_URI_PROD;
} else {
  mongoUri = process.env.MONGO_URI_DEV;
}

console.log("mongoUri: ", mongoUri)

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.listen(3001, () => console.log("Server Started"))
