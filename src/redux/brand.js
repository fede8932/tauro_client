import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as brandRequest from '../request/brandRequest';
const initState = {
  loading: false,
  data: [],
  error: '',
};
export const brandCreateRequest = createAsyncThunk(
  'BRAND_CREATE',
  brandRequest.createBrand
);
export const getBrandRequest = createAsyncThunk(
  'GET_BRAND',
  brandRequest.getBrands
);
export const getBrandByRSRequest = createAsyncThunk(
  'GET_BRAND_RS',
  brandRequest.getBrandsBySupplier
);
export const updateBrandRequest = createAsyncThunk(
  'PUT_BRAND',
  brandRequest.updateBrand
);
export const resetBrandRequest = createAsyncThunk(
  'RESET_BRAND',
  () => initState
);

const brandSlice = createSlice({
  name: 'brand',
  initialState: initState,
  extraReducers: {
    [brandCreateRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [brandCreateRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [brandCreateRequest.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getBrandRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getBrandRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getBrandRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getBrandByRSRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getBrandByRSRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getBrandByRSRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [updateBrandRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updateBrandRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updateBrandRequest.fulfilled]: (state, action) => {
      let newBrands = state.data.map((brand) => {
        if (brand.id == action.payload.id) return action.payload;
        return brand;
      });
      state.loading = false;
      state.data = newBrands;
    },
    [resetBrandRequest.fulfilled]: (state, action) => {
      state.data = action.payload.data;
      state.loading = false;
      state.error = '';
    },
  },
});

export default brandSlice.reducer;
