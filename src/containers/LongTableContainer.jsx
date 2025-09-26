import React, { useState } from 'react';
import LongTableComponent from '../components/longTable/LongTableComponent';
import { useDispatch } from 'react-redux';
import { getBuyOrderRequest } from '../redux/newOrder';
import { useNavigate } from 'react-router';
import { getOrderItemsRequest } from '../redux/addOrderItems';
import { billHtml } from '../templates/bill.js';
import Swal from 'sweetalert2';
import {
  cancelOrderById,
  deleteOrderById,
  updateOrderConfirmById,
} from '../redux/searchOrders';
import { deleteOrderAjust } from '../request/orderAjustRequest';
import { getClientIdRequest } from '../redux/client';
import { printBillRequest } from '../request/orderRequest';
import QRCode from 'qrcode';

function LongTableContainer(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        dispatch(deleteOrderById(orderId)).then(() => {
          Swal.fire({
              title: 'Eliminado!',
              text: 'Has eliminado la orden exitosamente',
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
            deleteOrderAjust(orderId);
            Swal.fire({
              title: 'Orden cancelada!',
              text: 'Has cancelado la orden exitosamente',
              icon: 'success',
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 1000,
            });
          }
        );
      }
    });
  };
  const receptOrder = async (id) => {
    dispatch(getBuyOrderRequest(id)).then(() => {
      // navigate("/search/buy/addfac");
      navigate('/search/buy/confirm');
    });
  };
  const printBill = async (id) => {
    // Obtener datos de la factura
    const billData = await printBillRequest(id);
    const codigoQR = await QRCode.toDataURL(billData.url);
    // console.log(codigoQR);
    const order = props.buyOrderSelect.buyOrderSelected;
    // console.log(billData);
    // console.log(order);

    // Abrir una nueva ventana
    const nuevaVentana = window.open('', '', 'width=900,height=1250');

    // Crear un contenedor en la ventana nueva
    const container = nuevaVentana.document.createElement('div');
    nuevaVentana.document.body.appendChild(container);

    // Asignar la plantilla HTML al contenedor
    container.innerHTML = await billHtml(
      billData.billData.ResultGet,
      order,
      codigoQR
    );
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close(); // Cierra la ventana después de imprimir
    });
    // Imprimir la ventana
    nuevaVentana.print();
  };
  return (
    <LongTableComponent
      {...props}
      setBuyOrder={setOrder}
      deleteOrder={deleteOrder}
      cancelOrder={cancelOrder}
      reception={receptOrder}
      printBill={printBill}
    />
  );
}

export default LongTableContainer;
