import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import * as supplierRequest from '../request/supplierRequest';
const sellerState = {
  loading: false,
  data: { suppliers: [], totalRows: 0, totalPages: 1 },
  error: '',
};
export const getSuppliersByTextRequest = createAsyncThunk(
  'GET_SUPPLIERS',
  supplierRequest.getSuppliersByData
);
export const UpdateStatusSupplierRequest = createAsyncThunk(
  'UPDATE_STATUS_SUPPLIER',
  supplierRequest.updateSupplierStatusRequest
);
export const UpdateSuppliersRequest = createAsyncThunk(
  'UPDATE_SUPPLIER',
  supplierRequest.updateSupplierRequest
);
export const DeleteRepSupplierRequest = createAsyncThunk(
  'DELETE_REPSUPPLIER',
  supplierRequest.deleteRepSupplierRequest
);
export const UpdateRepSupplierRequest = createAsyncThunk(
  'UPDATE_REPSUPPLIER',
  supplierRequest.updateRepSupplierRequest
);
export const ResetSupplierRequest = createAsyncThunk(
  'RESET_REPSUPPLIER',
  () => sellerState
);

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState: sellerState,
  extraReducers: {
    [getSuppliersByTextRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getSuppliersByTextRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getSuppliersByTextRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [ResetSupplierRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload.data;
    },
    [UpdateStatusSupplierRequest.pending]: (state, action) => {
      state.loading = false;
    },
    [UpdateStatusSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [UpdateStatusSupplierRequest.fulfilled]: (state, action) => {
      const newSuppliers = state.data.suppliers.map((supplier) => {
        if (supplier.id === action.payload.id) {
          supplier = action.payload;
        }
        return supplier;
      });
      const newStateData = state.data;
      newStateData.suppliers = newSuppliers;
      state.loading = false;
      state.data = newStateData;
      // const newStateData = state.data.map((supplier) => {
      //   if (supplier.id === action.payload.id) {
      //     supplier = action.payload;
      //   }
      //   return supplier;
      // });
      // state.loading = false;
      // state.data = newStateData;
    },
    [UpdateSuppliersRequest.pending]: (state, action) => {
      state.loading = false;
    },
    [UpdateSuppliersRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [UpdateSuppliersRequest.fulfilled]: (state, action) => {
      // const newStateData = state.data.map((supplier) => {
      //   if (supplier.id === action.payload.id) {
      //     supplier = action.payload;
      //   }
      //   return supplier;
      // });
      // state.loading = false;
      // state.data = newStateData;
      const actState = { ...current(state).data };
      const newSuppliers = actState.suppliers.map((supplier) => {
        if (supplier.id === action.payload.id) {
          const newSupplier = action.payload;
          return newSupplier;
        }
        return supplier;
      });
      const newStateData = actState;
      newStateData.suppliers = newSuppliers;
      state.loading = false;
      state.data = newStateData;
    },
    [DeleteRepSupplierRequest.pending]: (state, action) => {
      state.loading = false;
    },
    [DeleteRepSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [DeleteRepSupplierRequest.fulfilled]: (state, action) => {
      const newStateData = state.data.map((supplier) => {
        const newSupplierData = supplier.representative.map((sr) => {
          if (sr.id === action.payload.id) return action.payload;
          return sr;
        });
        supplier.representative = newSupplierData;
        return supplier;
      });
      state.loading = false;
      state.data = newStateData;
    },
    [UpdateRepSupplierRequest.pending]: (state, action) => {
      state.loading = false;
    },
    [UpdateRepSupplierRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [UpdateRepSupplierRequest.fulfilled]: (state, action) => {
      const newStateData = state.data.map((supplier) => {
        const newSupplierData = supplier.representative.map((sr) => {
          if (sr.id === action.payload.id) return action.payload;
          return sr;
        });
        supplier.representative = newSupplierData;
        return supplier;
      });
      state.loading = false;
      state.data = newStateData;
    },
  },
});

export default suppliersSlice.reducer;
