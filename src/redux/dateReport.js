import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderRequest from '../request/orderRequest';
const initState = {
  loading: false,
  data: null,
  error: '',
};
export const getDateReportRequest = createAsyncThunk(
  'GET_DATE_REPORT',
  orderRequest.getDateReport
);
export const genOrderReportRequest = createAsyncThunk(
  'GEN_ORDER_BY_REPORT',
  orderRequest.genOrderReport
);

const dateReportSlice = createSlice({
  name: 'dateReport',
  initialState: initState,
  extraReducers: {
    [getDateReportRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getDateReportRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getDateReportRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [genOrderReportRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [genOrderReportRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [genOrderReportRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export default dateReportSlice.reducer;
