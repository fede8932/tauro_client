import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderRequest from '../request/orderRequest';
const userState = {
  loading: false,
  data: [],
  error: '',
};
export const getOrderItemsRequest = createAsyncThunk(
  'GET_ITEMS_BY_ORDER',
  orderRequest.getOrderItems
);
export const addOrderItemsRequest = createAsyncThunk(
  'ADD_ITEM',
  orderRequest.addOrderItem
);
export const deleteOrderItemsRequest = createAsyncThunk(
  'DELETE_ITEM',
  orderRequest.deleteOrderItem
);
export const deleteNoMarcOrderItemsRequest = createAsyncThunk(
  'DELETE_NO_MARC_ITEMS',
  orderRequest.deleteMarcOrderItems
);
export const deleteSellOrderItemsRequest = createAsyncThunk(
  'DELETE_SELL_ITEM',
  orderRequest.deleteSellOrderItem
);
export const updateCantItemsRequest = createAsyncThunk(
  'UPDAT_CANT_ITEM',
  orderRequest.updateOrderItem
);
export const updatePriceItemsRequest = createAsyncThunk(
  'UPDAT_PREC_ITEM',
  orderRequest.updatePriceOrderItem
);
export const factItemToggleRequest = createAsyncThunk(
  'FATC_TOGGLE',
  orderRequest.factItemToggle
);
//Esta no modifica en db, solo es en el estado y se usa solo para nc
export const changeCantForNCRequest = createAsyncThunk(
  'CHANGE_CANT_NC',
  (data) => {
    return data;
  }
);
export const marcToggleRequest = createAsyncThunk('MARC_TOGGLE_NC', (id) => id);
export const resetStatusRequest = createAsyncThunk(
  'RESET_STATUS_ITEM_LIST',
  () => {}
);

const newOrderItem = createSlice({
  name: 'newOrderItem',
  initialState: userState,
  reducers: {
    resetAddOrderItems: (state) => {
      state.loading = false;
      state.error = '';
      state.data = [];
    },
    toggleNoRemove: (state, action) => {
      const newList = state.data.map((item) => {
        if (item.id == action.payload) {
          item.noRemove = !item.noRemove;
        }
        return item;
      });
      state.data = newList;
    },
  },
  extraReducers: {
    [marcToggleRequest.fulfilled]: (state, action) => {
      const newStateData = state.data.map((item) => {
        if (item.id == action.payload) {
          item.marc = !item.marc;
        }
        return item;
      });
      state.data = newStateData;
    },
    [changeCantForNCRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((item) => {
        if (item.id == action.payload.id) {
          if (action.payload.change == 'up') {
            item.amount += 1;
          } else {
            item.amount -= 1;
          }
        }
        return item;
      });
      state.data = newState;
    },
    [resetStatusRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = [];
    },
    [getOrderItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getOrderItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getOrderItemsRequest.fulfilled]: (state, action) => {
      const newState = action.payload.map((item) => {
        item.marc = false;
        item.noRemove = false;
        return item;
      });
      state.loading = false;
      state.data = newState;
    },
    [addOrderItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [addOrderItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addOrderItemsRequest.fulfilled]: (state, action) => {
      const actualList = [...state.data];
      const newList = action.payload.map((item) => {
        const actualItem = actualList.find((ai) => ai.id == item.id);
        if (actualItem) {
          item.noRemove = actualItem.noRemove;
        } else {
          item.noRemove = true;
        }
        return item;
      });
      state.loading = false;
      state.data = newList;
    },
    [deleteOrderItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteOrderItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteOrderItemsRequest.fulfilled]: (state, action) => {
      const actualList = [...state.data];
      const newList = action.payload.map((item) => {
        const actualItem = actualList.find((ai) => ai.id == item.id);
        if (actualItem) {
          item.noRemove = actualItem.noRemove;
        } else {
          item.noRemove = true;
        }
        return item;
      });
      state.loading = false;
      state.data = newList;
    },
    [deleteNoMarcOrderItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteNoMarcOrderItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteNoMarcOrderItemsRequest.fulfilled]: (state, action) => {
      const newList = [...state.data].filter((item) => {
        if (action.payload.findIndex((id) => id == item.id) == -1) return true;
        return false;
      });
      state.data = newList;
      state.loading = false;
    },
    [deleteSellOrderItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteSellOrderItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteSellOrderItemsRequest.fulfilled]: (state, action) => {
      let newState = state.data.filter(
        (item) => item.id != action.payload.delId
      );
      state.data = newState;
      state.loading = false;
    },
    [updateCantItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updateCantItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updateCantItemsRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((item) => {
        if (item.id === action.payload.id) {
          item.amount = action.payload.amount;
        }
        return item;
      });
      state.loading = false;
      state.data = newState;
    },
    [updatePriceItemsRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [updatePriceItemsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updatePriceItemsRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((item) => {
        if (item.id === action.payload.id) {
          item.buyPrice = action.payload.buyPrice;
        }
        return item;
      });
      state.loading = false;
      state.data = newState;
    },
    [factItemToggleRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [factItemToggleRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [factItemToggleRequest.fulfilled]: (state, action) => {
      const newState = state.data.map((item) => {
        if (item.id === action.payload) {
          return { ...item, fact: !item.fact }; // 👈 copiado
        }
        return item;
      });
      state.loading = false;
      state.data = newState;
    },
  },
});

export const { resetAddOrderItems, toggleNoRemove } = newOrderItem.actions;

export default newOrderItem.reducer;
