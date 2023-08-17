import { createSlice } from "@reduxjs/toolkit";
// import { createDraft, finishDraft } from "immer";

const programSlice = createSlice({
  name: "practiceSession",
  initialState: {
    programs: {},
    tempProgram: null,
    // tempSession for before the program is saved into the database
  },
  reducers: {
    setProgram: (state, action) => {
      const { programId, data } = action.payload;
      state.sessions[programId] = {
        ...data,
        length: {...data.length},
      };
    },
    addPieceToProgram: (state, action) => {
      const { programId, piece } = action.payload;
      state.programs[programId].pieces.push(piece);
    },
    removePieceFromProgram: (state, action) => {
      const { programId, pieceId } = action.payload;
      state.programs[programId].pieces = state.sessions[
        programId
      ].pieces.filter((piece) => piece._id !== pieceId);
    },

    setTempProgram: (state, action) => {
      const { data } = action.payload;
      console.log("data?!", data);
      state.tempSession = {
        ...data,
        length: { ...data.length },
      };
    },
    addPieceToTempProgram: (state, action) => {
      const pieceId = action.payload;
      if (!state.tempProgram) {
        state.tempProgram = {
          ...state.tempProgram,
          pieces: [pieceId],
          length: { ...state.tempProgram.length },
        };
      } else {
        state.tempProgram = {
          ...state.tempProgram,
          pieces: [...state.tempProgram.pieces, pieceId],
          length: { ...state.tempProgram.length },
        };
      }
    },
    removePieceFromTempProgram: (state, action) => {
      const { pieceId } = action.payload;
      state.tempProgram.pieces = state.tempProgram.pieces.filter(
        (pieceObj) => pieceObj._id !== pieceId
      );
    },
  },
});

export const {
  setProgram,
  addPieceToProgram,
  removePieceFromProgram,
  setTempProgram,
  addPieceToTempProgram,
  removePieceFromTempProgram,
} = programSlice.actions;
export default programSlice.reducer;
