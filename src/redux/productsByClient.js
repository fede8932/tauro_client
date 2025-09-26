import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderRequest from '../request/orderRequest';
const initState = {
  loading: false,
  data: [],
  error: '',
};
export const productClientRequest = createAsyncThunk(
  'PRODUCT_CLIENT_LIST',
  orderRequest.getListProductsClient
);
export const marcToggleProdcutClientRequest = createAsyncThunk(
  'MARC_TOGGLE_PRODCLI',
  (prodId) => prodId
);
//Esta no modifica en db, solo es en el estado y se usa solo para nc
export const changeCantForProdCliNCRequest = createAsyncThunk(
  'CHANGE_CANT_NC_PRODCLI',
  (data) => {
    return data;
  }
);
export const resetProductClientRequest = createAsyncThunk(
  'RESET_CLIENT_PRODUCT',
  () => initState
);

const productClientSlice = createSlice({
  name: 'productClient',
  initialState: initState,
  extraReducers: {
    [changeCantForProdCliNCRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((item) => {
        if (item.productId == action.payload.id) {
          if (action.payload.change == 'up') {
            item.amount += 1;
          } else {
            item.amount -= 1;
          }
        }
        return item;
      });
      state.data = newState;
    },
    [marcToggleProdcutClientRequest.fulfilled]: (state, action) => {
      const newStateData = state.data.map((item) => {
        if (item.productId == action.payload) {
          item.marc = !item.marc;
        }
        return item;
      });
      state.data = newStateData;
    },
    [productClientRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [productClientRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [productClientRequest.fulfilled]: (state, action) => {
      const prodList = action.payload.map((item) => {
        item.marc = false;
        item.amount = 0;
        return item;
      });
      state.loading = false;
      state.data = prodList;
    },
    [resetProductClientRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload.data;
    },
  },
});

export default productClientSlice.reducer;
