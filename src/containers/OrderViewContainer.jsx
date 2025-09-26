import React, { useEffect } from 'react';
import OrderViewComponent from '../components/orderView/OrderViewComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getBuyOrderRequest } from '../redux/newOrder';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { updateClientStatusOrder } from '../request/orderRequest';
import { confirmBuyOrderRequest } from '../redux/searchOrders';

function OrderViewContainer(props) {
  // console.log(props);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useSelector((state) => state.client);

  const buyOrderSelected = props.orderId ? useSelector((state) => state.newBuyOrder) : useSelector((state) => state.buyOrder);

  const addFact = (orderId) =>
    dispatch(getBuyOrderRequest(orderId)).then(() => {
      navigate('/search/buy/addfac');
    });
  const updateOrder = (orderId, status, type) => {
    // console.log(orderId, status, type);

    Swal.fire({
      title: 'Estás seguro?',
      text: 'Vas a confirmar una orden.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (type == 'Sell') {
          updateClientStatusOrder({
            id: orderId,
            status: status,
          }).then((res) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Orden de venta confirmada, generamos la orden de pedido',
              showConfirmButton: false,
              timer: 1000,
            }).then(() => {
              navigate('/picking/orden');
            });
          });
        } else {
          dispatch(confirmBuyOrderRequest(orderId)).then((res) => {
            if (res.error) {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Ocurrio un error: ${res.error?.message}`,
                showConfirmButton: false,
                timer: 2500,
              });
              return;
            }
            Swal.fire({
              position: 'center',
              icon: 'success',
              title:
                'Orden de compra confirmada, enviamos el pedido al proveedor por email',
              showConfirmButton: false,
              timer: 1000,
            }).then(() => {
              navigate('/control/orden');
            });
          });
        }
      }
    });
  };
  useEffect(() => {
    if(props.orderId){
      dispatch(getBuyOrderRequest(props.orderId))
    }
  }, [props.orderId])
  return (
    <OrderViewComponent
      {...props}
      addFact={addFact}
      confirmFn={updateOrder}
      order={buyOrderSelected.data}
    />
  );
}

export default OrderViewContainer;
