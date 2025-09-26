import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userRequest from '../request/userRequest';

const uState = {
  loading: false,
  data: { results: 0, pages: 0, users: [] },
  error: '',
};

export const searchUsersExtra = createAsyncThunk(
  'SEARCH_USERS_EXTRA',
  userRequest.searchUserRequest
);

export const toggleStatusUser = createAsyncThunk(
  'TOGGLE_STATUS_USER',
  userRequest.updateUserStatusRequest
);

export const resetPassUser = createAsyncThunk(
  'RESET_PASS_USER',
  userRequest.resetPassRequest
);

const serachUsersSlice = createSlice({
  name: 'searchUsersExtra',
  initialState: uState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.data = { results: 0, pages: 0, users: [] };
      state.error = '';
    },
  },
  extraReducers: {
    [resetPassUser.pending]: (state) => {
      state.loading = true;
    },
    [resetPassUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchUsersExtra.pending]: (state) => {
      state.loading = true;
    },
    [searchUsersExtra.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchUsersExtra.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
    [toggleStatusUser.pending]: (state) => {
      state.loading = true;
    },
    [toggleStatusUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [toggleStatusUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      const users = [];
      state.data.users.map((user) => {
        if (user.id == action.payload.id) {
          user.status = action.payload.status;
        }
        users.push(user);
      });
      state.data.users = users;
    },
  },
});

export const { resetState } = serachUsersSlice.actions;

export default serachUsersSlice.reducer;
