import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
  lastName: null,
  email: null,
  razonSocial: null,
  columnOrder: 'name',
  order: 'asc',
  pageSize: 20,
  page: 1,
};

const filtersUsersSlice = createSlice({
  name: 'filtersUsers',
  initialState,
  reducers: {
    resetFilterUser: (state, action) => {
      state.name = null;
      state.lastName = null;
      state.razonSocial = null;
      state.columnOrder = 'name';
      state.order = 'asc';
      state.email = null;
      state.pageSize = 20;
      state.page = 1;
    },
    setFilterUser: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : null;
    },
  },
});

export const { setFilterUser, resetFilterUser } = filtersUsersSlice.actions;

export default filtersUsersSlice.reducer;
