import { configureStore } from '@reduxjs/toolkit';
// import logger from "redux-logger";
import sidebarReducer from './sidebar';
import supplierReducer from './supplier';
import clientReducer from './client';
import sellerReducer from './seller';
import sellerResumeReducer from './sellerResume';
import tableReducer from './tableItems';
import brandReducer from './brand';
import productReducer from './product';
import searchBrandReducer from './searchBrands';
import representativesReducer from './representative';
import infoSupplierReducer from './infoSupplier';
import newBuyOrderReducer from './newOrder';
import productPagesReducer from './productPageList';
import addOrderItem from './addOrderItems';
import searchSellersReducer from './searchSeller';
import searchClientsReducer from './searchClient';
import searchSuppliersReducer from './searchSupplier';
import searchMovementsReducer from './searchCurrentAcount';
import searchOrderssReducer from './searchOrders';
import OrdersAjustReducer from './orderAjust';
import OrdersAjustItemsReducer from './addAjustItems';
import buyOrderReducer from './selectedBuyOrder';
import controlOrdersReducer from './supplierControlOrder';
import selectControlOrdersReducer from './selectControlOrder';
import selectControlOrderItemssReducer from './selectControlOrderItems';
import pickingOrdersReducer from './clientPickingOrder';
import searchRepresReducer from './representativeSearch';
import getReport from './report';
import getDateReport from './dateReport';
import webSocketNotific from './webSocketNotification';
import selectProductReducer from './selectProduct';
import productClientReducer from './productsByClient';
import ncNoApplyReducer from './movNoApply';
import equivalencesReducers from './equivalences';
import otherUsersReducers from './otherUsers';
import filtersProductsSlice from './filtersProducts';
import filtersUsersSlice from './filtersUsers';
import filtersComisSlice from './filtersComis';
import searchUsers from './searchUsers';
import userSlice from './user';
import liquidationsReducer from './sellerLiquidations';
import filtersSellOrderSlice from './filtersSellOrder';
import filtersMovementsSlice from './filtersMovements';
import filtersBuyOrderSlice from './filtersBuyOrder';
import filtersPickingsSlice from './filtersPickings';
import selectBillSlice from './selectedBill';
import billItemsReducer from './billItems';
import pendingSaveReducer from './pendingSave';
import filterSellReportReducer from './filtersSellReports';
import filtersBrandReducer from './filtersBrands';
import brandResultsReducers from './searchBrandsExtra';
import filterPendingReducers from './filtersPending';
import pendingReducers from './pending';
import billsProductsReducers from './bilssByProducts';
import filterClosingSlice from './filtersClosing';
import closingSlice from './cloausing';
import supCurrAcSlice from './supCurrentAcount';
import filterSupMovementSlice from './filtersSupMovements';
import supPaymentOrderSlice from './supPaymentOrder';
import filterPaymentOrderSlice from './filtersPaymentOrder'
import sellPosOrderReducer from './sellPosOrder';

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/*logger*/),
  reducer: {
    user: userSlice,
    sidebar: sidebarReducer,
    supplier: supplierReducer,
    client: clientReducer,
    seller: sellerReducer,
    tableItems: tableReducer,
    brand: brandReducer,
    product: productReducer,
    searchBrand: searchBrandReducer,
    representatives: representativesReducer,
    infoSupplier: infoSupplierReducer,
    newBuyOrder: newBuyOrderReducer,
    productByPages: productPagesReducer,
    listOrderItems: addOrderItem,
    searchSellers: searchSellersReducer,
    searchClients: searchClientsReducer,
    searchSuppliers: searchSuppliersReducer,
    searchMovements: searchMovementsReducer,
    searchOrders: searchOrderssReducer,
    orderAjust: OrdersAjustReducer,
    orderAjustItems: OrdersAjustItemsReducer,
    buyOrder: buyOrderReducer,
    controlOrders: controlOrdersReducer,
    selectControlOrder: selectControlOrdersReducer,
    selectControlOrderItems: selectControlOrderItemssReducer,
    pickingOrders: pickingOrdersReducer,
    searchRepresentatives: searchRepresReducer,
    report: getReport,
    dateReport: getDateReport,
    newSellNotific: webSocketNotific,
    sellerResume: sellerResumeReducer,
    selectProduct: selectProductReducer,
    productsByClient: productClientReducer,
    movNoApply: ncNoApplyReducer,
    movNoApply: ncNoApplyReducer,
    equivalences: equivalencesReducers,
    otherUsers: otherUsersReducers,
    filterProduct: filtersProductsSlice,
    filterSellOrder: filtersSellOrderSlice,
    filterPickings: filtersPickingsSlice,
    filterBuyOrder: filtersBuyOrderSlice,
    filterUser: filtersUsersSlice,
    searchUsers: searchUsers,
    liquidations: liquidationsReducer,
    filterCom: filtersComisSlice,
    selectBill: selectBillSlice,
    billItems: billItemsReducer,
    filterMovementsOrder: filtersMovementsSlice,
    pendingSave: pendingSaveReducer,
    filterSellReport: filterSellReportReducer,
    filterBrand: filtersBrandReducer,
    brandResults: brandResultsReducers,
    filterPending: filterPendingReducers,
    pendings: pendingReducers,
    billsByProducts: billsProductsReducers,
    filterClosing: filterClosingSlice,
    closing: closingSlice,
    supCurrentAcount: supCurrAcSlice,
    filterSupMovement: filterSupMovementSlice,
    filterPaymentOrder: filterPaymentOrderSlice,
    supPaymentOrder: supPaymentOrderSlice,
    posSellOrder: sellPosOrderReducer
  },
});

export default store;
