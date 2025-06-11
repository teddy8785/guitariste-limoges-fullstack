import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  userId: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, userId, role } = action.payload;
      state.token = token;
      state.userId = userId;
      state.role = role;
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;