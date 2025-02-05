import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, BoardState, Column, SubTasks, Task } from "../../types";

const initialState: BoardState = {
  boards: [],
  activeBoard: null,
};

const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (
      state,
      action: PayloadAction<{ id: string; title: string; columns: Column[] }>
    ) => {
      const newBoard: Board = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        columns: action.payload.columns,
      };
      state.boards.push(newBoard);
    },
    setActiveBoard: (state, action: PayloadAction<string>) => {
      state.activeBoard = action.payload;
    },
    editBoard: (state, action) => {
      state.boards = state.boards.map((board) =>
        board.id === action.payload.id
          ? {
              ...board,
              title: action.payload.boardTitle,
              columns: action.payload.columns,
            }
          : board
      );
    },
    deleteBoard: (state, action) => {
      const upDateBoards = state.boards.filter(
        (board) => board.id !== action.payload
      );
      state.boards = upDateBoards;
    },
    editColumnTitle: (state, action) => {
      state.boards.find((item: Board) =>
        item.id === state.activeBoard
          ? item.columns.find((col: Column) =>
              col.id === action.payload.selectColumn.id
                ? (col.title = action.payload.editedTitle)
                : null
            )
          : null
      );
    },
    deleteColumn: (state, action) => {
      state.boards.find((item: Board) =>
        item.id === state.activeBoard
          ? item.columns.find((col: Column) =>
              col.id === action.payload.id
                ? (item.columns = item.columns.filter(
                    (c) => c.id !== action.payload.id
                  ))
                : null
            )
          : null
      );
      console.log("Deleted column with ID:", action.payload.id);
    },
    addTask: (state, action) => {
      const { columnId, task } = action.payload;

      const activeBoard = state.boards.find(
        (board) => board.id === state.activeBoard
      );

      if (!activeBoard) {
        console.error("Active board not found.");
        return;
      }

      const column = activeBoard.columns.find((col) => col.id === columnId);

      if (!column) {
        console.error(`Column with id ${columnId} not found.`);
        return;
      }

      if (!column.tasks) {
        column.tasks = [];
      }

      column.tasks.push(task);
    },
    editTask: (state, action) => {
      const { taskId, columnId, updatedTask } = action.payload;

      const activeBoard = state.boards.find(
        (board) => board.id === state.activeBoard
      );

      if (!activeBoard) return;

      const column = activeBoard.columns.find((col) => col.id === columnId);
      if (!column) return;
      const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return;

      column.tasks[taskIndex] = {
        ...column.tasks[taskIndex],
        ...updatedTask,
      };
    },
    reorderTask: (state, action) => {
      const { columnId, updatedTask } = action.payload;

      const activeBoard = state.boards.find(
        (board) => board.id === state.activeBoard
      );

      if (!activeBoard) return;

      const column = activeBoard.columns.find((col) => col.id === columnId);
      if (!column) return;

      column.tasks = updatedTask.tasks;
    },
    deleteTask: (state, action) => {
      state.boards.find((item: Board) =>
        item.id === state.activeBoard
          ? item.columns.find((col: Column) =>
              col.id === action.payload.columnId
                ? col.tasks.find((t) => t.id === action.payload.taskId)
                  ? (col.tasks = col.tasks.filter(
                      (tas) => tas.id !== action.payload.taskId
                    ))
                  : null
                : null
            )
          : null
      );
      console.log(
        "Deleted column with ID:",
        action.payload.columnId,
        "task",
        action.payload.taskId
      );
    },
    updateSubtask: (state, action) => {
      state.boards.find((item: Board) =>
        item.id === state.activeBoard
          ? item.columns.find((col: Column) =>
              col.id === action.payload.columnId
                ? col.tasks.find((t: Task) =>
                    t.id === action.payload.taskId
                      ? t.subTasks.find((st: SubTasks) =>
                          st.id === action.payload.subTaskId
                            ? (st.done = !st.done)
                            : null
                        )
                      : null
                  )
                : null
            )
          : null
      );
    },
  },
});

export const {
  reorderTask,
  updateSubtask,
  deleteTask,
  addBoard,
  editTask,
  setActiveBoard,
  editBoard,
  deleteBoard,
  editColumnTitle,
  deleteColumn,
  addTask,
} = boardSlice.actions;
export default boardSlice.reducer;
