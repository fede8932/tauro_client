import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  client: null,
  initDate: null,
  endDate: null,
  status: null,
  pageSize: 50,
  page: 1,
};

const filtersPresupuestoSlice = createSlice({
  name: 'filtersPresupuesto',
  initialState,
  reducers: {
    setFilterPresupuesto: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetFilterPresupuesto: () => initialState,
  },
});

export const { setFilterPresupuesto, resetFilterPresupuesto } = filtersPresupuestoSlice.actions;
export default filtersPresupuestoSlice.reducer;
