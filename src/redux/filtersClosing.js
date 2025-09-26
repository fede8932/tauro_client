import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: null,
  pending: true,
  pageSize: 50,
  page: 1,
};

const filterClosingSlice = createSlice({
  name: 'filtersClosing',
  initialState,
  reducers: {
    setFilterClosing: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetFilterclosing: (state) => {
      state.text = null;
      state.pageSize = 50;
      state.page = 1;
      state.pending = true;
    },
  },
});

export const { setFilterClosing, resetFilterclosing } =
filterClosingSlice.actions;

export default filterClosingSlice.reducer;
