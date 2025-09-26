import { createSlice } from '@reduxjs/toolkit';

// Estado inicial
const initialState = {
  data: false,
  error: null,
};

// Slice de Redux para manejar el estado de la notificación
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    trueNotificStatus: (state) => {
      state.data = true; // Cambiar el estado de la notificación
      state.error = null; // Limpiar el error si ha ocurrido
    },
    falseNotificStatus: (state) => {
      state.data = false; // Cambiar el estado de la notificación
      state.error = null; // Limpiar el error si ha ocurrido
    },
  },
});

export const { trueNotificStatus, falseNotificStatus } =
  notificationSlice.actions;

export default notificationSlice.reducer;
