import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filterMov: {
    facturas: true,
    pagos: true,
    notasCredito: true,
    devoluciones: true,
    descuentos: true,
  },
  size: 100,
  pending: true,
  page: 1,
  // Nuevo filtro: número de orden de pago asociado (SupplierPaymentOrder.id)
  // Se envía como entero nullable al backend (GetSupMovDto.orderId)
  orderId: null,
};

const filterSUpMovementsSlice = createSlice({
  name: 'filtersSupMovements',
  initialState,
  reducers: {
    setFilterSupMovements: (state, action) => {
      const { name, value } = action.payload;

      if (name in state.filterMov) {
        state.filterMov[name] = value;
      } else {
        state[name] = value;
      }
    },
    resetFilterSupMovements: (state, action) => {
      state.filterMov = initialState.filterMov;
      state.size = 50;
      state.pending = true;
      state.page = 1;
      state.orderId = null;
    },
  },
});

export const { setFilterSupMovements, resetFilterSupMovements } =
  filterSUpMovementsSlice.actions;

export default filterSUpMovementsSlice.reducer;
