import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productRequest from '../request/productRequest';
import * as saleRequest from '../request/saleRequest';
const initState = {
  loading: false,
  data: null,
  error: '',
};
export const getProductIdRequest = createAsyncThunk(
  'PRODUCT_GET_ID',
  productRequest.getProductId
);
export const newProdSaleRequest = createAsyncThunk(
  'NEW_SALE_PROD',
  saleRequest.createSale
);
export const deleteProdSaleRequest = createAsyncThunk(
  'DELETE_SALE_PROD',
  saleRequest.deleteSale
);
export const toggleStatusProdSaleRequest = createAsyncThunk(
  'TOGGLE_SALE_PROD',
  saleRequest.toggleStatusSale
);
export const changePrioriProdSaleRequest = createAsyncThunk(
  'CHANGE_PRIORI_SALE_PROD',
  saleRequest.changePriori
);

const selectProductSlice = createSlice({
  name: 'selectProduct',
  initialState: initState,
  reducers: {
    resetSelectProduct: (state) => {
      state.loading = false;
      state.data = null;
      state.error = '';
    },
  },
  extraReducers: {
    [getProductIdRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getProductIdRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getProductIdRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [newProdSaleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [newProdSaleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [newProdSaleRequest.fulfilled]: (state, action) => {
      let newSelect = { ...state.data };
      newSelect?.sales?.push(action.payload);
      state.data = newSelect;
      state.loading = false;
      state.error = '';
    },
    [deleteProdSaleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteProdSaleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteProdSaleRequest.fulfilled]: (state, action) => {
      let newSelect = { ...state.data };
      const listSales = newSelect?.sales?.filter(
        (s) => s.id != action.payload
      );
      newSelect.sales = listSales;
      state.data = newSelect;
      state.loading = false;
      state.error = '';
    },
    [toggleStatusProdSaleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [toggleStatusProdSaleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [toggleStatusProdSaleRequest.fulfilled]: (state, action) => {
      let newSelect = { ...state.data };
      const listSales = newSelect?.sales?.map((s) => {
        if (s.id == action.payload) {
          s.status = !s.status;
        }
        return s;
      });
      newSelect.sales = listSales;
      state.data = newSelect;
      state.loading = false;
      state.error = '';
    },
    [changePrioriProdSaleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [changePrioriProdSaleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [changePrioriProdSaleRequest.fulfilled]: (state, action) => {
      // console.log(action.payload)
      let newSelect = { ...state.data };
      newSelect.sales = action.payload;
      state.data = newSelect;
      state.loading = false;
      state.error = '';
    },
  },
});

export const { resetSelectProduct } = selectProductSlice.actions;

export default selectProductSlice.reducer;
