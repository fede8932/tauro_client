import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productRequest from '../request/productRequest';
import * as equivalencesRequest from '../request/equivalencesRequest';
const userState = {
  loading: false,
  product: null,
  products: { list: [], totalRows: 0, totalPages: 0 },
  selects: [],
  error: '',
  equivalence: null,
  equivalencesProducts: [],
};

export const getProductListRequest = createAsyncThunk(
  'LIST_EQ_PROD',
  productRequest.searchProducts
);

export const getProductRequest = createAsyncThunk(
  'EQUIV_PRODUCTO',
  productRequest.getProductId
);

export const getEquivalenceByProductId = createAsyncThunk(
  'LIST_EQUIV',
  equivalencesRequest.getEquivalennceByProductId
);

export const createEquivalenceRequest = createAsyncThunk(
  'CREATE_EQUIV',
  equivalencesRequest.createEquivalence
);

export const editDescriptionRequest = createAsyncThunk(
  'EDIT_DESC_EQUIV',
  equivalencesRequest.editDescriptionEquivalence
);

export const reemplaceEquivRequest = createAsyncThunk(
  'EDIT_EQUIV',
  equivalencesRequest.editEquivalence
);

export const toggleMarcRec = createAsyncThunk('TOGGLE_MARC_PROD', (id) => id);

const equivalencesSlice = createSlice({
  name: 'esquivalences',
  initialState: userState,
  reducers: {
    resetEquivState(state, action) {
      state.loading = false;
      state.product = null;
      state.products = { list: [], totalRows: 0, totalPages: 0 };
      state.selects = [];
      state.error = '';
      state.equivalence = null;
      state.equivalencesProducts = [];
    },
  },
  extraReducers: {
    [editDescriptionRequest.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [editDescriptionRequest.fulfilled]: (state, action) => {
      let equiv = state.equivalence;
      equiv.description = action.payload;
    },
    [createEquivalenceRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [createEquivalenceRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [createEquivalenceRequest.fulfilled]: (state, action) => {
      let equivalence = action.payload;
      state.error = '';
      const prodInEquiv = equivalence.products;
      equivalence.products = [];
      state.loading = false;
      state.equivalencesProducts = prodInEquiv;
      state.equivalence = equivalence;
    },
    [getProductRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getProductRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getProductRequest.fulfilled]: (state, action) => {
      state.error = '';
      let selects = [];
      selects.push(action.payload);
      state.loading = false;
      state.product = action.payload;
      state.selects = selects;
    },
    [getProductListRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getProductListRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getProductListRequest.fulfilled]: (state, action) => {
      state.error = '';
      let listData = action.payload;
      let selected = state.selects;
      const prod = state.product;
      listData.list.map((p) => {
        const indexSelects = state.selects.findIndex((sp) => sp.id == p.id);
        const indexEquiv = state.equivalencesProducts.findIndex(
          (ep) => ep.id == p.id
        );
        if (indexSelects == -1 && indexEquiv != -1) {
          selected.push(state.equivalencesProducts[indexEquiv]);
        }
        if (p.id == prod.id || indexSelects != -1 || indexEquiv != -1) {
          p.marc = true;
        } else {
          p.marc = false;
        }
      });
      state.loading = false;
      state.products = listData;
    },
    [toggleMarcRec.fulfilled]: (state, action) => {
      state.error = '';
      const id = action.payload;
      if (id == state.product?.id) return;
      let selected = state.selects;
      let equiv = state.equivalencesProducts;
      let productList = state.products;
      const indexClikProduct = productList.list.findIndex((p) => p.id == id);
      productList.list[indexClikProduct].marc =
        !productList.list[indexClikProduct].marc;
      const indexInSelected = selected.findIndex((sp) => sp.id == id);
      const indexInEquiv = equiv.findIndex((sp) => sp.id == id);
      if (indexInEquiv > -1) {
        equiv.splice(indexInEquiv, 1);
      }
      if (indexInSelected > -1) {
        selected.splice(indexInSelected, 1);
      } else {
        productList.list[indexClikProduct].new = true;
        selected.push(productList.list[indexClikProduct]);
        equiv.push(productList.list[indexClikProduct]);
      }
      state.selects = selected;
      state.products = productList;
    },
    [getEquivalenceByProductId.pending]: (state, action) => {
      state.loading = true;
    },
    [getEquivalenceByProductId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getEquivalenceByProductId.fulfilled]: (state, action) => {
      state.error = '';
      let equivalence = action.payload;
      const prodInEquiv = equivalence.products;
      equivalence.products = [];
      state.loading = false;
      state.equivalencesProducts = prodInEquiv;
      state.equivalence = equivalence;
      state.selects = prodInEquiv;
    },
    [reemplaceEquivRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [reemplaceEquivRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [reemplaceEquivRequest.fulfilled]: (state, action) => {
      let equivalence = action.payload;
      const prodInEquiv = equivalence.products.map((pe) => {
        pe.new = false;
        return pe;
      });
      equivalence.products = [];
      state.error = '';
      state.equivalence = equivalence;
      state.equivalencesProducts = prodInEquiv;
      state.loading = false;
    },
  },
});

export const { resetEquivState } = equivalencesSlice.actions;

export default equivalencesSlice.reducer;
