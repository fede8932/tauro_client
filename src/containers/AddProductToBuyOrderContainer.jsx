import React, { useEffect, useState } from 'react';
import AddProductToOrder from '../components/addProductToOrder/AddProductToOrder';
import { useForm } from 'react-hook-form';
import { searchProductRequest } from '../redux/product';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOrderItemsRequest,
  deleteOrderItemsRequest,
  getOrderItemsRequest,
  updateCantItemsRequest,
  updatePriceItemsRequest,
} from '../redux/addOrderItems';
import { getBuyOrderRequest } from '../redux/newOrder';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import {
  addAjustItemsRequest,
  deleteAjustItemsRequest,
  updatePriceAjustItemsRequest,
} from '../redux/addAjustItems';
import { getOrderAjust } from '../redux/orderAjust';
import {
  addRemOrderConfirmRequest,
  confirmBuyOrderRequest,
} from '../redux/searchOrders';

function AddProductToBuyOrderContainer(props) {
  const [showAlert, setShowAlert] = useState(false);
  const { type, sType } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const actualOrder = useSelector((state) => state.newBuyOrder);
  const orderAjust = useSelector((state) => state.orderAjust);
  const listOrderItems = useSelector((state) => state.listOrderItems);
  const methods = useForm();
  const dispatch = useDispatch();
  const searchProd = (data) => {
    data.supplierId = actualOrder.data.supplierId;
    dispatch(searchProductRequest(data));
  };
  const addProductToOrder = (brandProduct) => {
    const { product, brand } = brandProduct;
    const objSend = {
      productId: product.id,
      brandId: brand.id,
      orderId: actualOrder.data.id,
      cantidad: 1,
    };
    if (type !== 'ajuste') {
      dispatch(addOrderItemsRequest(objSend)).then(() => {
        dispatch(getBuyOrderRequest(actualOrder.data.id)).then(() => {
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 700);
        });
      });
    } else {
      (objSend.orderId = orderAjust.data.id),
        dispatch(addAjustItemsRequest(objSend)).then(() => {
          dispatch(getOrderAjust(actualOrder.data.id));
        });
    }
  };
  const infoProduct = (product) => {
    // console.log("anda", product, productPages, actualOrder);
  };
  const deleteOrder = (dataOrder) => {
    if (type !== 'ajuste') {
      dispatch(deleteOrderItemsRequest(dataOrder)).then(() => {
        dispatch(getBuyOrderRequest(actualOrder.data.id));
      });
    } else {
      dispatch(deleteAjustItemsRequest(dataOrder)).then(() => {
        dispatch(getOrderAjust(actualOrder.data.id));
      });
    }
  };
  const updateCantOrderItem = async (dataOrderItem) => {
    dispatch(updateCantItemsRequest(dataOrderItem)).then(() => {
      dispatch(getBuyOrderRequest(actualOrder.data.id));
    });
  };
  const updatePrecOrderItem = async (dataOrderItem) => {
    if (type !== 'ajuste') {
      dispatch(updatePriceItemsRequest(dataOrderItem)).then(() => {
        dispatch(getBuyOrderRequest(actualOrder.data.id));
      });
    } else {
      console.log(dataOrderItem);
      dispatch(updatePriceAjustItemsRequest(dataOrderItem)).then(() => {
        dispatch(getOrderAjust(actualOrder.data.id));
      });
    }
  };
  const confirmOrder = () => {
    Swal.fire({
      title: `Confirmar orden?`,
      text: 'Vas a enviar el pedido al proveedor',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(confirmBuyOrderRequest(actualOrder.data.id)).then((res) => {
          // console.log(res);
          if (res.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `No se pudo eliminar: ${res.error?.message}`,
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 2500,
            });
            return;
          } else {
            Swal.fire({
              title: 'Orden confirmada!',
              text: 'Tu orden se ha confirmado correctamente',
              icon: 'success',
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 1000,
            }).then(() => {
              navigate('/search/buy');
            });
          }
        });
      }
    });
  };

  const recepOrder = (orderId) => {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Vas a generar una orden de control',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(addRemOrderConfirmRequest({ orderId, remito: null }))
          .then((res) => {
            if (res.error) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Ocurrió un error: ${res.error}`,
              });
              return;
            }
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Nota de control generada con éxito',
              showConfirmButton: false,
              timer: 1000,
            });
            navigate('/search/buy');
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${err?.message}`,
            });
          });
      }
    });
  };

  useEffect(() => {
    if (!actualOrder?.data?.id) {
      navigate('/search/buy');
    }
  }, []);

  return (
    <AddProductToOrder
      {...props}
      methods={methods}
      onSubmit={searchProd}
      fnAdd={addProductToOrder}
      fnInfo={infoProduct}
      fnDelete={deleteOrder}
      fnUpdate={updateCantOrderItem}
      fnPrUpdate={updatePrecOrderItem}
      listOrder={listOrderItems.data}
      order={actualOrder}
      orderAjust={orderAjust}
      fnEnd={confirmOrder}
      path={pathname}
      goPath={useNavigate()}
      showAlert={showAlert}
      recep={recepOrder}
    />
  );
}

export default AddProductToBuyOrderContainer;
