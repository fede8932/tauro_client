import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderModalViewComponent from '../components/orderModalView/OrderModalViewComponent';
import { getOrderById } from '../redux/selectedBuyOrder';

function OrderViewModalContainer(props) {
  const { orderId, ...rest } = props;
  const order = useSelector((state) => state.buyOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, []);

  return <OrderModalViewComponent {...rest} order={order.data} />;
}

export default OrderViewModalContainer;
