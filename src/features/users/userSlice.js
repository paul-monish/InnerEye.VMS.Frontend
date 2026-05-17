import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUsers,
  createUser,
  updateUser,
  deactivateUser,
} from "./userThunks";

const initialState = {
  list: [],
  totalCount: 0,
  loading: false,
  formLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.items;
        s.totalCount = a.payload.totalCount;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(createUser.pending, (s) => {
        s.formLoading = true;
      })
      .addCase(createUser.fulfilled, (s) => {
        s.formLoading = false;
      })
      .addCase(createUser.rejected, (s, a) => {
        s.formLoading = false;
        s.error = a.payload;
      })
      .addCase(updateUser.fulfilled, (s) => {
        s.formLoading = false;
      })
      .addCase(deactivateUser.fulfilled, (s, a) => {
        s.list = s.list.filter((u) => u.id !== a.meta.arg);
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
