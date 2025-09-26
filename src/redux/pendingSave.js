import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pending: false,
  orderId: null,
};

const pendingSaveSlice = createSlice({
  name: 'filtersComis',
  initialState,
  reducers: {
    setPendingSave: (state, action) => {
      const { orderId, pending } = action.payload;
      state.pending = pending;
      state.orderId = orderId;
    },
    resetPendingSave: (state) => {
      state.pending = false;
      state.orderId = null;
    },
  },
});

export const { setPendingSave, resetPendingSave } = pendingSaveSlice.actions;

export default pendingSaveSlice.reducer;
