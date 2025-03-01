import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, BoardState, Column, Task } from "../../types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const initialState: BoardState = {
  boards: [],
  activeBoard: null,
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
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
      query: () => ({
        url: "/api/boards",
        method: "GET",
      }),
      providesTags: ["Boards"],
    }),
    getBoard: builder.query<Board, string>({
      query: (id) => `/api/boards/${id}`,
      providesTags: (_, __, id) => [{ type: "Boards", id }],
    }),
    addBoard: builder.mutation<Board, Partial<Board>>({
      query: (newBoard) => ({
        url: "/api/boards",
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
        url: `/api/boards/${id}`,
        method: "PUT",
        body: updateBoard,
      }),
      invalidatesTags: ["Boards"],
    }),
    deleteBoard: builder.mutation<Board, { id: string }>({
      query: ({ id }) => ({
        url: `/api/boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boards"],
    }),
    getColumns: builder.query<Column[], string>({
      query: (boardId) => `/api/boards/${boardId}/columns`,
      providesTags: ["Columns"],
    }),
    deleteColumn: builder.mutation<
      Column,
      { boardId: string; columnId: string }
    >({
      query: ({ boardId, columnId }) => ({
        url: `/api/boards/${boardId}/columns/${columnId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Columns", "Boards"],
    }),
    editColumnTitle: builder.mutation<
      Column,
      { boardId: string; columnId: string; editedTitle: string }
    >({
      query: ({ boardId, columnId, editedTitle }) => ({
        url: `/api/boards/${boardId}/columns/${columnId}`,
        method: "PATCH",
        body: { title: editedTitle },
      }),
      invalidatesTags: ["Columns", "Boards"],
    }),
    addTask: builder.mutation<
      Task,
      { boardId: string; columnId: string; newTask: Task }
    >({
      query: ({ boardId, columnId, newTask }) => ({
        url: `/api/boards/${boardId}/columns/${columnId}/tasks`,
        method: "POST",
        body: { newTask },
      }),
      invalidatesTags: ["Columns", "Tasks"],
    }),
    getColTask: builder.query<Task[], { boardId: string; columnId: string }>({
      query: ({ boardId, columnId }) =>
        `/api/boards/${boardId}/columns/${columnId}/tasks`,
      providesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<
      Task,
      { boardId: string; columnId: string; taskId: string }
    >({
      query: ({ boardId, columnId, taskId }) => ({
        url: `/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
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
        url: `/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
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
        url: `/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}/subTasks/${subTaskId}`,
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
