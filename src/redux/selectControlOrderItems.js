import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supplierRequest from '../request/supplierRequest';
const userState = {
  loading: false,
  data: { controlOrder: { purchaseOrder: {} }, items: [], pages: 1 },
  error: '',
};
export const selectControlOrderItemsRequest = createAsyncThunk(
  'SELECT_CONTROL_ORDER_ITEMS',
  supplierRequest.selectControlOrderItems
);
export const updateItemsRequest = createAsyncThunk(
  'UPDATE_CONTROL_ORDER_ITEMS',
  supplierRequest.updateItems
);

const selectControlItemsSlice = createSlice({
  name: 'selectControlItems',
  initialState: userState,
  reducers: {
    resetControlItems: (state) => {
      state.loading = false;
      state.data = { controlOrder: { purchaseOrder: {} }, items: [], pages: 1 };
      state.error = '';
    },
    updteControlItem: (state, {payload}) => {
      payload.amount = Number(payload.amount);
      let newItems = state.data.items.map((item) => {
        if (item.id === payload.id) {
          item.amount = payload.amount;
          item.edit = true;
        }
        return item;
      });
      state.data.items = newItems;
    },
  },
  extraReducers: {
    [selectControlOrderItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [selectControlOrderItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [selectControlOrderItemsRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [updateItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updateItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updateItemsRequest.fulfilled]: (state, action) => {
      let newItems = state.data.items.map((item) => {
        if (item.id === action.payload.id) {
          item.amount = action.payload.amount;
          item.edit = true;
        }
        return item;
      });
      state.data.items = newItems;
      state.loading = false;
    },
  },
});

export const { resetControlItems, updteControlItem } = selectControlItemsSlice.actions;
export default selectControlItemsSlice.reducer;
