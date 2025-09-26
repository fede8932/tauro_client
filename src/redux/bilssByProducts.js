import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as billsReq from '../request/billRequest';
const initState = {
  loading: false,
  data: [],
  error: '',
};
export const searchBillsByProductsRequest = createAsyncThunk(
  'BILL_LIST_PROD',
  billsReq.getBillsByProductRequest
);

const billsProductSlice = createSlice({
  name: 'Bills_By_Products',
  initialState: initState,
  reducers: {
    resetBillsProductState: (state) => {
      state.error = '';
      state.loading = false;
      state.data = [];
    },
  },
  extraReducers: {
    [searchBillsByProductsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchBillsByProductsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message | '';
    },
    [searchBillsByProductsRequest.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export const { resetBillsProductState } = billsProductSlice.actions;
export default billsProductSlice.reducer;
