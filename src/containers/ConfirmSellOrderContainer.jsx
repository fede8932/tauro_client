import React, { useEffect } from 'react';
import ConfirmSellOrder from '../components/confirmSellOrder/ConfirmSellOrder';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { confirmSellOrderWBillRequest } from '../redux/searchOrders';
import { redondearADosDecimales } from '../utils';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

function ConfirmSellOrderContainer(props) {
  const { closeModal, ...rest } = props;
  const dispatch = useDispatch();
  const methods = useForm();
  const navigate = useNavigate();

  const confirmOrder = (data) => {
    const totalFacturado = data.code == 'P' ? 0 : Number(data.subtotal);
    const facturaType = data.code;
    const facturaNumber = data.code == 'P' ? '' : data.numFac;
    const noFacturado = Number(data.noFact);
    if (totalFacturado + noFacturado <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'El monto debe ser mayor a cero',
        showConfirmButton: false, // Oculta el botón "OK"
        timer: 2500,
      });
    } else {
      if (totalFacturado > 0) {
        let sendData = {
          type: 'Factura',
          numero_factura: facturaNumber,
          tipo_de_factura: facturaType,
          importe_gravado:
            facturaType == 'C'
              ? Number(data.subtotal)
              : redondearADosDecimales(Number(data.subtotal) / 1.21),
          importe_excento: 0,
          ivaCalculado:
            facturaType == 'C'
              ? 0
              : redondearADosDecimales((Number(data.subtotal) / 1.21) * 0.21),
          purchaseOrderId: rest.order.id,
          salePoint: 1,
          importe_no_facturado: noFacturado,
        };
        dispatch(confirmSellOrderWBillRequest(sendData)).then((res) => {
          console.log(res);
          closeModal();
          navigate('/picking/orden');
        });
      }
    }
  };

  return (
    <ConfirmSellOrder methods={methods} {...rest} onSubmit={confirmOrder} />
  );
}

export default ConfirmSellOrderContainer;
