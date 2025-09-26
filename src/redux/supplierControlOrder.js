import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supplierRequest from '../request/supplierRequest';
const userState = {
  loading: false,
  data: { controlOrders: [], totalRows: 0, totalPages: 0 },
  error: '',
};
export const getControlOrderRequest = createAsyncThunk(
  'CONTROL_ORDER_LIST',
  supplierRequest.getControlOrder
);
export const updateControlOrderRequest = createAsyncThunk(
  'CONTROL_UPDATE',
  supplierRequest.updateControlOrderStatus
);

const supplierControlSlice = createSlice({
  name: 'supplier',
  initialState: userState,
  extraReducers: {
    [getControlOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getControlOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getControlOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [updateControlOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updateControlOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updateControlOrderRequest.fulfilled]: (state, action) => {
      const newData = state.data.controlOrders.map((item) => {
        if (item.id == action.payload) {
          item.status = 'Aceptado';
        }
        return item;
      });
      state.data.controlOrders = newData;
      state.loading = false;
    },
  },
});

export default supplierControlSlice.reducer;
