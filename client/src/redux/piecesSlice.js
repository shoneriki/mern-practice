import {createSlice} from '@reduxjs/toolkit'

const selectedPiecesSlice = createSlice({
  name: "selectedPieces",
  initialState: [],
  reducers: {
    setSelectedPieces: (state, action) => {
      return action.payload;
    },
    addPiece: (state, action) => {
      state.push(action.payload);
    },
    removePiece: (state, action) => {
      const index = state.findIndex((piece) => piece._id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const {addPiece, removePiece, setSelectedPieces} = selectedPiecesSlice.actions;

export default selectedPiecesSlice.reducer;
