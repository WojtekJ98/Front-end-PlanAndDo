import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectActiveBoard = (state: RootState) => state.boards.activeBoard;

export const selectActiveBoardObj = createSelector(
  [(state: RootState) => state.boards],
  (boardState) =>
    boardState.boards.find((board) => board._id === boardState.activeBoard)
);
