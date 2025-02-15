import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, BoardState, Column, Task } from "../../types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const initialState: BoardState = {
  boards: [],
  activeBoard: null,
};

export const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Boards", "Columns", "Tasks"],
  endpoints: (builder) => ({
    getBoards: builder.query<Board[], void>({
      query: () => "/boards",
      providesTags: ["Boards"],
    }),
    getBoard: builder.query<Board, string>({
      query: (id) => `/boards/${id}`,
      providesTags: (result, error, id) => [{ type: "Boards", id }],
    }),
    addBoard: builder.mutation<Board, Partial<Board>>({
      query: (newBoard) => ({
        url: "/boards",
        method: "POST",
        body: newBoard,
      }),
      invalidatesTags: ["Boards"],
    }),
    editBoard: builder.mutation<
      Board,
      { id: string; updateBoard: Partial<Board> }
    >({
      query: ({ id, updateBoard }) => ({
        url: `/boards/${id}`,
        method: "PUT",
        body: updateBoard,
      }),
      invalidatesTags: ["Boards"],
    }),
    deleteBoard: builder.mutation<Board, { id: string }>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boards"],
    }),
    getColumns: builder.query<Column[], string>({
      query: (boardId) => `/boards/${boardId}/columns`,
      providesTags: ["Columns"],
    }),
    deleteColumn: builder.mutation<
      Column,
      { boardId: string; columnId: string }
    >({
      query: ({ boardId, columnId }) => ({
        url: `/boards/${boardId}/columns/${columnId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Columns", "Boards"],
    }),
    editColumnTitle: builder.mutation<
      Column,
      { boardId: string; columnId: string; editedTitle: string }
    >({
      query: ({ boardId, columnId, editedTitle }) => ({
        url: `/boards/${boardId}/columns/${columnId}`,
        method: "PATCH",
        body: { title: editedTitle },
      }),
      invalidatesTags: ["Columns"],
    }),
    addTask: builder.mutation<
      Task,
      { boardId: string; columnId: string; newTask: Task }
    >({
      query: ({ boardId, columnId, newTask }) => ({
        url: `/boards/${boardId}/columns/${columnId}/tasks`,
        method: "POST",
        body: { newTask },
      }),
      invalidatesTags: ["Tasks", "Columns"],
    }),
    getColTask: builder.query<Task[], { boardId: string; columnId: string }>({
      query: ({ boardId, columnId }) =>
        `/boards/${boardId}/columns/${columnId}/tasks`,
      providesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<
      Task,
      { boardId: string; columnId: string; taskId: string }
    >({
      query: ({ boardId, columnId, taskId }) => ({
        url: `boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks", "Columns"],
    }),
    editTask: builder.mutation<
      Task,
      {
        boardId: string;
        columnId: string;
        taskId: string;
        updatedTask: Partial<Task>;
      }
    >({
      query: ({ boardId, columnId, taskId, updatedTask }) => ({
        url: `boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
        method: "PUT",
        body: { updatedTask },
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateSubTask: builder.mutation<
      Task,
      { boardId: string; columnId: string; taskId: string; subTaskId: string }
    >({
      query: ({ boardId, columnId, taskId, subTaskId }) => ({
        url: `/boards/${boardId}/columns/${columnId}/tasks/${taskId}/subTasks/${subTaskId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setActiveBoard: (state, action: PayloadAction<string>) => {
      state.activeBoard = action.payload;
    },
  },
});

export const { setActiveBoard } = boardSlice.actions;
export default boardSlice.reducer;

export const {
  useGetBoardsQuery,
  useGetBoardQuery,
  useAddBoardMutation,
  useEditBoardMutation,
  useDeleteBoardMutation,
  useDeleteColumnMutation,
  useEditColumnTitleMutation,
  useGetColumnsQuery,
  useAddTaskMutation,
  useGetColTaskQuery,
  useDeleteTaskMutation,
  useEditTaskMutation,
  useUpdateSubTaskMutation,
} = boardApi;
