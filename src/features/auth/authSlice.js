import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../utils/storage";

const initialState = {
  user: null,
  accessToken: storage.getToken() || null,
  isLoggedIn: !!storage.getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;

      if (user) state.user = user; // Don't overwrite with undefined
      if (accessToken) {
        state.accessToken = accessToken;
        storage.setToken(accessToken); // Save token to storage

      }

      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoggedIn = false;
      storage.removeToken();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
