import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as otherRequest from '../request/otherUsersRequest';
const sellerState = {
  loading: false,
  data: [],
  error: '',
};

export const createOtherUsersRequest = createAsyncThunk(
  'CREATE_OTHER_USER',
  otherRequest.createUser
);

const otherSlice = createSlice({
  name: 'otherUsers',
  initialState: sellerState,
  extraReducers: {
    [createOtherUsersRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [createOtherUsersRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [createOtherUsersRequest.fulfilled]: (state, action) => {
      state.loading = false;
    },
  },
});

export default otherSlice.reducer;
