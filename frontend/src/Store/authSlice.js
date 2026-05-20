import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  userId: localStorage.getItem("userId") || null,
  role: localStorage.getItem("role") || null,
  pseudo: localStorage.getItem("pseudo") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, userId, role, pseudo } = action.payload;
      state.token = token;
      state.userId = userId;
      state.role = role;
      state.pseudo = pseudo;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("role", pseudo);
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.role = null;
      state.pseudo = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("pseudo");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
