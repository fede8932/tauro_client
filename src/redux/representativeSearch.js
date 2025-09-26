import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as representativeRequest from '../request/representativesRequest';
const initState = {
  loading: false,
  data: { totalRows: 0, totalPages: 0, list: [] },
  error: '',
};
export const searchRepresentRequest = createAsyncThunk(
  'SEARCH_REPRESENTATIVE',
  representativeRequest.searchRepresentativesBySupplier
);

const searchRepresentativeSlice = createSlice({
  name: 'representative',
  initialState: initState,
  extraReducers: {
    [searchRepresentRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchRepresentRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchRepresentRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export default searchRepresentativeSlice.reducer;
