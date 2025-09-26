import React, { useState } from 'react';
import AddDataFac from '../components/addDataFac/AddDataFac';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { convertToDate, redondearADosDecimales } from '../utils';
import { addFacOrderConfirmRequest } from '../redux/searchOrders';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

function AddDataFacContainer(props) {
  const dispatch = useDispatch();

  const [fecha, setFecha] = useState('');
  const dataChange = (date, dateString) => {
    setFecha(dateString);
  };
  const order = useSelector((state) => state.newBuyOrder);
  const methods = useForm();
  const navigate = useNavigate();

  const addFac = (data) => {
    const { totalFac, noFac, code, ...sendData } = data;
    sendData.subTotal =
      code == 'A'
        ? redondearADosDecimales(parseFloat(totalFac) / 1.21)
        : parseFloat(totalFac);
    sendData.iva =
      code == 'A'
        ? redondearADosDecimales((parseFloat(totalFac) / 1.21) * 0.21)
        : 0;
    sendData.totalNoFac = noFac ? Number(noFac) : 0;
    sendData.fecha = convertToDate(fecha);
    dispatch(
      addFacOrderConfirmRequest({
        orderId: order.data.id,
        factura: sendData,
      })
    ).then((res) => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Actualización de orden exitosa',
        text: 'Se guardo la factura',
        showConfirmButton: false, // Oculta el botón "OK"
        timer: 1000,
      }).then(() => {
        methods.reset();
        navigate('/search/buy');
      });
    });
  };

  return (
    <AddDataFac
      {...props}
      methods={methods}
      addFac={addFac}
      order={order}
      dataChange={dataChange}
    />
  );
}

export default AddDataFacContainer;
