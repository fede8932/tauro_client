import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cotizacionRequest from '../request/cotizacionRequest';

const initialState = {
  loading: false,
  data: { list: [], totalPages: 1, totalRows: 0 },
  error: '',
};

export const searchCotizacionRequest = createAsyncThunk(
  'SEARCH_COTIZACION',
  cotizacionRequest.searchCotizacionRequest
);

const searchCotizacionSlice = createSlice({
  name: 'searchCotizacion',
  initialState,
  reducers: {
    resetSearchCotizacion: (state) => {
      state.loading = false;
      state.error = '';
      state.data = initialState.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCotizacionRequest.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(searchCotizacionRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchCotizacionRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.data = action.payload;
      });
  },
});

export const { resetSearchCotizacion } = searchCotizacionSlice.actions;
export default searchCotizacionSlice.reducer;
