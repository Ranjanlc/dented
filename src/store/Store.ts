import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./slices/AuthSlice";
import TokenReducer from "./slices/TokenSlice";

const rootReducer = combineReducers({
  auth: AuthReducer,
  token: TokenReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type IRootState = ReturnType<typeof rootReducer>;
