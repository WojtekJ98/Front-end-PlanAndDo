import { RootState } from "../store";

export const selectActiveBoardColumns = (state: RootState) => {
  const activeBoard = state.boards.activeBoard;
  if (!activeBoard) return [];
  const board = state.boards.boards.find((b) => b.id === activeBoard);
  console.log(board);

  return board ? board.columns : [];
};
