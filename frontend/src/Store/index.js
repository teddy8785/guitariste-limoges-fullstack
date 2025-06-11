import { configureStore } from "@reduxjs/toolkit";
import likesReducer from "./likesSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    likes: likesReducer,
  },
});

export default store;