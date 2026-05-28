import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderRequest from '../request/orderRequest';

const initialState = {
  loading: false,
  data: { list: [], totalPages: 1, totalRows: 0 },
  error: '',
};

export const searchPresupuestoRequest = createAsyncThunk(
  'SEARCH_PRESUPUESTO',
  orderRequest.searchPresupuestoRequest
);

const searchPresupuestoSlice = createSlice({
  name: 'searchPresupuesto',
  initialState,
  reducers: {
    resetSearchPresupuesto: (state) => {
      state.loading = false;
      state.error = '';
      state.data = initialState.data;
    },
  },
  extraReducers: {
    [searchPresupuestoRequest.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [searchPresupuestoRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchPresupuestoRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
  },
});

export const { resetSearchPresupuesto } = searchPresupuestoSlice.actions;
export default searchPresupuestoSlice.reducer;
