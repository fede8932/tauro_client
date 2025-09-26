import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productRequest from '../request/productRequest';
const initState = {
  loading: false,
  data: { list: [], totalRows: 0, totalPages: 0 },
  error: '',
};
export const productCreateRequest = createAsyncThunk(
  'PRODUCT_CREATE',
  productRequest.createProduct
);
export const productsFileCreateRequest = createAsyncThunk(
  'PRODUCTS_FILE_CREATE',
  productRequest.addProductsFile
);

export const searchProductRequest = createAsyncThunk(
  'SEARCH_PRODUCT',
  productRequest.searchProduct
);

export const searchProductsRequest = createAsyncThunk(
  'SEARCH_PRODUCTS',
  productRequest.searchProducts
);

export const searchProductsExtraRequest = createAsyncThunk(
  'SEARCH_EXTRA_PRODUCTS',
  productRequest.searchExtraProducts
);

export const deleteProductRequest = createAsyncThunk(
  'DELETE_PRODUCT',
  productRequest.deleteProduct
);

export const updateProductRequest = createAsyncThunk(
  'UPDATE_PRODUCT',
  productRequest.updateProduct
);

const productSlice = createSlice({
  name: 'product',
  initialState: initState,
  reducers: {
    resetProductSearch: (state, action) => {
      state.error = '';
      state.loading = false;
      state.data = initState.data;
    },
  },
  extraReducers: {
    [productCreateRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [productCreateRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [productCreateRequest.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [updateProductRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updateProductRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updateProductRequest.fulfilled]: (state, action) => {
      state.loading = false;
      const newList = state.data.list.map((prod) => {
        if (prod.id == action.payload.id) {
          prod.location = action.payload.location;
          prod.article = action.payload.article;
          prod.description = action.payload.description;
        }
        return prod;
      });
      state.data.list = newList;
    },
    [productsFileCreateRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [productsFileCreateRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [productsFileCreateRequest.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [searchProductRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchProductRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchProductRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [searchProductsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchProductsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchProductsRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [searchProductsExtraRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchProductsExtraRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchProductsExtraRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [deleteProductRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteProductRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteProductRequest.fulfilled]: (state, action) => {
      const newList = state.data.list.filter(
        (prod) => prod.id != action.payload
      );
      state.loading = false;
      state.data.list = newList;
    },
  },
});

export const { resetProductSearch } = productSlice.actions;

export default productSlice.reducer;
