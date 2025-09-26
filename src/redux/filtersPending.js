import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageSize: 50,
  page: 1,
  rangeDate: null,
  article: null,
  description: null,
  brandId: null,
  clientId: null,
};

const filtersPendingSlice = createSlice({
  name: 'pendingFilter',
  initialState,
  reducers: {
    setFilterPending: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : null;
    },
    resetFilterPending: (state) => {
      Object.assign(state, {
        pageSize: 50,
        page: 1,
        rangeDate: null,
        article: null,
        description: null,
        brandId: null,
        clientId: null,
      });
    },
  },
});

export const { setFilterPending, resetFilterPending } = filtersPendingSlice.actions;

export default filtersPendingSlice.reducer;
