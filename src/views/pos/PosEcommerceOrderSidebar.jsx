import React, { useEffect, useState } from 'react';
import styles from './posEcommerceOrderSidebar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AutoComplete } from 'antd';
import Button from 'react-bootstrap/esm/Button';
import { Popup } from 'semantic-ui-react';
import {
  getClientIdRequestNew,
  getClientRequest,
  resetSelectClientState,
} from '../../redux/client';
import {
  finishSellPosAsync,
  resetPosSellOrderState,
  changeAmountOrderItem,
  delLocalOrderItem,
  getInitialOrderStorage,
  selectClientForOrder,
} from '../../redux/sellPosOrder';
import { numberToString, convertImageToBase64 } from '../../utils';
import CustomModal from '../../commonds/customModal/CustomModal';
import FinishSellComponent from '../../components/finishSellComponent/FinishSellComponent';
import { rePrintPresRequest } from '../../request/orderRequest';
import Swal from 'sweetalert2';
import logoBlase from '../../assets/logo/logoBlase.png';
import { presupHtml } from '../../templates/presupBlase';
import { remitHtml } from '../../templates/RemBlase';

import efectIcon from '../../assets/auxIcon/efect.png';
import transfIcon from '../../assets/auxIcon/tranf.png';
import currAcountIcon from '../../assets/auxIcon/currAcount.png';
import qrIcon from '../../assets/auxIcon/qr.png';
import creditCardIcon from '../../assets/auxIcon/creditcard.png';

function numberToStringV2(numero) {
  if (!numero && numero !== 0) return '0,00';
  return numberToString(numero);
}

