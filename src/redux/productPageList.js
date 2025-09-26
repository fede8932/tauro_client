import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productRequest from '../request/productRequest';
const initState = {
  loading: false,
  data: { products: [], pages: 0 },
  error: '',
};

export const searchProductPageRequest = createAsyncThunk(
  'SEARCH_PRODUCT_PAGE',
  productRequest.searchProductPage
);

const productPageSlice = createSlice({
  name: 'productPages',
  initialState: initState,
  extraReducers: {
    [searchProductPageRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchProductPageRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchProductPageRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export default productPageSlice.reducer;
