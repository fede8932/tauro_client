import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  number: null,
  supplier: null,
  pageSize: 50,
  pending: true,
  page: 1,
};

const filterBuyOrderSlice = createSlice({
  name: 'filtersBuyOrder',
  initialState,
  reducers: {
    setFilterBuyOrder: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : name == 'pending' ? false : null;
    },
    resetFilterBuyOrder: (state, action) => {
      state.number = null;
      state.supplier = null;
      state.pageSize = 50;
      state.pending = true;
      state.page = 1;
    },
  },
});

export const { setFilterBuyOrder, resetFilterBuyOrder } =
  filterBuyOrderSlice.actions;

export default filterBuyOrderSlice.reducer;
