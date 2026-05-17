import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";
import { buildQueryParams } from "../../utils/helpers";

export const fetchVendors = createAsyncThunk(
  "vendors/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const qs = buildQueryParams(filters);
      const res = await api.get(`${endpoints.vendors.base}?${qs}`);
      return {
        items: res.data?.responseData || [],
        totalCount: res.data?.totalCount || 0,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load vendors",
      );
    }
  },
);

export const fetchVendorById = createAsyncThunk(
  "vendors/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(endpoints.vendors.byId(id));
      return res.data?.responseData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Vendor not found");
    }
  },
);

export const registerVendor = createAsyncThunk(
  "vendors/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.vendors.register, data);
      return res.data?.responseData;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const uploadDocument = createAsyncThunk(
  "vendors/uploadDoc",
  async ({ vendorId, file, documentType }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(
        `${endpoints.vendors.documents(vendorId)}?documentType=${documentType}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  },
);

export const approveVendor = createAsyncThunk(
  "vendors/approve",
  async ({ vendorId, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.vendors.approve(vendorId), data);
      return res.data?.responseData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Approval failed");
    }
  },
);

export const activateVendor = createAsyncThunk(
  "vendors/activate",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await api.post(endpoints.vendors.activate(vendorId));
      return res.data?.responseData;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Activation failed",
      );
    }
  },
);
