import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as brandRequest from '../request/brandRequest';
const userState = {
  loading: false,
  data: [],
  error: '',
};
export const addBrandToTable = createAsyncThunk(
  'BRAND_TABLE_LIST',
  brandRequest.addBrandToTable
);
export const delBrandToTable = createAsyncThunk(
  'DEL_ITEM_BRAND_TABLE_LIST',
  brandRequest.delBrandToTable
);

export const resetBrandToTable = createAsyncThunk(
  'RESET_BRAND_TABLE',
  brandRequest.resetBrandToTable
);
export const getBrandToTable = createAsyncThunk(
  'GET_BRAND_TABLE_LIST',
  brandRequest.getAllBrandToTable
);

const tableSlice = createSlice({
  name: 'tableItems',
  initialState: userState,
  extraReducers: {
    [addBrandToTable.pending]: (state, action) => {
      state.loading = true;
    },
    [addBrandToTable.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addBrandToTable.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [delBrandToTable.pending]: (state, action) => {
      state.loading = true;
    },
    [delBrandToTable.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [delBrandToTable.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [resetBrandToTable.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getBrandToTable.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getBrandToTable.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getBrandToTable.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export default tableSlice.reducer;
