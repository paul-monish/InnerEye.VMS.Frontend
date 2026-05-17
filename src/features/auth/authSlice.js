import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  refreshTokenThunk,
  logoutThunk,
  initAuthThunk,
} from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initializing: true,
  error: null,
  themePreset: "ocean",
  language: "en",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTheme: (state, action) => {
      state.themePreset = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuthThunk.pending, (state) => {
        state.initializing = true;
      })
      .addCase(initAuthThunk.fulfilled, (state, action) => {
        state.initializing = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(initAuthThunk.rejected, (state) => {
        // Refresh failed — user must log in again
        state.initializing = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // --- login ---
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // --- manual refresh ---
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // --- logout ---
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setTheme, setLanguage } = authSlice.actions;
export default authSlice.reducer;
