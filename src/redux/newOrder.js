import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderRequest from '../request/orderRequest';
const userState = {
  loading: false,
  data: {},
  error: '',
};
export const newBuyOrderRequest = createAsyncThunk(
  'ORDER_CREATE',
  orderRequest.createBuyOrder
);
export const getBuyOrderRequest = createAsyncThunk(
  'ORDER_GET',
  orderRequest.getBuyOrder
);
export const getSellOrderLocalRequest = createAsyncThunk(
  'ORDER_GET_LOCAL',
  orderRequest.getSellOrderLocal
);
export const deleteSellOrder = createAsyncThunk(
  'DELETE_ORDER',
  orderRequest.deleteSellOrder
);
export const newSellOrderRequest = createAsyncThunk(
  'SELL_ORDER_CREATE',
  orderRequest.createSellOrderRequest
);

const newBuyOrderSlice = createSlice({
  name: 'newOrder',
  initialState: userState,
  extraReducers: {
    [newBuyOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [newBuyOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [newBuyOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [newSellOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [newSellOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [newSellOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getBuyOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getBuyOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getBuyOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteSellOrder.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteSellOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteSellOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = {};
    },
  },
});

export default newBuyOrderSlice.reducer;
