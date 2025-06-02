import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
  singleUser: null, // Add singleUser to the initial state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.token = payload.token;
      state.user = payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.singleUser = null; // Clear singleUser on logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setSingleUser: (state, { payload }) => {
      state.singleUser = payload; // Update singleUser in the state
    },
  },
});

export const { setCredentials, logout, setSingleUser } = authSlice.actions;
export default authSlice.reducer;
