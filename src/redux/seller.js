import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as sellerRequest from '../request/sellerRequest';
const sellerState = {
  loading: false,
  data: [],
  error: '',
};
export const getSellersRequest = createAsyncThunk(
  'GET_SELLER',
  sellerRequest.getSellers
);
export const createSellersRequest = createAsyncThunk(
  'CREATE_SELLER',
  sellerRequest.createSellers
);
export const getSellerIdRequest = createAsyncThunk(
  'GET_SELLER_ID',
  sellerRequest.getSellerId
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState: sellerState,
  reducers: {
    resetSellerStatus: (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = '';
    },
  },
  extraReducers: {
    [getSellersRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getSellersRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getSellersRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [createSellersRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [createSellersRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [createSellersRequest.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getSellerIdRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getSellerIdRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getSellerIdRequest.fulfilled]: (state, action) => {
      let list = [action.payload];
      state.loading = false;
      state.error = '';
      state.data = list;
    },
  },
});

export const { resetSellerStatus } = sellerSlice.actions;

export default sellerSlice.reducer;
