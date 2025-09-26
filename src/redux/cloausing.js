import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as closingRequest from '../request/clousingRequest';

const initState = {
  loading: false,
  ansSearch: {totalPages: 0, totalResults: 0, list: []},
  error: '',
  detailClose: null,
};

export const searchClousingRequest = createAsyncThunk(
  'SEARCH_CLOSING',
  closingRequest.searchClousing
);

export const finishClosingRequest = createAsyncThunk(
  'FINISH_CLOSING_ID',
  closingRequest.finishClousing
);

export const getClosingIdRequest = createAsyncThunk(
  'GET_CLOSING_ID',
  closingRequest.getCloseingId
);

const clousingSlice = createSlice({
  name: 'closing',
  initialState: initState,
  reducers: {
    resetSearchClousing: (state) => {
      state.loading = false;
      state.ansSearch = initState.ansSearch;
      state.error = '';
      state.detailClose = initState.detailClose;
    },
    resetSelectClousing: (state) => {
      state.detailClose = initState.detailClose;
    },
  },
  extraReducers: {
    [searchClousingRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchClousingRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchClousingRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.ansSearch = action.payload;
      state.error = '';
    },
    [finishClosingRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [finishClosingRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [finishClosingRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
    },
    [getClosingIdRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getClosingIdRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getClosingIdRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.detailClose = action.payload
    },
  },
});

export const { resetSearchClousing, resetSelectClousing } = clousingSlice.actions;
export default clousingSlice.reducer;
