import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  brand: null,
  article: null,
  description: null,
  location: null,
  columnOrder: 'article',
  order: 'asc',
  pageSize: 100,
  page: 1,
  equivalenceId: null,
  supplierId: null,
  esOferta: null,
};

const filtersProductsSlice = createSlice({
  name: 'filtersProducts',
  initialState: defaultState,
  reducers: {
    setFilterProduct: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : null;
    },
    setEquivFilter: (state, action) => {
      state.brand = null;
      state.article = null;
      state.description = null;
      state.equivalenceId = action.payload;
    },
    resetEquivFilter: (state) => {
      state.equivalenceId = null;
    },
    resetFilterProduct: (state, action) => {
      return defaultState;
    },
    loadFiltersFromStorage: (state) => {
      // Ya no es necesario cargar de storage
    },
  },
});

export const {
  setFilterProduct,
  resetFilterProduct,
  setEquivFilter,
  resetEquivFilter,
  loadFiltersFromStorage,
} = filtersProductsSlice.actions;

export default filtersProductsSlice.reducer;
