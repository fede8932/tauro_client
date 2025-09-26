import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supplierRequest from '../request/supplierRequest';
const userState = {
  loading: false,
  data: {
    numRemito: null,
    createdAt: null,
    purchaseOrder: {
      orderAjust: { ajustOrderItems: [] },
      purchaseOrderItems: [],
    },
  },
  error: '',
};
export const selectControlOrderRequest = createAsyncThunk(
  'SELECT_CONTROL_ORDER',
  supplierRequest.selectControlOrder
);

const selectControlSlice = createSlice({
  name: 'selectControl',
  initialState: userState,
  extraReducers: {
    [selectControlOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [selectControlOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [selectControlOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export default selectControlSlice.reducer;
