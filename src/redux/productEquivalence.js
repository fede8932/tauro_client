import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productRequest from '../request/productRequest';

const initState = {
  loading: false,
  data: { 
    list: [], 
    standaloneProducts: [], 
    totalRows: 0, 
    totalPages: 0 
  },
  error: '',
};

export const searchProductsAndEquivalencesRequest = createAsyncThunk(
  'SEARCH_PRODUCTS_AND_EQUIVALENCES',
  productRequest.searchProductsAndEquivalences
);

const productEquivalenceSlice = createSlice({
  name: 'productEquivalence',
  initialState: initState,
  reducers: {
    resetProductEquivalenceSearch: (state, action) => {
      state.error = '';
      state.loading = false;
      state.data = initState.data;
    },
  },
  extraReducers: {
    [searchProductsAndEquivalencesRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchProductsAndEquivalencesRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchProductsAndEquivalencesRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export const { resetProductEquivalenceSearch } = productEquivalenceSlice.actions;

export default productEquivalenceSlice.reducer;
