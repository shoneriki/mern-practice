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
      state.splice(action.payload, 1);
    },
  },
});

export const {addPiece, removePiece, setSelectedPieces} = selectedPiecesSlice.actions;

export default selectedPiecesSlice.reducer;
