import React, { useEffect, useState } from 'react';
import './App.css';
import LoginView from './views/loginView/LoginView';
import NavbarContainer from './containers/NavbarContainer';
import SideBarContainer from './containers/SideBarContainer';
import { useDispatch, useSelector } from 'react-redux';
import { persistUser, persistUserMe } from './redux/user';
import AddUser from './views/addUser/AddUser';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashbord from './views/dashbord/Dashbord';
import AddClient from './views/addClient/AddClient';
import AddSupplier from './views/addSupplier/AddSupplier';
import AddBrand from './views/addBrand/AddBrand';
import AddProduct from './views/addProduct/AddProduct';
import SearchProduct from './views/searchProduct/SearchProduct';
import SearchBrand from './views/searchBrand/SearchBrand';
import NewBuyOrder from './views/newBuyOrder/NewBuyOrder';
import NewSellOrder from './views/newSellOrder/NewSellOrder';
import SearchSeller from './views/searchSeller/SearchSeller';
import SearchClient from './views/searchClient/SearchClient';
import SearchSupplier from './views/searchSupplier/SearchSupplier';
import SearchCurrentAcount from './views/searchCurrentAcount/SearchCurrentAcount';
import SearchBuyOrder from './views/searchOrder/SearchBuyOrder';
import AddFactView from './views/addFact/AddFactView';
import OrderAjust from './views/orderAjust/OrderAjust';
import SearchControlOrder from './views/searchControlOrder/SearchControlOrder';
import NewBudget from './views/newBudget/NewBudget';
import SearchSellOrder from './views/searchSellOrder/SearchSellOrder';
import SearchPickingOrder from './views/pickingOrder/SearchControlOrder';
import ConfirmBuy from './views/confirmBuyOrder/ConfirmBuy';
import SellReport from './views/sellReport/SellReport';
import * as signalR from '@microsoft/signalr';
import { searchSellOrderRequest } from './redux/searchOrders';
import { trueNotificStatus } from './redux/webSocketNotification';
import SellerAcount from './views/ClientAcount/SellerAcount';
import Equivalences from './views/equivalences/Equivalences';
import ProtectedView from './protected/protectedView/ProtectedView';
import AddOtherUser from './views/addOtherUser/AddUser';
import notifSound from './assets/notif/ding-126626.mp3';
import SearchUsers from './views/searchUsers/SearchUsers';
import BrandSale from './views/brandSale/BrandSale';
import BloquedModal from './components/bloquedModal/BloquedModal';
import ChangePass from './components/changePass/ChangePass';
import SellPending from './views/sellPending/SellPending';
import SearchClosing from './views/searchClosing/SearchClosing';
import ListPaymentOrderSupplier from './components/listPaymentOrderSupplier/ListPaymentOrderSupplier';

function App() {
  const signalHub = `${import.meta.env.VITE_API_URL}/${
    import.meta.env.VITE_SIGNALR_HUB
  }`;
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [render, setRender] = useState(false);
  let dataUser = useSelector((state) => state.user.data);
  let filterPickings = useSelector((state) => state.filterPickings);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(persistUserMe())
      .then((res) => {
        if (res.error?.message == 'Request failed with status code 401') {
          console.log('No autorizado');
        }
        setRender(true);
      })
      .catch((err) => console.log(err));
    /*dispatch(persistUser())
      .then(() => {
        setRender(true);
      })
      .catch((e) => {
        console.log(e);
      });*/
  }, []);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(signalHub) // La ruta del Hub de SignalR en tu servidor
      .build();

    connection
      .start()
      .then(() => console.log('Conexión establecida con SignalR'))
      .catch((error) => console.error(error));

    connection.on('NewSellOrder', (message) => {
      // console.log(`${message}`);
      if (message == 'clientOrderOk') {
        console.log(pathname);
        if (pathname == '/search/sell') {
          dispatch(searchSellOrderRequest(filterPickings));
        }
        dispatch(trueNotificStatus());
        const audio = new Audio(notifSound);
        audio.play().catch((error) => {
          console.error('Error al reproducir el sonido:', error);
        });
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div>
      {render ? (
        <div className="panelViewContainer">
          {dataUser == null ? (
            <LoginView />
          ) : (
            <>
              <BloquedModal title="Cambiar contraseña">
                <ChangePass />
              </BloquedModal>
              <NavbarContainer />
              <div className="panelSubContainer">
                <SideBarContainer />
                <div className={`viewContainer ${isOpen ? '' : 'big'}`}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ProtectedView listAccesss={[1]}>
                          <Dashbord />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="/dashbord"
                      element={
                        <ProtectedView listAccesss={[1]}>
                          <Dashbord />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="add/seller"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <AddUser />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="add/user"
                      element={
                        <ProtectedView listAccesss={[1]}>
                          <AddOtherUser />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="add/supplier"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <AddSupplier />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="add/client"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <AddClient initView={0} />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="edit/client/*"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <AddClient initView={1} />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="add/brand"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <AddBrand />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="add/product"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <AddProduct view="single" />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="add/products"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <AddProduct view="group" />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/product"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6, 7]}>
                          <SearchProduct />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/brand"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <SearchBrand />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="new/buy"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <NewBuyOrder estado={0} />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="edit/buy"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <NewBuyOrder estado={1} />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="edit/sell"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <NewSellOrder estado={1} type="sale" />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="new/sell"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <NewSellOrder estado={0} type="sale" />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/seller"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <SearchSeller />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/client/*"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <SearchClient />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/users"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <SearchUsers />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/supplier"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <SearchSupplier />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/supplier/representative"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <SearchSupplier />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/supplier/payments"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <ListPaymentOrderSupplier />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/acount/client/*"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <SearchCurrentAcount />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/closing"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <SearchClosing />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/acount/supplier/*"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <SearchCurrentAcount />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/buy"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <SearchBuyOrder />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/buy/addfac"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <AddFactView />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/buy/confirm"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <ConfirmBuy />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="buy/orden/ajuste"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <OrderAjust />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="control/orden"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6, 7]}>
                          <SearchControlOrder />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="picking/orden"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6, 7]}>
                          <SearchPickingOrder />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="new/pres"
                      element={
                        <ProtectedView listAccesss={[1, 2, 6]}>
                          <NewBudget estado={0} />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="search/sell"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <SearchSellOrder />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="report/sell"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5]}>
                          <SellReport />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="seller/acount/*"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <SellerAcount />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="equivalences/*"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <Equivalences />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="brand/sale/*"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <BrandSale />
                        </ProtectedView>
                      }
                    />
                    <Route
                      path="product/sale/*"
                      element={
                        <ProtectedView listAccesss={[1, 2]}>
                          <BrandSale type="product" />
                        </ProtectedView>
                      }
                    />
                    <Route path="pdf/aux" element={<billHtml />} />
                    <Route
                      path="pending"
                      element={
                        <ProtectedView listAccesss={[1, 2, 5, 6]}>
                          <SellPending />
                        </ProtectedView>
                      }
                    />
                  </Routes>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
