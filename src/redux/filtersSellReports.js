import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageSize: 50,
  page: 1,
  rangeDate: null,
  clientId: null,
  brandId: null,
  code: null,
};

const filtersSellReportSlice = createSlice({
  name: 'filtersSellReport',
  initialState,
  reducers: {
    setFilterReport: (state, action) => {
      // action.payload es un {name: string, value: any}[]
      action.payload.map((obj) => {
        const { name, value } = obj;
        state[name] = value ? value : null;
      });
    },
    resetFilterReport: (state) => {
      state.pageSize = 50;
      state.page = 1;
      state.rangeDate = null;
      state.clientId = null;
      state.brandId = null;
      state.code = null;
    },
  },
});

export const { setFilterReport, resetFilterReport } =
  filtersSellReportSlice.actions;

export default filtersSellReportSlice.reducer;
