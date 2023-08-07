import { configureStore } from "@reduxjs/toolkit";
import selectedPiecesReducer from "./piecesSlice";
import practiceSessionReducer from "./practiceSessionSlice"

const store = configureStore({
  reducer: {
    practiceSession: practiceSessionReducer,
    selectedPieces: selectedPiecesReducer,
  },
});

export default store;
