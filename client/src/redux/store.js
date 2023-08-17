import { configureStore } from "@reduxjs/toolkit";
import selectedPiecesReducer from "./piecesSlice";
import practiceSessionReducer from "./practiceSessionSlice"
import programReducer from "./programSlice.js"

const store = configureStore({
  reducer: {
    practiceSession: practiceSessionReducer,
    program: programReducer,
    selectedPieces: selectedPiecesReducer,
  },
});

export default store;
