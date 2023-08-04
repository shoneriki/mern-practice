import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { PracticeSessionsModel } from "../../src/models/PracticeSessions.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let mongoUri;

if (process.env.NODE_ENV === "production") {
  mongoUri = process.env.MONGO_URI_PROD;
} else if (process.env.NODE_ENV === "test") {
  mongoUri = process.env.MONGO_URI_TEST;
} else {
  mongoUri = process.env.MONGO_URI_DEV;
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for migration"))
  .catch((err) => console.log(err));

async function migrate() {
  // Find all practice sessions
  const practiceSessions = await PracticeSessionsModel.find();

  // Loop through each practice session
  for (const practiceSession of practiceSessions) {
    // If the practice session has a piece field, move it to the pieces array
    if (practiceSession.piece) {
      practiceSession.pieces = [practiceSession.piece];
      delete practiceSession.piece;
      await practiceSession.save();
    }
  }

  console.log("Migration complete");

  mongoose.connection.close();
}

migrate().catch(console.error);
