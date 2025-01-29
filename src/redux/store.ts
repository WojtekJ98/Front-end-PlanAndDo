import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardSlice";

const store = configureStore({
  reducer: {
    boards: boardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
