import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as brandRequest from '../request/brandRequest';
import * as saleRequest from '../request/saleRequest';
const initState = {
  loading: false,
  data: { list: [], totaltotalPages: 1, totalRows: 0 },
  selectBrand: null,
  error: '',
};
export const searchBrandsExtraRequest = createAsyncThunk(
  'SEARCH_EXTRA_BRANDS',
  brandRequest.searchBrandsExtra
);
export const toggleEcommerceBrandRequest = createAsyncThunk(
  'TOGGLE_ECOMMERCE_BRAND',
  brandRequest.toggleEcommerce
);
export const getBrandByIdRequest = createAsyncThunk(
  'GET_SELECT_BRAND',
  brandRequest.getBrandById
);
export const newSaleRequest = createAsyncThunk(
  'NEW_SALE_BRAND',
  saleRequest.createSale
);
export const deleteSaleRequest = createAsyncThunk(
  'DELETE_SALE_BRAND',
  saleRequest.deleteSale
);
export const toggleStatusSaleRequest = createAsyncThunk(
  'TOGGLE_SALE_BRAND',
  saleRequest.toggleStatusSale
);
export const changePrioriSaleRequest = createAsyncThunk(
  'CHANGE_PRIORI_SALE_BRAND',
  saleRequest.changePriori
);

const searchBrandSlice = createSlice({
  name: 'searchBrand',
  initialState: initState,
  reducers: {
    resetExtraBrands: (state) => {
      state.loading = false;
      state.error = '';
      state.data = { list: [], totaltotalPages: 1, totalRows: 0 };
      state.selectBrand = null;
    },
    resetSelectBrand: (state) => {
      state.selectBrand = null;
    },
  },
  extraReducers: {
    [searchBrandsExtraRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchBrandsExtraRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchBrandsExtraRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = '';
    },
    [toggleEcommerceBrandRequest.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [toggleEcommerceBrandRequest.fulfilled]: (state, action) => {
      const newList = state.data?.list?.map((item) => {
        if (item.id == action.payload) {
          item.ecommerce = !item.ecommerce;
        }
        return item;
      });
      state.error = '';
      state.data.list = newList;
    },
    [getBrandByIdRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getBrandByIdRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getBrandByIdRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.selectBrand = action.payload;
      state.error = '';
    },
    [newSaleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [newSaleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [newSaleRequest.fulfilled]: (state, action) => {
      let newSelectBrand = { ...state.selectBrand };
      newSelectBrand?.sales?.push(action.payload);
      state.selectBrand = newSelectBrand;
      state.loading = false;
      state.error = '';
    },
    [deleteSaleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteSaleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteSaleRequest.fulfilled]: (state, action) => {
      let newSelectBrand = { ...state.selectBrand };
      const listSales = newSelectBrand?.sales?.filter(
        (s) => s.id != action.payload
      );
      newSelectBrand.sales = listSales;
      state.selectBrand = newSelectBrand;
      state.loading = false;
      state.error = '';
    },
    [toggleStatusSaleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [toggleStatusSaleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [toggleStatusSaleRequest.fulfilled]: (state, action) => {
      let newSelectBrand = { ...state.selectBrand };
      const listSales = newSelectBrand?.sales?.map((s) => {
        if (s.id == action.payload) {
          s.status = !s.status;
        }
        return s;
      });
      newSelectBrand.sales = listSales;
      state.selectBrand = newSelectBrand;
      state.loading = false;
      state.error = '';
    },
    [changePrioriSaleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [changePrioriSaleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [changePrioriSaleRequest.fulfilled]: (state, action) => {
      // console.log(action.payload)
      let newSelectBrand = { ...state.selectBrand };
      newSelectBrand.sales = action.payload;
      state.selectBrand = newSelectBrand;
      state.loading = false;
      state.error = '';
    },
  },
});

export const { resetExtraBrands, resetSelectBrand } = searchBrandSlice.actions;

export default searchBrandSlice.reducer;
