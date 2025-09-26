import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as billRequest from '../request/billRequest';
const orderState = {
  loading: false,
  data: {},
  error: '',
};
export const getBillById = createAsyncThunk(
  'GET_BILL_ID',
  billRequest.getBillByIdRequest
);

const selectBillSlice = createSlice({
  name: 'Bill',
  initialState: orderState,
  reducers: {
    resetSelectBill: (state) => {
      state.loading = false;
      state.data = {};
      state.error = '';
    },
  },
  extraReducers: {
    [getBillById.pending]: (state, action) => {
      state.loading = true;
    },
    [getBillById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getBillById.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
  },
});

export const { resetSelectBill } = selectBillSlice.actions;

export default selectBillSlice.reducer;
