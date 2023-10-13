import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/user/userSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
