import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supplierRequest from '../request/supplierRequest';
const userState = {
  loading: false,
  data: [],
  error: '',
  selectSupplier: null,
};
export const supplierCreateRequest = createAsyncThunk(
  'SUPPLIER_CREATE',
  supplierRequest.suplierRegister
);
export const getSupplierRequest = createAsyncThunk(
  'SUPPLIER_LIST',
  supplierRequest.getSuppliers
);
export const getSuppliersInfoRequest = createAsyncThunk(
  'SUPPLIER_INFO_LIST',
  supplierRequest.getSuppliersInfo
);
export const addRepresentativeRequest = createAsyncThunk(
  'ADD_REP',
  supplierRequest.addRepresentativeRequest
);
export const getSupplierInfoRequest = createAsyncThunk(
  'GET_SUPPLIER_INFO_2',
  supplierRequest.getInfoSuppliers
);

const supplierSlice = createSlice({
  name: 'supplier',
  initialState: userState,
  extraReducers: {
    [getSupplierInfoRequest.rejected]: (state, action) => {
      console.log(action);
      state.error = action.error.message;
    },
    [getSupplierInfoRequest.fulfilled]: (state, action) => {
      state.selectSupplier = action.payload;
    },
    [supplierCreateRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [supplierCreateRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [supplierCreateRequest.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getSupplierRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getSupplierRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getSuppliersInfoRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getSuppliersInfoRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getSuppliersInfoRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [addRepresentativeRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [addRepresentativeRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addRepresentativeRequest.fulfilled]: (state, action) => {
      state.loading = false;
    },
  },
});

export default supplierSlice.reducer;
