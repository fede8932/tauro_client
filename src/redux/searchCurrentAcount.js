import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as currentRequest from '../request/currentAcountRequest';
const movementsState = {
  loading: false,
  data: {
    currentAcount: {
      client: { razonSocial: '' },
      supplier: { razonSocial: '' },
    },
    movements: { list: [], totalRows: 0, totalPages: 1 },
    totalMarc: 0,
  },
  error: '',
};
export const getAcountById = createAsyncThunk(
  'GET_CURRENT_ACOUNT',
  currentRequest.getCurrentAcount
);
export const getMovementsByCurrentAcountId = createAsyncThunk(
  'GET_MOVEMENTS',
  currentRequest.getMovementsRequest
);
export const getMovementsByCurrentAcountIdX = createAsyncThunk(
  'GET_MOVEMENTS',
  currentRequest.getMovementsExtraRequest
);
export const addMovementsByCurrentAcountId = createAsyncThunk(
  'ADD_NEW_MOVEMENTS',
  currentRequest.newMovementsRequest
);
export const addPayToCurrentAcount = createAsyncThunk(
  'ADD_PAY',
  currentRequest.addPayToCurrentAcount
);
// export const marcMovementsByCurrentAcountId = createAsyncThunk(
//   "MARC_MOVEMENT",
//   (orderId) => orderId
// );

const movementsSlice = createSlice({
  name: 'movements',
  initialState: movementsState,
  reducers: {
    marcMovementsByCurrentAcountId: (state, action) => {
      let total = 0;
      const newList = state.data.movements.list.map((mov) => {
        if (mov?.id == action.payload) {
          mov.marc = !mov.marc;
        }
        if (mov.marc) {
          total += mov.saldoPend;
        }
        return mov;
      });
      state.data.totalMarc = total;
      state.data.movements.list = newList;
    },
    resetMovementsByCurrentAcountId: (state) => {
      state.loading = false;
      state.totalMarc = 0;
      state.data = {
        currentAcount: {
          client: { razonSocial: '' },
          supplier: { razonSocial: '' },
        },
        movements: { list: [], totalRows: 0, totalPages: 1 },
      };
      state.error = '';
    },
  },
  extraReducers: {
    [getAcountById.pending]: (state, action) => {
      state.loading = true;
    },
    [getAcountById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getAcountById.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      const { movements, ...caData } = action.payload;
      state.data.currentAcount = caData;
    },
    [getMovementsByCurrentAcountId.pending]: (state, action) => {
      state.loading = true;
    },
    [getMovementsByCurrentAcountId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getMovementsByCurrentAcountId.fulfilled]: (state, action) => {
      action.payload.list = action.payload.list.map((mov) =>
        Object.assign({}, mov, { marc: false })
      );
      state.loading = false;
      state.data.movements = action.payload;
    },
    [getMovementsByCurrentAcountIdX.pending]: (state, action) => {
      state.loading = true;
    },
    [getMovementsByCurrentAcountIdX.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getMovementsByCurrentAcountIdX.fulfilled]: (state, action) => {
      action.payload.list = action.payload.list.map((mov) =>
        Object.assign({}, mov, { marc: false })
      );
      state.loading = false;
      let { currentAcount, ...list } = action.payload;
      state.data.currentAcount = currentAcount;
      state.data.movements = list;
    },
    [addMovementsByCurrentAcountId.pending]: (state, action) => {
      state.loading = true;
    },
    [addMovementsByCurrentAcountId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addMovementsByCurrentAcountId.fulfilled]: (state, action) => {
      state.loading = false;
    },
    // [marcMovementsByCurrentAcountId.fulfilled]: (state, action) => {
    //   const newList = state.data.movements.list.map((mov) => {
    //     if (mov?.purchaseOrder?.id == action.payload) {
    //       mov.marc = !mov.marc;
    //     }
    //     return mov;
    //   });
    //   state.data.movements.list = newList;
    // },
  },
});

export const {
  marcMovementsByCurrentAcountId,
  resetMovementsByCurrentAcountId,
} = movementsSlice.actions;

export default movementsSlice.reducer;
