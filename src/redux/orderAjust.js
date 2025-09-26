import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderAjustRequest from '../request/orderAjustRequest';
const initState = {
  loading: false,
  data: {},
  error: '',
};
export const addOrderAjust = createAsyncThunk(
  'ADD_AJUST',
  orderAjustRequest.addOrderAjust
);
export const getAjustOrder = createAsyncThunk(
  'GET_ORDER',
  orderAjustRequest.getAjustOrder
);
export const getOrderAjust = createAsyncThunk(
  'GET_AJUST',
  orderAjustRequest.getOrderAjust
);

const orderAjustSlice = createSlice({
  name: 'orderAjust',
  initialState: initState,
  extraReducers: {
    [addOrderAjust.pending]: (state, action) => {
      state.loading = true;
    },
    [addOrderAjust.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addOrderAjust.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getOrderAjust.pending]: (state, action) => {
      state.loading = true;
    },
    [getOrderAjust.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getOrderAjust.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAjustOrder.pending]: (state, action) => {
      state.loading = true;
    },
    [getAjustOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getAjustOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export default orderAjustSlice.reducer;
