import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./types";

const getStoredUser = (): User | null => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

const getStoredToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;

      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      localStorage.setItem("accessToken", action.payload.accessToken);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;

      // Remove from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
