import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageSize: 5000,
  page: 1,
};

const filtersComisSlice = createSlice({
  name: 'filtersComis',
  initialState,
  reducers: {
    setFilterComis: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : null;
    },
  },
});

export const { setFilterComis } = filtersComisSlice.actions;

export default filtersComisSlice.reducer;
