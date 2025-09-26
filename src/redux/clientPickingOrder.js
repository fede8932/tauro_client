import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as clientRequest from '../request/clientRequest';
const userState = {
  loading: false,
  data: { pickingOrders: [], totalRows: 0, totalPages: 0 },
  error: '',
};

export const getPickingOrderRequest = createAsyncThunk(
  'PICKING_ORDER_LIST',
  clientRequest.getPickingOrder
);
export const searchPickingOrderRequest = createAsyncThunk(
  'PICKING_ORDER_SEARCH',
  clientRequest.searchPickingOrder
);
export const updatePickingOrderRequest = createAsyncThunk(
  'PICKING_UPDATE',
  clientRequest.updatePickingOrder
);
export const printPickingOrderRequest = createAsyncThunk(
  'PICKING_PRINT',
  clientRequest.updatePrintPickingOrder
);

const clientPickingSlice = createSlice({
  name: 'clientPicking',
  initialState: userState,
  reducers: {
    toggleMarc: (state, action) => {
      const actualState = [...state.data.pickingOrders].find(
        (item) => item.id == action.payload
      )?.marc;
      state.data.pickingOrders.find((item) => item.id == action.payload).marc =
        !actualState;
    },
  },
  extraReducers: {
    [searchPickingOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchPickingOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchPickingOrderRequest.fulfilled]: (state, action) => {
      let data = action.payload;
      data.pickingOrders = [...data.pickingOrders].map((item) => {
        item.marc = false;
        return item;
      });
      state.loading = false;
      state.error = '';
      state.data = data;
    },
    [getPickingOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getPickingOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getPickingOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [updatePickingOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updatePickingOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updatePickingOrderRequest.fulfilled]: (state, action) => {
      const newData = state.data.pickingOrders.map((item) => {
        if (item.id == action.payload.id) {
          item.status = 'Preparado';
        }
        return item;
      });
      state.data.pickingOrders = newData;
      state.loading = false;
    },
    [printPickingOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [printPickingOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [printPickingOrderRequest.fulfilled]: (state, action) => {
      let newState = { ...state.data };
      let newList = newState.pickingOrders.map((po) => {
        if (po.id == action.payload.id) {
          po.print = true;
        }
        return po;
      });
      newState.pickingOrders = newList;
      state.loading = false;
      state.error = '';
      state.data = newState;
    },
  },
});
export const { toggleMarc } = clientPickingSlice.actions;

export default clientPickingSlice.reducer;
