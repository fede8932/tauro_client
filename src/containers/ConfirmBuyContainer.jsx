import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { convertToDate, redondearADosDecimales } from '../utils';
import {
  addRemOrderConfirmRequest,
  updateOrderConfirmById,
} from '../redux/searchOrders';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { addOrderAjust, getOrderAjust } from '../redux/orderAjust';
import { updateStatusOrder } from '../request/orderRequest';
import ConfirmBuy from '../components/confirmBuy/ConfirmBuy';

function ConfirmBuyContainer(props) {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.newBuyOrder);
  const methods = useForm();
  const navigate = useNavigate();
  const addRem = async (orderId) => {
    const { value: formValues } = await Swal.fire({
      title: 'Numero de remito',
      html: `
      <input id="swal-input1" class="swal2-input">
    `,
      focusConfirm: false,
      preConfirm: () => {
        return [document.getElementById('swal-input1').value];
      },
    });
    if (formValues[0]) {
      dispatch(
        addRemOrderConfirmRequest({
          orderId: orderId,
          remito: formValues[0],
        })
      ).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Orden actualizada. Generemos una orden de control',
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          navigate('/control/orden');
        });
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Debes ingresar un numero de remito válido',
        icon: 'error',
        showConfirmButton: false, // Oculta el botón "OK"
        timer: 2500,
      });
    }
  };

  const ajustFn = () => {
    Swal.fire({
      title: 'Se gererará un ajuste en el pedido',
      text: 'Revisá si la factura corresponde a la orden o registrá un ajuste si es necesario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ajustar Orden',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(getOrderAjust(order.data.id)).then((res) => {
          if (res.payload.id) {
            navigate('/buy/orden/ajuste');
            return;
          }
          dispatch(addOrderAjust(order.data.id)).then(() => {
            updateStatusOrder({ id: order.data.id, status: 'Ajusted' });
            navigate('/buy/orden/ajuste');
          });
        });
      }
    });
  };
  return (
    <ConfirmBuy
      {...props}
      methods={methods}
      addRem={addRem}
      order={order}
      ajustFn={ajustFn}
    />
  );
}

export default ConfirmBuyContainer;
