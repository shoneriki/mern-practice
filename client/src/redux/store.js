import { configureStore } from "@reduxjs/toolkit";
import selectedPiecesReducer from "./piecesSlice";

const store = configureStore({
  reducer: {
    selectedPieces: selectedPiecesReducer,
  },
});

export default store;
