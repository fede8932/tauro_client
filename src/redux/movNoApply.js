import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as noApplyReq from '../request/movNoApplyRequest';
const initState = {
  loading: false,
  data: [],
  error: '',
  montoTotal: 0,
};
export const getAllMovNoApplyRequest = createAsyncThunk(
  'GET_NC_NOAPPLY',
  noApplyReq.getAllMovNoApply
);
export const marcToggleNoApplyRequest = createAsyncThunk(
  'MARC_TOGGLE_NC_NA',
  (id) => id
);
export const resetMovNoApplyRequest = createAsyncThunk(
  'RESET_STATUS_NOAPPLY_MOV',
  () => {}
);

const movNoApplySlice = createSlice({
  name: 'noApply',
  initialState: initState,
  extraReducers: {
    [resetMovNoApplyRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = [];
      state.montoTotal = 0;
    },
    [getAllMovNoApplyRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllMovNoApplyRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getAllMovNoApplyRequest.fulfilled]: (state, action) => {
      const newList = action.payload.map((item) => {
        item.marc = false;
        return item;
      });
      state.loading = false;
      state.data = newList;
    },
    [marcToggleNoApplyRequest.fulfilled]: (state, action) => {
      const newList = state.data.map((item) => {
        if (action.payload == item.id) {
          item.marc = !item.marc;
          state.montoTotal = item.marc
            ? state.montoTotal + item.total
            : state.montoTotal - item.total;
        }
        return item;
      });
      state.loading = false;
      state.data = newList;
    },
  },
});

export default movNoApplySlice.reducer;
