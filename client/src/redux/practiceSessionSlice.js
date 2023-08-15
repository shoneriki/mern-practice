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
      state.sessions[sessionId] = {
        ...data,
        totalSessionLength: { ...data.totalSessionLength }, // Create a copy of the object
      };
    },
    addPieceToSession: (state, action) => {
      const { sessionId, piece } = action.payload;
      if (!state.sessions[sessionId]) {
        // If the session doesn't exist
        state.sessions[sessionId] = {
          // Create a new session
          pieces: [piece], // Initialize the pieces array with the given piece
          // You can add other properties here if needed
          totalSessionLength: {
            ...state.sessions[sessionId].totalSessionLength,
          },
        };
      } else {
        state.sessions[sessionId].pieces.push(piece); // If the session exists, add the piece to it
      }
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
