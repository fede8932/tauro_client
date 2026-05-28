import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  client: null,
  initDate: null,
  endDate: null,
  status: null,
  pageSize: 50,
  page: 1,
};

const filtersCotizacionSlice = createSlice({
  name: 'filtersCotizacion',
  initialState,
  reducers: {
    setFilterCotizacion: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetFilterCotizacion: () => initialState,
  },
});

export const { setFilterCotizacion, resetFilterCotizacion } = filtersCotizacionSlice.actions;
export default filtersCotizacionSlice.reducer;
