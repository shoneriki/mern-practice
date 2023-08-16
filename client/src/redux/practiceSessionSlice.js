import { createSlice } from "@reduxjs/toolkit";
import {createDraft, finishDraft} from "immer";

const practiceSessionSlice = createSlice({
  name: "practiceSession",
  initialState: {
    sessions: {},
    tempSession: null,
    // tempSession for before the practiceSession is saved into the database
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
      state.sessions[sessionId].pieces.push(piece);
    },
    removePieceFromSession: (state, action) => {
      const { sessionId, pieceId } = action.payload;
      state.sessions[sessionId].pieces = state.sessions[
        sessionId
      ].pieces.filter((p) => p._id !== pieceId);
    },

    setTempSession: (state, action) => {
      const { data } = action.payload;
      state.tempSession = {
        ...data,
        totalSessionLength: { ...data.totalSessionLength },
      };
    },
    addPieceToTempSession: (state,action) => {
      const {piece} = action.payload;
      if(!state.tempSession) {
        state.tempSession = {
          pieces: [piece],
          totalSessionLength: {
            ...state.tempSession?.totalSessionLength
          }
        }
      } else {
        state.tempSession.pieces.push(action.payload);
      }
    },
    removePieceFromTempSession: (state, action) => {
      const {pieceId} = action.payload;
      state.tempSession.pieces = state.tempSession.pieces.filter((pieceObj) => pieceObj._id !== pieceId);
    }
  },
});

export const { setSession, addPieceToSession, removePieceFromSession, setTempSession, addPieceToTempSession, removePieceFromTempSession } =
  practiceSessionSlice.actions;
export default practiceSessionSlice.reducer;
