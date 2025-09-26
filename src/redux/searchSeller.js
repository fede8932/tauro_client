import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import * as sellerRequest from '../request/sellerRequest';
import * as userRequest from '../request/userRequest';

const sellerState = {
  loading: false,
  data: { sellers: [] },
  error: '',
};
export const getSellersByTextRequest = createAsyncThunk(
  'GET_SELLERS',
  sellerRequest.getSellersByText
);
export const UpdateSellersRequest = createAsyncThunk(
  'UPDATE_SELLER',
  sellerRequest.updateSellerById
);
export const UpdateStatusSellerRequest = createAsyncThunk(
  'UPDATE_STATUS_SELLER',
  userRequest.updateUserStatusRequest
);
export const ResetStatusSellerRequest = createAsyncThunk(
  'RESET_STATUS_SELLER',
  () => sellerState
);

const sellersSlice = createSlice({
  name: 'sellerS',
  initialState: sellerState,
  extraReducers: {
    [getSellersByTextRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getSellersByTextRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getSellersByTextRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [UpdateSellersRequest.pending]: (state, action) => {
      state.loading = false;
    },
    [UpdateSellersRequest.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [UpdateSellersRequest.fulfilled]: (state, action) => {
      const actState = { ...current(state).data };
      const newSellers = actState.sellers.map((seller) => {
        if (seller.id === action.payload.id) {
          const newSeller = action.payload;
          return newSeller;
        }
        return seller;
      });
      const newStateData = actState;
      newStateData.sellers = newSellers;
      console.log(newStateData);
      state.loading = false;
      state.data = newStateData;
    },
    [UpdateStatusSellerRequest.pending]: (state, action) => {
      state.loading = false;
    },
    [UpdateStatusSellerRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [UpdateStatusSellerRequest.fulfilled]: (state, action) => {
      const newSellers = state.data.sellers.map((seller) => {
        if (seller.user.id === action.payload.id) {
          seller.user = action.payload;
        }
        return seller;
      });
      const newStateData = state.data;
      newStateData.sellers = newSellers;
      state.loading = false;
      state.data = newStateData;
    },
    [ResetStatusSellerRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [ResetStatusSellerRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [ResetStatusSellerRequest.fulfilled]: (state, action) => {
      state.loading = action.payload.loading;
      state.data = action.payload.data;
      state.error = action.payload.error;
    },
  },
});

export default sellersSlice.reducer;
