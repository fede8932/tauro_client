import React, { useEffect, useState } from 'react';
import styles from './posComponent.module.css';
import Button from 'react-bootstrap/esm/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AutoComplete } from 'antd';
import efectIcon from '../../assets/auxIcon/efect.png';
import transfIcon from '../../assets/auxIcon/tranf.png';
import currAcountIcon from '../../assets/auxIcon/currAcount.png';
import qrIcon from '../../assets/auxIcon/qr.png';
import creditCardIcon from '../../assets/auxIcon/creditcard.png';
import {
  getClientIdRequestNew,
  getClientRequest,
  resetClientState,
  resetSelectClientState,
} from '../../redux/client';
import Swal from 'sweetalert2';
import PosProductsTable from '../tables/posProductsTable/PosProductsTable';
import { Popup } from 'semantic-ui-react';
import {
  finishSellPosAsync,
  resetPosSellOrderState,
  addLocalOrderItem,
  changeAmountOrderItem,
  delLocalOrderItem,
  getInitialOrderStorage,
  selectClientForOrder,
} from '../../redux/sellPosOrder';
import { numberToString, discountApplicationV2, convertImageToBase64 } from '../../utils';
import CustomModal from '../../commonds/customModal/CustomModal';
import FinishSellComponent from '../finishSellComponent/FinishSellComponent';
import { Offcanvas } from 'react-bootstrap';
import { rePrintPresRequest } from '../../request/orderRequest';
import logoBlase from '../../assets/logo/logoBlase.png';
import { presupHtml } from '../../templates/presupBlase';
import { remitHtml } from '../../templates/RemBlase';

function numberToStringV2(numero) {
  if (!numero && numero !== 0) return '0,00';
  return numberToString(numero);
}

function numberToStringV3(numero) {
  if (!numero && numero !== 0) return '0,00';
  return numberToString(numero);
}

