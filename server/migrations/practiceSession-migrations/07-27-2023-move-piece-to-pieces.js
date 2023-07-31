import { PracticeSessionsModel } from "./models/PracticeSessions.js";

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
}

migrate().catch(console.error);
