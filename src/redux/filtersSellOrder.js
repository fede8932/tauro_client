import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  number: null,
  client: null,
  pageSize: 50,
  pending: true,
  page: 1,
};

const filterSellOrderSlice = createSlice({
  name: 'filtersSellOrder',
  initialState,
  reducers: {
    setFilterSellOrder: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : name == 'pending' ? false : null;
    },
    resetFilterSellOrder: (state, action) => {
      state.number = null;
      state.client = null;
      state.pageSize = 50;
      state.pending = true;
      state.page = 1;
    },
  },
});

export const { setFilterSellOrder, resetFilterSellOrder } =
  filterSellOrderSlice.actions;

export default filterSellOrderSlice.reducer;
