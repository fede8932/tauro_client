import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchOrderComponent from '../components/searchOrder/SearchOrderComponent';
import { cancelOrderById, deleteOrderById } from '../redux/searchOrders';
import { getOrderById } from '../redux/selectedBuyOrder';
import Swal from 'sweetalert2';
import { getBuyOrderRequest } from '../redux/newOrder';
import { getOrderItemsRequest } from '../redux/addOrderItems';
import { useNavigate } from 'react-router';
import { getClientIdRequest } from '../redux/client';

function SearchOrderContainer(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const buyOrderSelected = useSelector((state) => state.buyOrder);
  const selectBuyOrder = (id) => {
    dispatch(getOrderById(id));
  };

  const deleteOrder = (orderId) => {
    Swal.fire({
      title: 'Estás Seguro?',
      text: 'Vas a eliminar la orden',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteOrderById(orderId)).then((res) => {
          if (res?.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `No se pudo eliminar: ${res.error?.message}`,
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 2500,
            });
            return;
          }
          Swal.fire({
            title: 'Eliminado!',
            text: 'Has eliminado la orden',
            icon: 'success',
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 1000,
          });
        });
      }
    });
  };

  const cancelOrder = (orderId) => {
    Swal.fire({
      title: 'Estás Seguro?',
      text: 'Vas a cancelar la orden',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(cancelOrderById({ orderId: orderId, status: 'Cancel' })).then(
          () => {
            Swal.fire(
              'Orden cancelada!',
              'Has cancelado la orden exitosamente',
              'success'
            );
          }
        );
      }
    });
  };

  const setOrder = (id, clientId) => {
    dispatch(getBuyOrderRequest(id)).then(({ payload }) => {
      dispatch(getOrderItemsRequest(payload.id)).then((res) => {
        if (!clientId) {
          navigate('/edit/buy');
        } else {
          dispatch(getClientIdRequest(clientId)).then(() => {
            navigate('/edit/sell');
          });
        }
      });
    });
  };

  return (
    <SearchOrderComponent
      {...props}
      setOrder={setOrder}
      cancelOrder={cancelOrder}
      deleteOrder={deleteOrder}
      buyOrderSelect={{
        buyOrderSelected: buyOrderSelected.data,
        selectBuyOrder: selectBuyOrder,
      }}
    />
  );
}

export default SearchOrderContainer;
