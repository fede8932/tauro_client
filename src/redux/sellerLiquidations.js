import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as sellerRequest from '../request/sellerRequest';
const sellerState = {
  loading: false,
  data: { list: [], totalPages: 0, totalResults: 0 },
  error: '',
};
export const newLiquidation = createAsyncThunk(
  'NEW_LIQUIDATION',
  sellerRequest.createLiquidationRequest
);
export const getLiquidation = createAsyncThunk(
  'GET_LIQUIDATION',
  sellerRequest.getSellerLiquidation
);

const sellerLiquidationsSlice = createSlice({
  name: 'sellerLiquidations',
  initialState: sellerState,
  reducers: {},
  extraReducers: {
    [newLiquidation.pending]: (state, action) => {
      state.loading = true;
    },
    [newLiquidation.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [newLiquidation.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
    },
    [getLiquidation.pending]: (state, action) => {
      state.loading = true;
    },
    [getLiquidation.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getLiquidation.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
  },
});

export default sellerLiquidationsSlice.reducer;
