import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import * as clientRequest from '../request/clientRequest';
import * as userRequest from '../request/userRequest';
const clientState = {
  loading: false,
  data: { clients: [], totalRows: 1, totalPages: 1 },
  error: '',
};
export const getClientssByTextRequest = createAsyncThunk(
  'GET_CLIENTS',
  clientRequest.getClientsByData
);
export const getClientByTextRequest = createAsyncThunk(
  'GET_CLIENT',
  clientRequest.getClientByData
);
export const UpdateClientsRequest = createAsyncThunk(
  'UPDATE_CLIENT',
  clientRequest.updateClientById
);
export const UpdateStatusClientRequest = createAsyncThunk(
  'UPDATE_STATUS_CLIENT',
  userRequest.updateUserStatusRequest
);
export const getAllClientsByTextRequest = createAsyncThunk(
  'GET_CLIENTS_TEXT',
  clientRequest.getAllClientByData
);
export const ResetStatusClients = createAsyncThunk(
  'RESET_STATUS_CLIENT',
  () => clientState
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState: clientState,
  extraReducers: {
    [getClientssByTextRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getClientssByTextRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getClientssByTextRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [ResetStatusClients.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload.data;
    },
    [getAllClientsByTextRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllClientsByTextRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getAllClientsByTextRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data.clients = action.payload;
    },
    [getClientByTextRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getClientByTextRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getClientByTextRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = [action.payload];
    },
    [UpdateStatusClientRequest.pending]: (state, action) => {
      state.loading = false;
    },
    [UpdateStatusClientRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [UpdateStatusClientRequest.fulfilled]: (state, action) => {
      const newClients = state.data.clients.map((client) => {
        if (client.user.id === action.payload.id) {
          client.user = action.payload;
        }
        return client;
      });
      const newStateData = state.data;
      newStateData.clients = newClients;
      state.loading = false;
      state.data = newStateData;
    },
    [UpdateClientsRequest.pending]: (state, action) => {
      state.loading = false;
    },
    [UpdateClientsRequest.rejected]: (state, action) => {
      state.error = action.error.message;
    },
  },
});

export default clientsSlice.reducer;
