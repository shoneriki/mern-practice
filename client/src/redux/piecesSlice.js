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
      return state.filter((piece) => piece._id !== action.payload._id);
    },
  },
});

export const {addPiece, removePiece, setSelectedPieces} = selectedPiecesSlice.actions;

export default selectedPiecesSlice.reducer;
