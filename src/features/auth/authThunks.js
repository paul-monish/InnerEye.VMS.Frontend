import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAccessToken, clearAccessToken } from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";

export const initAuthThunk = createAsyncThunk(
  "auth/init",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.auth.refresh);
      const data = res.data?.responseData;
      setAccessToken(data.accessToken);
      return { user: data.user };
    } catch {
      clearAccessToken();
      return rejectWithValue("Session expired");
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.auth.login, credentials);
      const data = res.data?.responseData;
      setAccessToken(data.accessToken);
      return { user: data.user };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.auth.refresh);
      const data = res.data?.responseData;
      setAccessToken(data.accessToken);
      return { user: data.user };
    } catch (err) {
      clearAccessToken();
      return rejectWithValue("Session expired");
    }
  },
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post(endpoints.auth.revoke);
  } catch {}
  clearAccessToken();
});

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.auth.forgotPassword, { email });
      return res.data?.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
  },
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.auth.resetPassword, payload);
      return res.data?.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  },
);
