import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supplierRequest from '../request/supplierRequest';
const userState = {
  loading: false,
  data: {},
  error: '',
};
export const getInfoSupplierRequest = createAsyncThunk(
  'SUPPLIER_INFO',
  supplierRequest.getInfoSuppliers
);
export const resetInfoSupplierRequest = createAsyncThunk(
  'RESET_SUPPLIER_INFO',
  () => userState
);

const supplierInfoSlice = createSlice({
  name: 'supplierInfo',
  initialState: userState,
  extraReducers: {
    [getInfoSupplierRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getInfoSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getInfoSupplierRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [resetInfoSupplierRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [resetInfoSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [resetInfoSupplierRequest.fulfilled]: (state, action) => {
      state.loading = action.payload.loading;
      state.data = action.payload.data;
      state.error = action.payload.error;
    },
  },
});

export default supplierInfoSlice.reducer;
