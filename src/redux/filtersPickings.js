import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  number: null,
  client: null,
  pageSize: 20,
  pending: true,
  page: 1,
};

const filterPickingsSlice = createSlice({
  name: 'filtersPickings',
  initialState,
  reducers: {
    setFilterPickinngs: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : name == 'pending' ? false : null;
    },
    resetFilterPickinngs: (state, action) => {
      state.number = null;
      state.client = null;
      state.pageSize = 20;
      state.pending = true;
      state.page = 1;
    },
  },
});

export const { setFilterPickinngs, resetFilterPickinngs } =
  filterPickingsSlice.actions;

export default filterPickingsSlice.reducer;
