import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supCurrentAcountRequest from '../request/supMovementRequest';
const initState = {
  loading: false,
  data: {
    totalRows: 0,
    totalPages: 0,
    list: [],
  },
  actualizar: 0,
  error: '',
};

export const newPaymentOrderRequest = createAsyncThunk(
  'NEW_PAYMENT_ORDER',
  supCurrentAcountRequest.createPaymentOrderRequest
);
export const searchOrderRequest = createAsyncThunk(
  'SEARCH_PAYMENT_ORDER',
  supCurrentAcountRequest.searchPaymentOrderRequest
);
export const updatePaymentOrderRequest = createAsyncThunk(
  'UPDATE_PAYMENT_ORDER',
  supCurrentAcountRequest.updatePaymentOrderRequest
);
export const deletePaymentOrderRequest = createAsyncThunk(
  'DELETE_PAYMENT_ORDER',
  supCurrentAcountRequest.deletePaymentOrderRequest
);

const supPaymentOrderSlice = createSlice({
  name: 'supPaymentOrder',
  initialState: initState,
  reducers: {
    resetSupPaymentOrder: (state) => {
      state.loading = false;
      state.data = initState.data;
      state.error = '';
      state.actualizar = 0;
    },
  },
  extraReducers: {
    [newPaymentOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [newPaymentOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [newPaymentOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.actualizar ++;
    },
    [searchOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
    [updatePaymentOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updatePaymentOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updatePaymentOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.actualizar ++;
    },
    [deletePaymentOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deletePaymentOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deletePaymentOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.actualizar ++;
    },
  },
});

export const { resetSupCAReports } = supPaymentOrderSlice.actions;
export default supPaymentOrderSlice.reducer;
