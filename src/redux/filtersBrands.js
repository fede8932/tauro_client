import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  code: null,
  name: null,
  columnOrder: 'name',
  order: 'asc',
  pageSize: 20,
  page: 1,
};

const filtersBrandsSlice = createSlice({
  name: 'filtersBrands',
  initialState,
  reducers: {
    setFilterBrand: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : null;
    },
    resetFilterBrand: (state, action) => {
      state.code = null;
      state.name = null;
      state.columnOrder = 'name';
      state.order = 'asc';
      state.pageSize = 20;
      state.page = 1;
    },
  },
});

export const {
  setFilterBrand,
  resetFilterBrand,
} = filtersBrandsSlice.actions;

export default filtersBrandsSlice.reducer;
