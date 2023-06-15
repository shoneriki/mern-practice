const mongoose = require('mongoose');

const practicePlanSchema = new mongoose.Schema({
  pieceName: {
    type: String,
  },
  composer: {
    type: String,
  },
  excerpts: {
    type: String,
  },
  movements: {
    type: String,
  },
  endMetronomeGoal: {
    type: Number,
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {timestamps: true});

export const practicePlanModel = mongoose.model("PracticePlans", practicePlanSchema)

