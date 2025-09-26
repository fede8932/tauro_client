import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as representativeRequest from '../request/representativesRequest';
const initState = {
  loading: false,
  data: [],
  error: '',
};
export const getRepresentRequest = createAsyncThunk(
  'GET_REPRESENTATIVE',
  representativeRequest.getRepresentativesBySupplier
);

const representativeSlice = createSlice({
  name: 'representative',
  initialState: initState,
  extraReducers: {
    [getRepresentRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getRepresentRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getRepresentRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export default representativeSlice.reducer;
