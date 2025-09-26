import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  size: 100,
  pending: true,
  page: 1,
};

const filtersPaymentOrderSlice = createSlice({
  name: 'filtersPaymentOrder',
  initialState,
  reducers: {
    setfiltersPaymentOrder: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetfiltersPaymentOrder: (state, action) => {
      state.size = 50;
      state.pending = true;
      state.page = 1;
    },
  },
});

export const { setfiltersPaymentOrder, resetfiltersPaymentOrder } =
  filtersPaymentOrderSlice.actions;

export default filtersPaymentOrderSlice.reducer;
