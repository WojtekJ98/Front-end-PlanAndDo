import { configureStore } from "@reduxjs/toolkit";
import boardReducer, { boardApi } from "./slices/boardSlice";

const store = configureStore({
  reducer: {
    boards: boardReducer,
    [boardApi.reducerPath]: boardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(boardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
