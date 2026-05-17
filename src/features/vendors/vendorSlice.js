import { createSlice } from "@reduxjs/toolkit";
import {
  fetchVendors,
  fetchVendorById,
  registerVendor,
  approveVendor,
  activateVendor,
  uploadDocument,
} from "./vendorThunks";

const initialState = {
  list: [],
  selected: null,
  totalCount: 0,
  loading: false,
  formLoading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchVendors.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchVendors.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.items;
        s.totalCount = a.payload.totalCount;
      })
      .addCase(fetchVendors.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchVendorById.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchVendorById.fulfilled, (s, a) => {
        s.loading = false;
        s.selected = a.payload;
      })
      .addCase(fetchVendorById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(registerVendor.pending, (s) => {
        s.formLoading = true;
      })
      .addCase(registerVendor.fulfilled, (s) => {
        s.formLoading = false;
      })
      .addCase(registerVendor.rejected, (s, a) => {
        s.formLoading = false;
        s.error = a.payload;
      })
      .addCase(approveVendor.fulfilled, (s, a) => {
        s.selected = a.payload;
      })
      .addCase(activateVendor.fulfilled, (s, a) => {
        s.selected = a.payload;
      })
      .addCase(uploadDocument.fulfilled, (s) => {
        s.formLoading = false;
      })
      .addCase(uploadDocument.pending, (s) => {
        s.formLoading = true;
      })
      .addCase(uploadDocument.rejected, (s, a) => {
        s.formLoading = false;
        s.error = a.payload;
      });
  },
});

export const { clearSelected, clearError } = vendorSlice.actions;
export default vendorSlice.reducer;
