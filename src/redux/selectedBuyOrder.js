import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderRequest from '../request/orderRequest';
const orderState = {
  loading: false,
  data: {
    supplier: { razonSocial: '' },
    client: { razonSocial: '' },
    orderAjust: { ajustOrderItems: [] },
  },
  error: '',
};
export const getOrderById = createAsyncThunk(
  'GET_ORDER_ID',
  orderRequest.getOrderByIdRequest
);

const buyOrderSlice = createSlice({
  name: 'Order',
  initialState: orderState,
  extraReducers: {
    [getOrderById.pending]: (state, action) => {
      state.loading = true;
    },
    [getOrderById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getOrderById.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export default buyOrderSlice.reducer;
