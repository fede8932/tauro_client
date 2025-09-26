import React, { useEffect, useState } from 'react';
import AddProductToSellOrder from '../components/addProductoToSellOrder/AddProductToSellOrder';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { searchProductsRequest } from '../redux/product';
import {
  deleteSellOrder,
  getBuyOrderRequest,
  newBuyOrderRequest,
} from '../redux/newOrder';
import {
  addOrderItemsRequest,
  deleteSellOrderItemsRequest,
  resetAddOrderItems,
  updateCantItemsRequest,
} from '../redux/addOrderItems';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { updateClientStatusOrder } from '../request/orderRequest';
import { resetPendingSave, setPendingSave } from '../redux/pendingSave';

function AddProductToSellOrderContainer(props) {
  const [equivalenceId, setEquivalenceId] = useState(null);
  const { type } = props;
  const [text, setText] = useState(null);
  const methods = useForm();
  const actualOrder = useSelector((state) => state.newBuyOrder);

  const client = useSelector((state) => state.client);

  const navigate = useNavigate();
  const productPages = useSelector((state) => state.product);
  // const listOrderItems = useSelector((state) => state.listOrderItems);
  const dispatch = useDispatch();
  const searchProd = (data) => {
    setText(data.dataSearch);
    dispatch(searchProductsRequest({ page: 1, text: data.dataSearch }));
  };
  const changeFn = (page) => {
    dispatch(searchProductsRequest({ page: page, text: text }));
  };
  const addProductToOrder = (brandProduct) => {
    const { product, brand } = brandProduct;
    const objSend = {
      productId: product.id,
      brandId: brand.id,
      orderId: actualOrder.data.id,
      cantidad: 1,
      type: 'sell',
    };
    dispatch(addOrderItemsRequest(objSend)).then(() => {
      dispatch(getBuyOrderRequest(actualOrder.data.id));
      dispatch(setPendingSave({ pending: false, orderId: null }));
    });
  };
  const infoProduct = (product) => {};

  const deleteOrder = (dataOrder) => {
    dispatch(deleteSellOrderItemsRequest(dataOrder)).then(() => {
      dispatch(getBuyOrderRequest(actualOrder.data.id));
    });
  };

  const updateCantOrderItem = async (dataOrderItem) => {
    const sendInfo = { ...dataOrderItem };
    sendInfo.sell = true;
    dispatch(updateCantItemsRequest(sendInfo)).then(() => {
      dispatch(getBuyOrderRequest(actualOrder.data.id));
    });
  };

  const updatePrecOrderItem = async (dataOrderItem) => {
    dispatch(updatePriceItemsRequest(dataOrderItem)).then(() => {
      dispatch(getBuyOrderRequest(actualOrder.data.id));
    });
  };

  const cancelar = (id) => {
    Swal.fire({
      title: 'Estás seguro?',
      text: `${
        type == 'sale' ? 'La orden de venta' : 'El presupuesto'
      } se eliminará`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSellOrder(id)).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado...',
            text: `Has eliminado el presupuesto con éxito`,
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 2500,
          }).then(() => {
            navigate('/');
          });
        });
      }
    });
  };
  const updateOrder = (orderId, status) => {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Vas a confirmar una venta y generar orden de pedido',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        updateClientStatusOrder({
          id: orderId,
          status: status,
          clientId: client.selectClient?.id,
        }).then(() => {
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
      }
    });
  };

  useEffect(() => {
    if (type != 'sale') {
      dispatch(newBuyOrderRequest({ supplier: 'nosupplier' }));
    } else {
      dispatch(
        searchProductsRequest({
          page: 1,
          text: null,
          equivalenceId: equivalenceId,
        })
      );
    }
  }, [equivalenceId]);

  useEffect(() => {
    if (!actualOrder?.data?.id) {
      navigate('/search/sell');
    }
    return () => {
      dispatch(resetAddOrderItems(null));
      dispatch(resetPendingSave(null));
    };
  }, []);
  return (
    <AddProductToSellOrder
      {...props}
      equivalenceId={equivalenceId}
      setEquivalenceId={setEquivalenceId}
      methods={methods}
      onSubmit={searchProd}
      productPages={productPages}
      fnAdd={addProductToOrder}
      fnInfo={infoProduct}
      fnDelete={deleteOrder}
      fnUpdate={updateCantOrderItem}
      fnPrUpdate={updatePrecOrderItem}
      order={actualOrder}
      cancel={cancelar}
      confirmFn={updateOrder}
      changeFn={changeFn}
    />
  );
}

export default AddProductToSellOrderContainer;
