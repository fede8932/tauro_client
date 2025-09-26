import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as ajustOrderRequest from '../request/orderAjustRequest';
const userState = {
  loading: false,
  data: [],
  error: '',
};
// export const getOrderItemsRequest = createAsyncThunk(
//   "GET_ITEMS_BY_ORDER",
//   buyOrderRequest.getOrderItems
// );
export const addAjustItemsRequest = createAsyncThunk(
  'ADD_AJUST_ITEM',
  ajustOrderRequest.addOrderAjustItem
);
export const deleteAjustItemsRequest = createAsyncThunk(
  'DELETE_AJUST_ITEM',
  ajustOrderRequest.deleteAjustItem
);
export const updateCantAjustItemsRequest = createAsyncThunk(
  'UPDATE_CANT_AJUST_ITEM',
  ajustOrderRequest.updateCantAjustItem
);
export const updatePriceAjustItemsRequest = createAsyncThunk(
  'UPDATE_PREC_AJUST_ITEM',
  ajustOrderRequest.updatePriceAjustItem
);

const ajustOrderItem = createSlice({
  name: 'ajustOrderItem',
  initialState: userState,
  extraReducers: {
    // [getOrderItemsRequest.pending]: (state, action) => {
    //   state.loading = true;
    // },
    // [getOrderItemsRequest.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // },
    // [getOrderItemsRequest.fulfilled]: (state, action) => {
    //   state.loading = false;
    //   state.data = action.payload;
    // },
    [addAjustItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [addAjustItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addAjustItemsRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteAjustItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteAjustItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteAjustItemsRequest.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [updateCantAjustItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updateCantAjustItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updateCantAjustItemsRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((item) => {
        if (item.id === action.payload.id) {
          item.amount = action.payload.amount;
        }
        return item;
      });
      state.loading = false;
      state.data = newState;
    },
    [updatePriceAjustItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updatePriceAjustItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updatePriceAjustItemsRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((item) => {
        if (item.id === action.payload.id) {
          item.buyPrice = action.payload.buyPrice;
        }
        return item;
      });
      state.loading = false;
      state.data = newState;
    },
  },
});

export default ajustOrderItem.reducer;
