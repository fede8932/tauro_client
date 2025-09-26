import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderRequest from '../request/orderRequest';
const orderState = {
  loading: false,
  data: { list: [], selectType: null },
  error: '',
};
// export const getOrdersByTextRequest = createAsyncThunk(
//   "ORDERS_LIST",
//   orderRequest.searchGeneralOrder
// );
export const searchSellOrderRequest = createAsyncThunk(
  'ORDERS_SELL_LIST',
  orderRequest.searchSellOrder
);
export const searchBuyOrderRequest = createAsyncThunk(
  'ORDERS_BUY_LIST',
  orderRequest.searchBuyOrder
);
export const confirmBuyOrderRequest = createAsyncThunk(
  'CONFIRM_ORDERS_BUY',
  orderRequest.confirmBuyOrder
);
export const deleteOrderById = createAsyncThunk(
  'ORDER_DELETE',
  orderRequest.deleteOrder
);
export const cancelOrderById = createAsyncThunk(
  'CANCEL_DELETE',
  orderRequest.cancelOrder
);
export const updateOrderConfirmById = createAsyncThunk(
  'ORDER_UPDATE_RECIVER',
  orderRequest.updateStatusOrderConfirm
);
export const confirmSellOrderRequest = createAsyncThunk(
  'ORDER_UPDATE_SELL_ORDER',
  orderRequest.confirmSellOrder
);
export const NewNCSellOrderRequest = createAsyncThunk(
  'ORDER_NC_SELL_ORDER',
  orderRequest.NewNCForOrder
);
export const confirmSellOrderWBillRequest = createAsyncThunk(
  'ORDER_UPDATE_SELL_ORDER_W_BILL',
  orderRequest.confirmSellOrderWBill
);
export const addRemOrderConfirmRequest = createAsyncThunk(
  'ADD_REMITO',
  orderRequest.addRemToOrderConfirm
);
export const addFacOrderConfirmRequest = createAsyncThunk(
  'ADD_FACTURA',
  orderRequest.addFacToOrderConfirm
);
export const confirmSelectSellOrderRequest = createAsyncThunk(
  'CONFIRM_ALL_SELL_ORDER',
  orderRequest.confirmSelectSellOrder
);
export const unificSelectSellOrderRequest = createAsyncThunk(
  'UNIF_ALL_SELL_ORDER',
  orderRequest.unificSelectSellOrder
);

const orderListSlice = createSlice({
  name: 'Orders',
  initialState: orderState,
  reducers: {
    setOrderMarc: (state, action) => {
      const { id } = action.payload;
      let newReg = state.data?.list?.map((reg) => {
        if (id == reg.id) {
          reg.marc = !reg.marc;
        }
        return reg;
      });
      state.data.list = newReg;
    },
    resetOrderState: (state, action) => {
      state.pending = false;
      state.data = orderState.data;
      state.error = '';
    },
  },
  extraReducers: {
    // [getOrdersByTextRequest.pending]: (state, action) => {
    //   state.loading = true;
    // },
    // [getOrdersByTextRequest.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // },
    // [getOrdersByTextRequest.fulfilled]: (state, action) => {
    //   state.loading = false;
    //   state.data = action.payload;
    // },
    [searchSellOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchSellOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchSellOrderRequest.fulfilled]: (state, action) => {
      const newList = action.payload.list.map((item) => {
        item.marc = false;
        return item;
      });
      action.payload.list = newList;
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
    [searchBuyOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [searchBuyOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [searchBuyOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
    [confirmBuyOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [confirmBuyOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [confirmBuyOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
    },
    [deleteOrderById.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [deleteOrderById.fulfilled]: (state, action) => {
      state.loading = false;
      let newState = { ...state.data };
      let list = newState.list.filter((order) => order.id !== action.payload);
      newState.list = list;
      state.data = newState;
    },
    [updateOrderConfirmById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updateOrderConfirmById.fulfilled]: (state, action) => {
      state.loading = false;
      const newState = state.data.list.map((order) => {
        if (order.id == action.payload.id) return action.payload;
        return order;
      });
      state.data = newState;
    },
    [cancelOrderById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [cancelOrderById.fulfilled]: (state, action) => {
      state.loading = false;
      const newState = state.data.list.map((order) => {
        if (order.id == action.payload.id) return action.payload;
        return order;
      });
      state.data = newState;
    },
    [NewNCSellOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [NewNCSellOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [NewNCSellOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      console.log({ ...state.data });
      const newState = state.data?.list?.map((order) => {
        if (order.id == action.payload?.purchaseOrder?.id)
          return action.payload.purchaseOrder;
        return order;
      });
      state.data = newState;
    },
    [confirmSellOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [confirmSellOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [confirmSellOrderRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
    },
    [confirmSellOrderWBillRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [confirmSellOrderWBillRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [confirmSellOrderWBillRequest.fulfilled]: (state, action) => {
      state.loading = false;
      const newState = state.data.list.map((order) => {
        if (order.id == action.payload.id) return action.payload;
        return order;
      });
      state.data = newState;
    },
    [addRemOrderConfirmRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [addRemOrderConfirmRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addRemOrderConfirmRequest.fulfilled]: (state, action) => {
      state.error = '';
      state.loading = false;
    },
    [addFacOrderConfirmRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [addFacOrderConfirmRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addFacOrderConfirmRequest.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [confirmSelectSellOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [confirmSelectSellOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [confirmSelectSellOrderRequest.fulfilled]: (state, action) => {
      let newState = { ...state.data };
      let newList = newState.list.map((item) => {
        if (action.payload.includes(item.id)) {
          item.status = 'Confirm';
          item.marc = false;
        }
        return item;
      });
      newState.list = newList;
      state.loading = false;
      state.error = '';
      state.data = newState;
    },
    [unificSelectSellOrderRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [unificSelectSellOrderRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [unificSelectSellOrderRequest.fulfilled]: (state, action) => {
      let newList = [...state.data.list].filter(
        (item) => !action.payload.blackListId.includes(item.id)
      );
      newList = newList.map((item) => {
        if (item.id == action.payload.order.id) return action.payload.order;
        return item;
      });
      state.loading = false;
      state.error = '';
      state.data.list = newList;
    },
  },
});

export const { setOrderMarc, resetOrderState } = orderListSlice.actions;

export default orderListSlice.reducer;
