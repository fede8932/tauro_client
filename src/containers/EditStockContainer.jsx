import React, { useEffect, useState } from 'react';
import EditStock from '../components/editStock/EditStock';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetControlItems,
  selectControlOrderItemsRequest,
  updateItemsRequest,
  updteControlItem,
} from '../redux/selectControlOrderItems';
import { updateStock } from '../request/productRequest';
import { updateControlOrderRequest } from '../redux/supplierControlOrder';
import Swal from 'sweetalert2';

function EditStockContainer({ id, close }) {
  const controlOrder = useSelector((state) => state.selectControlOrderItems);
  const dispatch = useDispatch();

  const updateAmount = async (data) => {
    dispatch(updteControlItem(data));
  };
  const [loading, setLoading] = useState(false);
  const confirm = async (controlOrderId) => {
    setLoading(true);
    try {
      await updateStock({ items: controlOrder.data.items, controlOrderId: controlOrderId });
      dispatch(updateControlOrderRequest(controlOrderId)).then(() => {
        close();
      }).then(()=> {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Se actualizó el stock de los items controlados",
          showConfirmButton: false,
          timer: 1000
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Error: ${err.message}`,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(
      selectControlOrderItemsRequest({
        id: id,
      })
    );
    return () => {
      dispatch(resetControlItems(null));
    };
  }, []);

  return (
    <EditStock
      order={controlOrder.data}
      onClick={confirm}
      updateAmount={updateAmount}
      loading={loading}
    />
  );
}

export default EditStockContainer;
