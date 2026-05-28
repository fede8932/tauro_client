import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as billRequest from '../request/billRequest';
const initialState = {
  loading: false,
  error: '',
  order: {
    subTotal: 0,
    clientId: null,
    razonSocial: null,
    items: [],
  },
  billData: { oficial: null, numComprobante: null, ptoVenta: null, id: null, billType: null },
};

export const finishSellPosAsync = createAsyncThunk(
  'FINISH_SELL_POS',
  billRequest.genSellOrderByPosRequest
);

const posSellOrderSlice = createSlice({
  name: 'posSellOrder',
  initialState: initialState,
  reducers: {
    resetPosSellOrderState(state) {
      state.loading = false;
      state.error = '';
      state.order = initialState.order;
      state.billData = { oficial: null, numComprobante: null, ptoVenta: null };
      localStorage.setItem('pos-order', JSON.stringify({ ...state.order }));
    },
    getInitialOrderStorage: (state) => {
      const posSellOrderString = localStorage.getItem('pos-order');
      const posSellOrder = JSON.parse(posSellOrderString);
      if (posSellOrder) {
        state.order = posSellOrder;
      }
    },
    selectClientForOrder: (state, action) => {
      state.order.clientId = action.payload.id;
      state.order.razonSocial = action.payload.razonSocial;
      localStorage.setItem('pos-order', JSON.stringify({ ...state.order }));
    },
    addLocalOrderItem: (state, action) => {
      const newStateOrder = { ...state.order };
      const { productId, brandId, amount, sellPrice } = action.payload;
      const index = newStateOrder.items.findIndex(
        (item) => item.productId == productId && item.brandId == brandId
      );
      if (index > -1) {
        newStateOrder.items[index].amount += amount;
      } else {
        newStateOrder.items.push({ ...action.payload, amount });
      }
      newStateOrder.subTotal += sellPrice * amount;
      state.order = newStateOrder;
      localStorage.setItem('pos-order', JSON.stringify({ ...state.order }));
    },
    delLocalOrderItem: (state, action) => {
      let newTotal = 0;
      const newStateOrder = { ...state.order };
      const items = newStateOrder.items.filter((item) => {
        if (
          item.productId == action.payload.productId &&
          item.brandId == action.payload.brandId
        ) {
          return false;
        }
        newTotal += item.sellPrice * item.amount;
        return true;
      });
      newStateOrder.subTotal = newTotal;
      newStateOrder.items = items;
      state.order = newStateOrder;
      localStorage.setItem('pos-order', JSON.stringify({ ...state.order }));
    },
    changeAmountOrderItem: (state, action) => {
      const { productId, brandId, amount } = action.payload;
      let newTotal = 0;
      const newStateOrder = { ...state.order };
      const items = newStateOrder.items.map((item) => {
        if (item.productId == productId && item.brandId == brandId) {
          item.amount = amount;
        }
        newTotal += item.sellPrice * item.amount;
        return item;
      });
      newStateOrder.subTotal = newTotal;
      newStateOrder.items = items;
      state.order = newStateOrder;
      localStorage.setItem('pos-order', JSON.stringify({ ...state.order }));
    },
  },
  extraReducers: {
    [finishSellPosAsync.pending]: (state, action) => {
      state.loading = true;
    },
    [finishSellPosAsync.rejected]: (state, action) => {
      state.loading = false;
      state.billData = initialState.billData;
      state.error = action.error.message;
    },
    [finishSellPosAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.billData = action.payload;
    },
  },
});

export const {
  resetPosSellOrderState,
  getInitialOrderStorage,
  selectClientForOrder,
  addLocalOrderItem,
  delLocalOrderItem,
  changeAmountOrderItem,
} = posSellOrderSlice.actions;

export default posSellOrderSlice.reducer;
