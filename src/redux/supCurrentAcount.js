import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supCurrentAcountRequest from '../request/supMovementRequest';
import { MovTypeEnum } from '../enum/MovEnum';
const initState = {
  loading: false,
  data: {
    currentAcount: null,
    totalRows: 0,
    totalPages: 0,
    list: [],
  },
  totalMarc: 0,
  active: false,
  error: '',
  actualizar: 0,
};

export const addMovCurreantAcountSupplierRequest = createAsyncThunk(
  'ADD_MOV_CA_STATE',
  supCurrentAcountRequest.createSupMovementsRequest
);
export const getMovSupplierRequest = createAsyncThunk(
  'GET_MOV_CA_STATE',
  supCurrentAcountRequest.searchSupMovRequest
);
export const deleteMovSupplierRequest = createAsyncThunk(
  'DELETE_MOV_CA_STATE',
  supCurrentAcountRequest.deleteSupMovementsRequest
);

const supCaSlice = createSlice({
  name: 'supCurrentAcount',
  initialState: initState,
  reducers: {
    setActualizar: (state) => {
      state.actualizar++;
    },
    resetSupCAReports: (state) => {
      state.loading = false;
      state.data = initState.data;
      state.error = '';
      state.totalMarc = 0;
      state.active = false;
    },
    marcSupReport: (state, action) => {
      const id = action.payload;
      const list = [...state.data.list].map((obj) => {
        if (obj.id == id) {
          obj.marc = !obj.marc;
        }
        return obj;
      });
      state.totalMarc = list.reduce((acum, obj) => {
        if (obj.marc) {
          if (MovTypeEnum[obj.type] === 'Factura') {
            return acum + (obj.pendingAmount || 0);
          } else {
            return acum - (obj.pendingAmount || 0);
          }
        }
        return acum;
      }, 0);
      state.active = list.findIndex((obj) => obj.marc) > -1;
      state.data.list = list;
    },
  },
  extraReducers: {
    [addMovCurreantAcountSupplierRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [addMovCurreantAcountSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [addMovCurreantAcountSupplierRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
    },
    [getMovSupplierRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getMovSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getMovSupplierRequest.fulfilled]: (state, action) => {
      const data = { ...action.payload };
      data.list = data.list.map((obj) => ({ ...obj, marc: false }));
      state.loading = false;
      state.error = '';
      state.data = data;
    },
    [deleteMovSupplierRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteMovSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteMovSupplierRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.actualizar++;
    },
  },
});

export const { resetSupCAReports, marcSupReport, setActualizar } = supCaSlice.actions;
export default supCaSlice.reducer;
