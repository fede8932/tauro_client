import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as sellerRequest from '../request/sellerRequest';
const sellerState = {
  loading: false,
  data: { registros: [], selectTotal: 0, selectComision: 0, checkAll: false },
  error: '',
};
export const getSellerResumeRequest = createAsyncThunk(
  'GET_SELLER_RESUME',
  sellerRequest.getSellerResume
);
export const getResumeLiquidationRequest = createAsyncThunk(
  'GET_LIQUIDATION_RESUME',
  sellerRequest.getResumeLiquidation
);

const sellerResumeSlice = createSlice({
  name: 'sellerResume',
  initialState: sellerState,
  reducers: {
    setMarc: (state, action) => {
      const { id } = action.payload;
      // console.log(id);
      let newReg = state.data.registros.map((reg) => {
        if (id == reg.id) {
          reg.marc = !reg.marc;
        }
        return reg;
      });
      state.data.selectTotal = newReg.reduce((tot, reg) => {
        if (reg.marc && !reg.liquidada) {
          return tot + reg.monto;
        }
        return tot;
      }, 0);
      state.data.selectComision = newReg.reduce((tot, reg) => {
        if (reg.marc && !reg.liquidada) {
          return tot + reg.comision;
        }
        return tot;
      }, 0);
    },
    setAllMarc: (state, action) => {
      let newReg = state.data.registros.map((reg) => {
        if (!reg.liquidada) {
          reg.marc = action.payload;
        }
        return reg;
      });
      state.data.selectTotal = newReg.reduce((tot, reg) => {
        if (reg.marc && !reg.liquidada) {
          return tot + reg.monto;
        }
        return tot;
      }, 0);
      state.data.selectComision = newReg.reduce((tot, reg) => {
        if (reg.marc && !reg.liquidada) {
          return tot + reg.comision;
        }
        return tot;
      }, 0);
      state.data.checkAll = action.payload
    },
    resetMarc: (state, action) => {
      const newReg = state.data.registros.map((reg) => {
        if (action.payload.includes(reg.id)) {
          reg.liquidada = true;
        }
        return reg;
      });
      state.data.selectTotal = 0;
      state.data.selectComision = 0;
      state.data.registros = newReg;
      state.data.checkAll = false;
    },
  },
  extraReducers: {
    [getSellerResumeRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getSellerResumeRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getSellerResumeRequest.fulfilled]: (state, action) => {
      let newData = { ...action.payload };
      newData.registros = newData.registros.map((order) => {
        order.marc = order.liquidada;
        return order;
      });
      newData.selectTotal = 0;
      newData.selectComision = 0;
      state.loading = false;
      state.data = newData;
    },
    [getResumeLiquidationRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getResumeLiquidationRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getResumeLiquidationRequest.fulfilled]: (state, action) => {
      let newData = { ...action.payload };
      newData.registros = newData.registros.map((order) => {
        order.marc = order.liquidada;
        return order;
      });
      newData.selectTotal = 0;
      newData.selectComision = 0;
      state.loading = false;
      state.data = newData;
    },
  },
});

export const { setMarc, resetMarc, setAllMarc } = sellerResumeSlice.actions;

export default sellerResumeSlice.reducer;