function PosComponent(props) {
  const { deleteProduct } = props;

  const [drawer, setDrawer] = useState(false);
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

  const customerDiscounts = useSelector((state) => state.client)?.selectClient
    ?.customerDiscounts;

  const dispatch = useDispatch();

  const handleSelectPayMethod = (method) => {
    const cuentaCorrienteDisabled = !selectClientId || isConsumidorFinal;
    const methodDisabled = method === 'QR' || method === 'Tarjeta';
    if (methodDisabled) return;
    if (method === 'CuentaCorriente' && cuentaCorrienteDisabled) return;

    const newPayMethod = { ...payMethod };
    for (const key in newPayMethod) {
      if (method == key) {
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

  const addProduct = (productId, brandId, article, sellPrice, description) => {
    const discount = customerDiscounts?.find((cd) => cd.brandId == brandId);
    const sellWithDiscount = discount
      ? sellPrice * (1 + discount.porcentaje)
      : sellPrice;
    try {
      dispatch(
        addLocalOrderItem({
          productId,
          brandId,
          article,
          sellPrice: sellWithDiscount,
          description,
        })
      );
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: `Error: ${err.message}`,
      });
    }
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
        billType: 0, // Presupuesto
        payMethod: 0, // Efectivo por defecto
      };

      const res = await dispatch(finishSellPosAsync(sendData));
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.error.message,
        });
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

        const render = presupHtml(
          infoFacturaX,
          purchaseOrder,
          logoBase64,
          pagePresItems,
          pagePresNumber,
          totalPresPages
        );
        const containerPres = nuevaVentana.document.createElement('div');
        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(containerPres);
        if (pagePresNumber < totalPresPages) {
          const pageBreak = nuevaVentana.document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always';
          nuevaVentana.document.body.appendChild(pageBreak);
        }
      }

      // Remito
      const itemsRemPage = 14;
      const totalRemPages = Math.ceil(purchaseOrder.purchaseOrderItems.length / itemsRemPage) || 1;
      for (let i = 0; i < purchaseOrder.purchaseOrderItems.length; i += itemsRemPage) {
        const pageNumber = Math.floor(i / itemsRemPage) + 1;
        const pageItems = purchaseOrder.purchaseOrderItems.slice(i, i + itemsRemPage);

        const containerRem = nuevaVentana.document.createElement('div');
        containerRem.innerHTML = remitHtml(
          purchaseOrder,
          purchaseOrder.id,
          pageItems,
          pageNumber,
          totalRemPages,
          logoBase64,
          null
        );
        nuevaVentana.document.body.appendChild(containerRem);
        if (pageNumber < totalRemPages) {
          const pageBreak = nuevaVentana.document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always';
          nuevaVentana.document.body.appendChild(pageBreak);
        }
      }

      dispatch(resetPosSellOrderState());
      setDrawer(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo imprimir el presupuesto: ${err.message}`,
      });
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
    const selectPayMethod = Object.values(payMethod).some(
      (value) => value.enabled === true
    );
    const newFinishMode = {
      presup: !selectPayMethod,
      venta: selectPayMethod,
    };
    setFinishMode(newFinishMode);
  }, [payMethod]);

  // Limpia selección de Cuenta Corriente si está deshabilitada
  useEffect(() => {
    const cuentaCorrienteDisabled = !selectClientId || isConsumidorFinal;
    if (cuentaCorrienteDisabled && payMethod.CuentaCorriente.enabled) {
      setPayMethod({
        ...payMethod,
        CuentaCorriente: { ...payMethod.CuentaCorriente, enabled: false },
      });
    }
  }, [selectClientId, isConsumidorFinal]);

  useEffect(() => {
    dispatch(getInitialOrderStorage());
    dispatch(getClientRequest(true));
    return () => {
      resetClientState();
    };
  }, []);

  useEffect(() => {
    selectClientId
      ? dispatch(
          selectClientForOrder({ id: selectClientId, razonSocial: textClient })
        )
      : null;
    selectClientId ? dispatch(getClientIdRequestNew(selectClientId)) : null;
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

    if (textClient == '' || !textClient) {
      const reorderedClients = (() => {
        if (!clientArray) return [];
        const index = clientArray.findIndex((c) => c.id === 1);
        if (index === -1) return clientArray;

        const clientWithId1 = clientArray[index];
        const rest = clientArray
          .slice(0, index)
          .concat(clientArray.slice(index + 1));
        return [clientWithId1, ...rest];
      })();
      setListClient(reorderedClients);
      setSelectClientId(null);
      dispatch(resetSelectClientState());
      return;
    }
    setSelectClientId(order.clientId);
    let newClientsList = [...(clientArray || [])].filter((c) => {
      return (
        c.label && c.label?.toLowerCase().includes(textClient?.toLowerCase())
      );
    });
    const reorderedClients = (() => {
      const index = newClientsList.findIndex((c) => c.id === 1);
      if (index === -1) return newClientsList;

      const clientWithId1 = newClientsList[index];
      const rest = newClientsList
        .slice(0, index)
        .concat(newClientsList.slice(index + 1));
      return [clientWithId1, ...rest];
    })();
    setListClient(reorderedClients);
  }, [textClient, clients]);

  useEffect(() => {
    setSelectClientId(order.clientId);
    setTextClient(order.razonSocial ?? '');
  }, [order]);

  return (
    <div className={styles.formContainer}>
      <div className={styles.buttonContainer}>
        <div style={{ width: '250px' }}>
          <AutoComplete
            value={textClient}
            options={listClient}
            style={{
              width: '100%',
            }}
            onSelect={onSelect}
            onChange={onChange}
            placeholder="Seleccionar cliente"
          />
        </div>
        <span style={{ color: 'green', fontWeight: 600, fontSize: '15px' }}>
          Total:<span>$ {numberToStringV2(order?.subTotal * 1.21)}</span>
        </span>
        <Button variant="secondary" onClick={() => setDrawer(true)}>
          Detalle de orden
        </Button>
      </div>
      <div className={styles.table}>
        <PosProductsTable
          deleteProduct={deleteProduct}
          selectClientId={selectClientId}
          customerDiscounts={customerDiscounts}
          addProduct={addProduct}
        />
      </div>
      <Offcanvas
        placement="end"
        show={drawer}
        onHide={() => {
          setDrawer(false);
        }}
        {...props}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Orden de venta</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={styles.posContainer}>
            <div className={styles.orderHeader}>
              <h6 style={{ fontSize: '17px' }}>Nueva Orden</h6>
              <div>
                <Popup
                  content="Reiniciar orden"
                  trigger={
                    <Button
                      onClick={resetOrder}
                      variant="outline-warning"
                      style={{ marginLeft: '10px' }}
                    >
                      <i className="fa-solid fa-arrows-rotate"></i>
                    </Button>
                  }
                />
              </div>
            </div>
            <div>
              <AutoComplete
                value={textClient}
                options={listClient}
                style={{
                  width: '100%',
                }}
                onSelect={onSelect}
                onChange={onChange}
                placeholder="Seleccionar cliente"
              />
            </div>
            <div className={styles.orderDetail}>
              <div className={styles.tableCont}>
                <h5>Detalle de orden</h5>
                <div className={styles.listContainer}>
                  <div className={styles.headerList}>
                    <div className="celda header">Artículo</div>
                    <div className="celda header">Precio</div>
                    <div className="celda header">Cantidad</div>
                    <div className="celda header">Subtotal</div>
                  </div>
                  <div className={styles.bodyList}>
                    {order.items.map((item, i) => (
                      <div className={styles.rows} key={i}>
                        <div className="celda">
                          {item.article?.toUpperCase()}
                        </div>
                        <div className="celda">
                          $ {numberToString(item.sellPrice * 1.21)}
                        </div>
                        <div className="celda">
                          <input
                            className={styles.inputTable}
                            type="number"
                            step="1"
                            value={item.amount}
                            onChange={(e) => {
                              changeAmount(
                                item.productId,
                                item.brandId,
                                e.target.value
                              );
                            }}
                          />
                        </div>
                        <div className="celda">
                          <div className={styles.priceButCont}>
                            <span>
                              $ {numberToString(item.sellPrice * item.amount * 1.21)}
                            </span>
                            <button
                              onClick={() =>
                                dispatch(
                                  delLocalOrderItem({
                                    productId: item.productId,
                                    brandId: item.brandId,
                                  })
                                )
                              }
                              className={styles.delBtn}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.resumeCont}>
                <div className={styles.resumeItemDiv}>
                  <span>Subtotal</span>
                  <span>$ {numberToStringV2(order?.subTotal)}</span>
                </div>
                <div className={styles.resumeItemDiv}>
                  <span>Iva(21%)</span>
                  <span>$ {numberToStringV2(order?.subTotal * 0.21)}</span>
                </div>
                <div className={styles.resumeItemDiv}>
                  <span>Descuentos</span>
                  <span>$ 0.00</span>
                </div>
                <div className={styles.resumeItemDivTot}>
                  <span>Total</span>
                  <span>$ {numberToStringV3(order?.subTotal * 1.21)}</span>
                </div>
              </div>
            </div>
            <div className={styles.payCont}>
              <h6>Método de pago</h6>
              <div className={styles.methodPayCont}>
                <Popup
                  content="Pago en efectivo"
                  trigger={
                    <button
                      onClick={() => handleSelectPayMethod('Efectivo')}
                      className={`${styles[payMethod.Efectivo.enabled ? 'imgButtonSelect' : 'imgButton']}`}
                    >
                      <img src={efectIcon} alt="Efectivo" className={styles.payMethodImg} />
                    </button>
                  }
                />
                <Popup
                  content="Pago con QR (no disponible)"
                  trigger={
                    <button
                      disabled
                      onClick={() => handleSelectPayMethod('QR')}
                      className={styles.imgButtonDisabled}
                    >
                      <img src={qrIcon} alt="QR" className={styles.payMethodImg} style={{ opacity: 0.3 }} />
                    </button>
                  }
                />
                <Popup
                  content="Pago con transferencia"
                  trigger={
                    <button
                      onClick={() => handleSelectPayMethod('Transferencia')}
                      className={`${styles[payMethod.Transferencia.enabled ? 'imgButtonSelect' : 'imgButton']}`}
                    >
                      <img src={transfIcon} alt="Transferencia" className={styles.payMethodImg} />
                    </button>
                  }
                />
                <Popup
                  content="Pago con tarjeta (no disponible)"
                  trigger={
                    <button
                      disabled
                      onClick={() => handleSelectPayMethod('Tarjeta')}
                      className={styles.imgButtonDisabled}
                    >
                      <img src={creditCardIcon} alt="Tarjeta" className={styles.payMethodImg} style={{ opacity: 0.3 }} />
                    </button>
                  }
                />
                <Popup
                  content="Cuenta corriente"
                  trigger={
                    <button
                      disabled={selectClientId == null || isConsumidorFinal}
                      onClick={() => handleSelectPayMethod('CuentaCorriente')}
                      className={`${styles[payMethod.CuentaCorriente.enabled ? 'imgButtonSelect' : selectClientId == null || isConsumidorFinal ? 'imgButtonDisabled' : 'imgButton']}`}
                    >
                      <img 
                        src={currAcountIcon} 
                        alt="Cuenta Corriente" 
                        className={styles.payMethodImg}
                        style={{ opacity: selectClientId == null || isConsumidorFinal ? 0.3 : 1 }}
                      />
                    </button>
                  }
                />
              </div>
              <div className={styles.finishCont}>
                <Button
                  disabled={finishMode.presup && order.subTotal <= 0}
                  style={{ width: '49%' }}
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
                      style={{ width: '47%' }}
                      variant="success"
                    >
                      Finalizar venta
                    </Button>
                  }
                  bodyModal={(props) => (
                    <FinishSellComponent
                      payMethod={payMethod}
                      order={order}
                      {...props}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default PosComponent;
