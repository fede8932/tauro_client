import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderRequest from '../request/orderRequest';
const initState = {
  loading: false,
  data: { totalPages: 1, totalResults: 0, list: [] },
  select: null,
  error: '',
};
export const searchPendingsRequest = createAsyncThunk(
  'SEARCH_ITEM_PEND',
  orderRequest.searchPendings
);
export const delPendingsRequest = createAsyncThunk(
  'DELETE_ITEM_PEND',
  orderRequest.delPending
);
export const delPendingsRegRequest = createAsyncThunk(
  'DELETE_REG_ITEM_PEND',
  orderRequest.delPendingReg
);
export const addPendingsRequest = createAsyncThunk(
  'NUEVO_ITEM_PEND',
  orderRequest.newPending
);

const pendingSlice = createSlice({
  name: 'order_pending',
  initialState: initState,
  reducers: {
    resetPendingList: (state) => {
      state.loading = false;
      state.data = { totalPages: 1, totalResults: 0, list: [] };
      state.select = null;
      state.error = '';
    },
  },
  extraReducers: {
    [searchPendingsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchPendingsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchPendingsRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [delPendingsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [delPendingsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [delPendingsRequest.fulfilled]: (state, action) => {
      let newList = [...state.data.list].filter(
        (item) => item.id != action.payload
      );
      state.loading = false;
      state.data.list = newList;
    },
    [addPendingsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [addPendingsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addPendingsRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
    },
    [delPendingsRegRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [delPendingsRegRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [delPendingsRegRequest.fulfilled]: (state, action) => {
      const { pendingId, regPendingId } = action.payload;
      let data = {...state.data}
      let list = JSON.parse(JSON.stringify(data.list));
      const index = list.findIndex(item => item.id == pendingId)
      if(index > -1){
        list[index].registers = list[index].registers.filter(item => item.id != regPendingId)
      }
      data.list = list;
      state.error = ""
      state.pending = false
      state.data = data;
    },
  },
});

export const { resetPendingList } = pendingSlice.actions;

export default pendingSlice.reducer;