function PosEcommerceOrderSidebar({ addProduct }) {
  const dispatch = useDispatch();

  const [textClient, setTextClient] = useState('');
  const [listClient, setListClient] = useState([]);
  const [selectClientId, setSelectClientId] = useState(null);
  const [finishMode, setFinishMode] = useState({ presup: true, venta: false });
  const [payMethod, setPayMethod] = useState({
    Efectivo: { enabled: false, value: 0 },
    QR: { enabled: false, value: 1 },
    Transferencia: { enabled: false, value: 2 },
    Tarjeta: { enabled: false, value: 3 },
    CuentaCorriente: { enabled: false, value: 4 },
  });

  const clients = useSelector((state) => state.client).data;
  const { order } = useSelector((state) => state.posSellOrder);
  const isConsumidorFinal = (order?.razonSocial || '').toLowerCase() === 'consumidor final';
  const customerDiscounts = useSelector((state) => state.client)?.selectClient?.customerDiscounts;

  const handleSelectPayMethod = (method) => {
    const cuentaCorrienteDisabled = !selectClientId || isConsumidorFinal;
    const methodDisabled = method === 'QR' || method === 'Tarjeta';
    if (methodDisabled) return;
    if (method === 'CuentaCorriente' && cuentaCorrienteDisabled) return;

    const newPayMethod = { ...payMethod };
    for (const key in newPayMethod) {
      if (method === key) {
        newPayMethod[key].enabled = !newPayMethod[key].enabled;
      } else {
        newPayMethod[key].enabled = false;
      }
    }
    setPayMethod(newPayMethod);
  };

  const onChange = (d) => {
    setTextClient(d);
  };

  const onSelect = (value, options) => {
    setTextClient(options?.label ?? '');
    setSelectClientId(value);
  };

  const changeAmount = (productId, brandId, amount) => {
    if (amount < 1) return;
    dispatch(changeAmountOrderItem({ productId, brandId, amount }));
  };

  const printPresupuesto = async () => {
    try {
      if (!order.clientId || (order.items || []).length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos incompletos',
          text: 'Selecciona un cliente y agrega productos antes de imprimir.',
        });
        return;
      }

      const sendData = {
        clientId: order.clientId,
        items: order.items,
        billType: 0,
        payMethod: 0,
      };

      const res = await dispatch(finishSellPosAsync(sendData));
      if (res.error) {
        Swal.fire({ icon: 'error', title: 'Error', text: res.error.message });
        return;
      }

      const infoFacturaX = await rePrintPresRequest(res.payload.id);
      const purchaseOrder = infoFacturaX.purchaseOrder;
      const factPresItems = purchaseOrder.purchaseOrderItems.filter((poi) => !poi.fact);
      const itemsPerPage = 10;
      const totalPresPages = Math.ceil(factPresItems.length / itemsPerPage) || 1;
      const logoBase64 = await convertImageToBase64(logoBlase);

      let nuevaVentana = window.open('', '', 'width=900,height=1250');

      for (let i = 0; i < factPresItems.length; i += itemsPerPage) {
        const pagePresNumber = Math.floor(i / itemsPerPage) + 1;
        const pagePresItems = factPresItems.slice(i, i + itemsPerPage);
        const render = presupHtml(infoFacturaX, purchaseOrder, logoBase64, pagePresItems, pagePresNumber, totalPresPages);
        const containerPres = nuevaVentana.document.createElement('div');
        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(containerPres);
        if (pagePresNumber < totalPresPages) {
          const pageBreak = nuevaVentana.document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always';
          nuevaVentana.document.body.appendChild(pageBreak);
        }
      }

      const itemsRemPage = 14;
      const totalRemPages = Math.ceil(purchaseOrder.purchaseOrderItems.length / itemsRemPage) || 1;
      for (let i = 0; i < purchaseOrder.purchaseOrderItems.length; i += itemsRemPage) {
        const pageNumber = Math.floor(i / itemsRemPage) + 1;
        const pageItems = purchaseOrder.purchaseOrderItems.slice(i, i + itemsRemPage);
        const containerRem = nuevaVentana.document.createElement('div');
        containerRem.innerHTML = remitHtml(purchaseOrder, purchaseOrder.id, pageItems, pageNumber, totalRemPages, logoBase64, null);
        nuevaVentana.document.body.appendChild(containerRem);
        if (pageNumber < totalRemPages) {
          const pageBreak = nuevaVentana.document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always';
          nuevaVentana.document.body.appendChild(pageBreak);
        }
      }

      dispatch(resetPosSellOrderState());
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: `No se pudo imprimir el presupuesto: ${err.message}` });
    }
  };

  const resetOrder = () => {
    dispatch(resetPosSellOrderState());
    setPayMethod({
      Efectivo: { enabled: false, value: 0 },
      QR: { enabled: false, value: 1 },
      Transferencia: { enabled: false, value: 2 },
      Tarjeta: { enabled: false, value: 3 },
      CuentaCorriente: { enabled: false, value: 4 },
    });
  };

  useEffect(() => {
    const selectPayMethod = Object.values(payMethod).some((v) => v.enabled === true);
    setFinishMode({ presup: !selectPayMethod, venta: selectPayMethod });
  }, [payMethod]);

  useEffect(() => {
    const cuentaCorrienteDisabled = !selectClientId || isConsumidorFinal;
    if (cuentaCorrienteDisabled && payMethod.CuentaCorriente.enabled) {
      setPayMethod((prev) => ({
        ...prev,
        CuentaCorriente: { ...prev.CuentaCorriente, enabled: false },
      }));
    }
  }, [selectClientId, isConsumidorFinal]);

  useEffect(() => {
    dispatch(getInitialOrderStorage());
    dispatch(getClientRequest(true));
  }, []);

  useEffect(() => {
    if (selectClientId) {
      dispatch(selectClientForOrder({ id: selectClientId, razonSocial: textClient }));
      dispatch(getClientIdRequestNew(selectClientId));
    }
    setPayMethod({
      Efectivo: { enabled: false, value: 0 },
      QR: { enabled: false, value: 1 },
      Transferencia: { enabled: false, value: 2 },
      Tarjeta: { enabled: false, value: 3 },
      CuentaCorriente: { enabled: false, value: 4 },
    });
  }, [selectClientId]);

  useEffect(() => {
    const clientArray = Array.isArray(clients)
      ? clients
      : Array.isArray(clients?.list)
        ? clients.list
        : [];

    if (!textClient) {
      const reordered = (() => {
        if (!clientArray) return [];
        const idx = clientArray.findIndex((c) => c.id === 1);
        if (idx === -1) return clientArray;
        const first = clientArray[idx];
        return [first, ...clientArray.slice(0, idx), ...clientArray.slice(idx + 1)];
      })();
      setListClient(reordered);
      setSelectClientId(null);
      dispatch(resetSelectClientState());
      return;
    }
    setSelectClientId(order.clientId);
    let filtered = [...(clientArray || [])].filter(
      (c) => c.label && c.label.toLowerCase().includes(textClient.toLowerCase())
    );
    const idx = filtered.findIndex((c) => c.id === 1);
    if (idx > -1) {
      const first = filtered[idx];
      filtered = [first, ...filtered.slice(0, idx), ...filtered.slice(idx + 1)];
    }
    setListClient(filtered);
  }, [textClient, clients]);

  useEffect(() => {
    setSelectClientId(order.clientId);
    setTextClient(order.razonSocial ?? '');
  }, [order]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h6 className={styles.headerTitle}>Orden de venta</h6>
        <Popup
          content="Reiniciar orden"
          trigger={
            <button onClick={resetOrder} className={styles.resetBtn}>
              <i className="fa-solid fa-arrows-rotate" />
            </button>
          }
        />
      </div>

      <div className={styles.clientSelect}>
        <AutoComplete
          value={textClient}
          options={listClient}
          style={{ width: '100%' }}
          onSelect={onSelect}
          onChange={onChange}
          placeholder="Seleccionar cliente"
        />
      </div>

      <div className={styles.orderContent}>
        <div className={styles.orderDetail}>
          <h5 className={styles.sectionTitle}>Detalle de orden</h5>
          <div className={styles.listContainer}>
            <div className={styles.headerList}>
              <span>Artículo</span>
              <span>Precio</span>
              <span>Cant.</span>
              <span>Subtotal</span>
            </div>
            <div className={styles.bodyList}>
              {order.items.map((item, i) => (
                <div className={styles.row} key={`${item.productId}-${item.brandId}`}>
                  <span className={styles.rowArticle}>{item.article?.toUpperCase()}</span>
                  <span className={styles.rowPrice}>$ {numberToString(item.sellPrice * 1.21)}</span>
                  <input
                    className={styles.qtyInput}
                    type="number"
                    step="1"
                    value={item.amount}
                    onChange={(e) => changeAmount(item.productId, item.brandId, e.target.value)}
                  />
                  <span className={styles.rowSubtotal}>
                    $ {numberToString(item.sellPrice * item.amount * 1.21)}
                    <button
                      onClick={() => dispatch(delLocalOrderItem({ productId: item.productId, brandId: item.brandId }))}
                      className={styles.delBtn}
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </span>
                </div>
              ))}
              {order.items.length === 0 && (
                <div className={styles.emptyItems}>
                  <i className="fa-solid fa-cart-plus" />
                  <span>Agregue productos a la orden</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.resumeSection}>
          <div className={styles.resumeRow}>
            <span>Subtotal</span>
            <span>$ {numberToStringV2(order?.subTotal)}</span>
          </div>
          <div className={styles.resumeRow}>
            <span>IVA (21%)</span>
            <span>$ {numberToStringV2(order?.subTotal * 0.21)}</span>
          </div>
          <div className={styles.resumeRow}>
            <span>Descuentos</span>
            <span>$ 0.00</span>
          </div>
          <div className={styles.resumeTotal}>
            <span>Total</span>
            <span>$ {numberToStringV2(order?.subTotal * 1.21)}</span>
          </div>
        </div>

        <div className={styles.paySection}>
          <h6 className={styles.sectionTitle}>Método de pago</h6>
          <div className={styles.payMethods}>
            <Popup content="Efectivo" trigger={
              <button onClick={() => handleSelectPayMethod('Efectivo')}
                className={payMethod.Efectivo.enabled ? styles.payBtnActive : styles.payBtn}>
                <img src={efectIcon} alt="Efectivo" className={styles.payImg} />
              </button>
            } />
            <Popup content="QR (no disponible)" trigger={
              <button disabled className={styles.payBtnDisabled}>
                <img src={qrIcon} alt="QR" className={styles.payImg} style={{ opacity: 0.3 }} />
              </button>
            } />
            <Popup content="Transferencia" trigger={
              <button onClick={() => handleSelectPayMethod('Transferencia')}
                className={payMethod.Transferencia.enabled ? styles.payBtnActive : styles.payBtn}>
                <img src={transfIcon} alt="Transferencia" className={styles.payImg} />
              </button>
            } />
            <Popup content="Tarjeta (no disponible)" trigger={
              <button disabled className={styles.payBtnDisabled}>
                <img src={creditCardIcon} alt="Tarjeta" className={styles.payImg} style={{ opacity: 0.3 }} />
              </button>
            } />
            <Popup content="Cuenta corriente" trigger={
              <button
                disabled={!selectClientId || isConsumidorFinal}
                onClick={() => handleSelectPayMethod('CuentaCorriente')}
                className={
                  payMethod.CuentaCorriente.enabled
                    ? styles.payBtnActive
                    : !selectClientId || isConsumidorFinal
                      ? styles.payBtnDisabled
                      : styles.payBtn
                }
              >
                <img src={currAcountIcon} alt="Cuenta Corriente" className={styles.payImg}
                  style={{ opacity: !selectClientId || isConsumidorFinal ? 0.3 : 1 }} />
              </button>
            } />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            disabled={finishMode.presup && order.subTotal <= 0}
            style={{ width: '48%', fontSize: '13px' }}
            variant="outline-primary"
            onClick={printPresupuesto}
          >
            Imprimir presupuesto
          </Button>
          <CustomModal
            title={
              payMethod.CuentaCorriente.enabled
                ? 'Cuenta corriente'
                : payMethod.Transferencia.enabled
                  ? 'Pago con transferencia'
                  : 'Pago en efectivo'
            }
            size="sm"
            actionButton={
              <Button
                disabled={!finishMode.venta || order.subTotal <= 0}
                style={{ width: '48%', fontSize: '13px' }}
                variant="success"
              >
                Finalizar venta
              </Button>
            }
            bodyModal={(props) => (
              <FinishSellComponent payMethod={payMethod} order={order} {...props} />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default PosEcommerceOrderSidebar;
