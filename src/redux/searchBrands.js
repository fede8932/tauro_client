import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as brandRequest from '../request/brandRequest';
const initState = {
  loading: false,
  data: [],
  error: '',
};
export const getBrandByDataRequest = createAsyncThunk(
  'GET_BRAND_DATA',
  brandRequest.getBrandsByData
);
export const addSupplierToBrandRequest = createAsyncThunk(
  'ADD_SUPPLIER_TO_BRAND',
  brandRequest.addSupplierToBrand
);
export const deleteSupplierToBrandRequest = createAsyncThunk(
  'DEL_SUPPLIER_TO_BRAND',
  brandRequest.deleteSupplierToBrand
);

const searchBrandSlice = createSlice({
  name: 'searchBrand',
  initialState: initState,
  extraReducers: {
    [getBrandByDataRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getBrandByDataRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getBrandByDataRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [addSupplierToBrandRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [addSupplierToBrandRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addSupplierToBrandRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((brand) => {
        if (brand.id === action.payload.id) {
          return action.payload;
        } else {
          return brand;
        }
      });
      state.data = newState;
      state.loading = false;
    },
    [deleteSupplierToBrandRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteSupplierToBrandRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteSupplierToBrandRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((brand) => {
        if (brand.id === action.payload.id) {
          return action.payload;
        } else {
          return brand;
        }
      });
      state.data = newState;
      state.loading = false;
    },
  },
});

export default searchBrandSlice.reducer;
