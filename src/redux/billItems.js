import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as billRequest from '../request/billRequest';
const initState = {
  loading: false,
  data: null,
  error: '',
};
export const getBillItems = createAsyncThunk(
  'BILL_ITEMS',
  billRequest.getBillItemsRequest
);

const billItemsSlice = createSlice({
  name: 'billItems',
  initialState: initState,
  reducers: {
    changeAmountBillItem: (state, { payload }) => {
      const { itemId, amount } = payload;
      let res = { ...state.data };
      res.fItems.map((i) => {
        if (i.id == itemId) {
          i.amount = Number(amount);
        }
      });
      state.data = res;
    },
    marcBillItem: (state, { payload }) => {
      //payload es el id
      let res = { ...state.data };
      res.fItems.map((i) => {
        if (i.id == payload) {
          i.marc = !i.marc;
          i.max = i.amount;
        }
      });
      state.data = res;
    },
    resetBillItems: (state) => {
      state.data = null;
      state.error = '';
      state.loading = false;
    },
  },
  extraReducers: {
    [getBillItems.pending]: (state, action) => {
      state.loading = true;
    },
    [getBillItems.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.data = null;
    },
    [getBillItems.fulfilled]: (state, action) => {
      let res = { ...action.payload };
      res.fItems.map((i) => (i.marc = false));
      state.loading = false;
      state.data = res;
    },
  },
});

export const { marcBillItem, resetBillItems, changeAmountBillItem } =
  billItemsSlice.actions;

export default billItemsSlice.reducer;
