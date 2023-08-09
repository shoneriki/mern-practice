import { createSlice } from "@reduxjs/toolkit";
import {createDraft, finishDraft} from "immer";

const practiceSessionSlice = createSlice({
  name: "practiceSession",
  initialState: {
    sessions: {},
  },
  reducers: {
    setSession: (state, action) => {
      const { sessionId, data } = action.payload;
      state.sessions[sessionId] = data;
    },
    addPieceToSession: (state, action) => {
      const { sessionId, piece } = action.payload;
      state.sessions[sessionId].pieces.push(piece);
    },
    removePieceFromSession: (state, action) => {
      const { sessionId, pieceId } = action.payload;
      state.sessions[sessionId].pieces = state.sessions[
        sessionId
      ].pieces.filter((p) => p._id !== pieceId);
    },
  },
});

export const { setSession, addPieceToSession, removePieceFromSession } =
  practiceSessionSlice.actions;
export default practiceSessionSlice.reducer;
