import React, { useEffect } from 'react';
import FormSelectClientSellOrder from '../components/formSelectSellOrder/FormSelectClientSellOrder';
import { useDispatch, useSelector } from 'react-redux';
import { getClientByTextRequest } from '../redux/searchClient';
import Swal from 'sweetalert2';
import { updateClientStatusOrder } from '../request/orderRequest';
import { useNavigate } from 'react-router';
import { newSellOrderRequest } from '../redux/newOrder';
import { setPendingSave } from '../redux/pendingSave';

function FormSelectClientContainer(props) {
  const { type, nextFn } = props;
  const navigate = useNavigate();
  const { selectClient } = useSelector((state) => state.client);
  const order = useSelector((state) => state.newBuyOrder);
  const dispatch = useDispatch();
  const searchClient = (text) => {
    dispatch(getClientByTextRequest(text.campo));
  };
  // console.log(order);
  const confirm = () => {
    if (type != 'sale') {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Vas a confirmar una venta y ya no podrás modificarla.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, confirmar',
      }).then((result) => {
        if (result.isConfirmed) {
          updateClientStatusOrder({
            id: order.data.id,
            status: 'Confirm',
            clientId: selectClient?.id,
          }).then(() => {
            Swal.fire({
              title: 'Orden de venta!',
              text: 'Se ha registrado la venta',
              icon: 'success',
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 1000,
            }).then(() => {
              navigate('/');
            });
          });
        }
      });
    } else {
      dispatch(newSellOrderRequest(selectClient?.id)).then(({ payload }) => {
        dispatch(setPendingSave({ pending: true, orderId: payload.id }));
        nextFn(1);
      });
    }
  };

  return (
    <FormSelectClientSellOrder
      {...props}
      searchClient={searchClient}
      confirmFn={confirm}
    />
  );
}

export default FormSelectClientContainer;
