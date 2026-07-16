import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as billRequest from '../request/billRequest';
const calcRounding = (subTotal) => {
  const rawTotal = subTotal * 1.21;
  const roundedTotal = Math.floor(rawTotal / 10) * 10;
  return +((roundedTotal - rawTotal).toFixed(2));
};

export const POS_DEFAULT_CLIENT_ID = 540;
export const POS_DEFAULT_CLIENT_NAME = 'Consumidor Final';

const initialState = {
  loading: false,
  error: '',
  order: {
    subTotal: 0,
    clientId: POS_DEFAULT_CLIENT_ID,
    razonSocial: POS_DEFAULT_CLIENT_NAME,
    items: [],
    rounding: 0,
    cotizacionId: null,
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
    setCotizacionId: (state, action) => {
      state.order.cotizacionId = action.payload;
      localStorage.setItem('pos-order', JSON.stringify({ ...state.order }));
    },
    getInitialOrderStorage: (state) => {
      try {
        const posSellOrderString = localStorage.getItem('pos-order');
        if (posSellOrderString) {
          const posSellOrder = JSON.parse(posSellOrderString);
          if (posSellOrder && posSellOrder.items) {
            state.order = {
              subTotal: posSellOrder.subTotal || 0,
              clientId:
                posSellOrder.clientId && Number(posSellOrder.clientId) !== 1
                  ? Number(posSellOrder.clientId)
                  : POS_DEFAULT_CLIENT_ID,
              razonSocial:
                posSellOrder.clientId && Number(posSellOrder.clientId) !== 1
                  ? posSellOrder.razonSocial || POS_DEFAULT_CLIENT_NAME
                  : POS_DEFAULT_CLIENT_NAME,
              items: posSellOrder.items,
              rounding: calcRounding(posSellOrder.subTotal || 0),
              cotizacionId: posSellOrder.cotizacionId || null,
            };
          }
        }
      } catch (e) {
        // ignore
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
      newStateOrder.rounding = calcRounding(newStateOrder.subTotal);
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
      newStateOrder.rounding = calcRounding(newTotal);
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
      newStateOrder.rounding = calcRounding(newTotal);
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
  setCotizacionId,
} = posSellOrderSlice.actions;

export default posSellOrderSlice.reducer;
