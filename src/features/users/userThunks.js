import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";
import { buildQueryParams } from "../../utils/helpers";

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const qs = buildQueryParams(filters);
      const res = await api.get(`${endpoints.users.base}?${qs}`);
      return {
        items: res.data?.responseData || [],
        totalCount: res.data?.totalCount || 0,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load users",
      );
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.users.base, data);
      return res.data?.responseData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(endpoints.users.byId(id), data);
      return res.data?.responseData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

export const deactivateUser = createAsyncThunk(
  "users/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.users.byId(id));
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Deactivation failed",
      );
    }
  },
);
