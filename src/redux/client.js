import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as clientRequest from '../request/clientRequest';
const userState = {
  loading: false,
  data: null,
  selectClient: null,
  error: '',
};
export const clientCreateRequest = createAsyncThunk(
  'CLIENT_CREATE',
  clientRequest.clientRegister
);

export const getClientRequest = createAsyncThunk(
  'GET_CLIENT',
  clientRequest.getClients
);
export const getClientIdRequest = createAsyncThunk(
  'GET_CLIENT_ID',
  clientRequest.getClientById
);
export const getClientIdRequestNew = createAsyncThunk(
  'GET_CLIENT_ID_NEW',
  clientRequest.getClientById
);

export const getAllClientRequest = createAsyncThunk(
  'GET_ALL_CLIENT',
  clientRequest.getAllClients
);

export const resetAllClientRequest = createAsyncThunk(
  'RESET_ALL_CLIENT',
  (state) => {
    state.loading = userState.loading;
    state.error = userState.error;
    state.data = userState.data;
    state.selectClient = userState.selectClient;
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState: userState,
  reducers: {
    changeInput: (state, action) => {
      let client = { ...state.data };
      const { name, value } = action.payload;
      if (client[name] !== null && client[name] !== undefined) {
        client[name] = value;
      } else if (
        client.user[name] !== null &&
        client.user[name] !== undefined
      ) {
        client.user[name] = value;
      }
      state.data = client;
    },
    resetClientState: (state) => {
      state.loading = false;
      state.error = '';
      state.data = null;
      state.selectClient = null;
    },
    resetSelectClientState: (state) => {
      state.selectClient = null;
    },
  },
  extraReducers: {
    [clientCreateRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [clientCreateRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [clientCreateRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getClientRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getClientRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getClientRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllClientRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllClientRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getAllClientRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getClientIdRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getClientIdRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getClientIdRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
    [getClientIdRequestNew.pending]: (state, action) => {
      state.loading = true;
    },
    [getClientIdRequestNew.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getClientIdRequestNew.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.selectClient = action.payload;
    },
  },
});

export const { changeInput, resetClientState, resetSelectClientState } =
  clientSlice.actions;

export default clientSlice.reducer;
