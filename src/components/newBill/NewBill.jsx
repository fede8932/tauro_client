import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './newBill.module.css';
import {
  convertImageToBase64,
  cuitTransformToNumber,
  dateConverter,
  numberToString,
  redondearADosDecimales,
  waitForImagesToLoad,
} from '../../utils';
import CustomTable from '../../commonds/table/CustomTable';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  confirmSellOrderRequest,
  searchSellOrderRequest,
} from '../../redux/searchOrders';
import { getOrderItemsRequest } from '../../redux/addOrderItems';
import { useNavigate } from 'react-router';
import {
  getDiscOfficialRequest,
  printBillRequest,
  printPresRequest,
} from '../../request/orderRequest';
import QRCode from 'qrcode';
import { billHtml } from '../../templates/bill';
import { presupHtml } from '../../templates/presupBlase';
import { remitHtml } from '../../templates/RemBlase';
import Swal from 'sweetalert2';
import logoAfip from '../../assets/afip/logo-vector-afip.jpg';
import logoBlase from '../../assets/logo/logoBlase.png';
import CustomModal from '../../commonds/customModal/CustomModal';
import InvoiceForm from '../newBillDiscount/NewBillDiscount';
import { Label, LabelGroup, Popup } from 'semantic-ui-react';
import { applyBillingSnapshot } from '../../utils/printPosBill';

const TotalComponent = (props) => {
  const { client, order, closeModal, discountList, removeDiscount, isMeli } = props;
  const listOrder = useSelector((state) => state.listOrderItems).data;
  const loading = useSelector((state) => state.searchOrders.loading);
  const filterSellOrder = useSelector((state) => state.filterSellOrder);

  const [fiscalCondition, setFiscalCondition] = useState('Final');
  const [dni, setDni] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const effectiveList = isMeli
    ? (listOrder || []).map((i) => ({ ...i, fact: true }))
    : listOrder || [];

  const totalFacturado = useCallback(
    () =>
      effectiveList.reduce((accumulator, object) => {
        if (object.fact) {
          return accumulator + object.sellPrice * object.amount * 1.21;
        } else {
          return accumulator;
        }
      }, 0),
    [effectiveList]
  );
  const totalNoFacturado = useCallback(
    () =>
      isMeli
        ? 0
        : (listOrder || []).reduce((accumulator, object) => {
            if (!object.fact) {
              return accumulator + object.sellPrice * object.amount;
            } else {
              return accumulator;
            }
          }, 0),
    [isMeli, listOrder]
  );

  const totalDesFacturado = useCallback(
    () =>
      discountList.reduce((accumulator, object) => {
        if (object.oficial) {
          return accumulator + object.amount;
        } else {
          return accumulator;
        }
      }, 0),
    [discountList]
  );

  const totalDesNoFacturado = useCallback(
    () =>
      discountList.reduce((accumulator, object) => {
        if (!object.oficial) {
          return accumulator + object.amount;
        } else {
          return accumulator;
        }
      }, 0),
    [discountList]
  );

  const printBill = async (order, totalFacturado, totalNoFacturado) => {
    let numRemito;
    const logoAfipBase64 = await convertImageToBase64(logoAfip);
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);

    const nuevaVentana = window.open('', '', 'width=900,height=1250');
    // Obtener datos de la factura
    if (totalFacturado > 0) {
      const billData = await printBillRequest(order.id);
      order = applyBillingSnapshot(order, billData);
      const codigoQR = await QRCode.toDataURL(billData.url);
      numRemito = billData.billData.ResultGet.CbteDesde;

      console.log('verfact->', billData.billData.ResultGet);

      const discItems = await getDiscOfficialRequest({
        cte: billData.billData.ResultGet.CbteDesde,
        ptoVta: billData.billData.ResultGet.PtoVta,
      });

      console.log("desc:", discItems)

      const factItems = order.purchaseOrderItems.filter((poi) => poi.fact);

      discItems.map((d) => {
        if (d.quantity > 0) {
          factItems.push({
            product: {
              article: '-',
              description: d.concept?.toUpperCase() ?? '-',
            },
            amount: d.quantity,
            sellPrice: d.unitPrice,
          });
        } else if (d.oficial) {
          factItems.push({
            product: {
              article: 'OP-ES01',
              description: d.concept?.toUpperCase() ?? '-',
            },
            amount: 1,
            sellPrice: 0 - redondearADosDecimales(d.amount / 1.21),
          });
        }
      });

      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(factItems.length / itemsPerPage);

      for (let i = 0; i < factItems.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = factItems.slice(i, i + itemsPerPage);

        const render = await billHtml(
          billData.billData.ResultGet,
          order,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          logoAfipBase64,
          logoBlaseBase64
        );

        const containerFact = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerFact);

        containerFact.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    if (totalNoFacturado > 0) {
      numRemito = totalFacturado > 0 ? numRemito : order.id;

      const presData = await printPresRequest(order.id);

      // Las líneas manuales van a valor final: se marcan para que la
      // impresión no les sume IVA, venga o no la marca en el payload.
      const manualIds = new Set(
        (listOrder || [])
          .filter((i) => i.product?.brand?.code === 'ITEM-MANUAL')
          .map((i) => i.id)
      );
      const taggedOrder = {
        ...order,
        purchaseOrderItems: (order.purchaseOrderItems || []).map((poi) =>
          manualIds.has(poi.id) ||
          poi.product?.brand?.code === 'ITEM-MANUAL'
            ? { ...poi, isManualFace: true }
            : poi
        ),
      };

      const factItems = taggedOrder.purchaseOrderItems.filter((poi) => !poi.fact);

      presData.specialItems?.map((si) => {
        if (si.quantity > 0) {
          factItems.push({
            product: {
              article: '-',
              description: si.concept?.toUpperCase() ?? '-',
            },
            amount: si.quantity,
            sellPrice: si.unitPrice,
          });
        } else if (!si.oficial) {
          factItems.push({
            product: {
              article: 'OP-ES01',
              description: si.concept?.toUpperCase() ?? '-',
            },
            amount: 1,
            sellPrice: 0 - si.amount,
          });
        }
      });

      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(factItems.length / itemsPerPage);

      for (let i = 0; i < factItems.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = factItems.slice(i, i + itemsPerPage);

        const render = presupHtml(
          presData,
          taggedOrder,
          logoBlaseBase64,
          pageItems,
          pageNumber,
          totalPages
        );

        const containerPres = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
      if (totalPages > 1) {
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    const itemsPerPage = 14;
    const totalPages = Math.ceil(
      order.purchaseOrderItems.length / itemsPerPage
    );
    for (let i = 0; i < order.purchaseOrderItems.length; i += itemsPerPage) {
      const pageNumber = Math.floor(i / itemsPerPage) + 1;
      const pageItems = order.purchaseOrderItems.slice(i, i + itemsPerPage);
      const containerRem = nuevaVentana.document.createElement('div');
      nuevaVentana.document.body.appendChild(containerRem);
      containerRem.innerHTML = remitHtml(
        order,
        numRemito,
        pageItems,
        pageNumber,
        totalPages,
        logoBlaseBase64
      );
      if (pageNumber < totalPages) {
        const pageBreak = nuevaVentana.document.createElement('div');
        pageBreak.style.pageBreakBefore = 'always';
        nuevaVentana.document.body.appendChild(pageBreak);
      }
    }
    // Espera a que las imágenes se carguen antes de imprimir
    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };
  const newBill = () => {
    // Validaciones fiscales para ventas MELI
    if (isMeli) {
      const total = redondearADosDecimales(totalFacturado());
      if (fiscalCondition === 'Final' && total >= 10000000) {
        const dniDigits = dni.replace(/\\D/g, '');
        if (dniDigits.length < 7 || dniDigits.length > 8) {
          Swal.fire({
            icon: 'warning',
            title: 'DNI obligatorio',
            text: 'Para consumidor final con total mayor o igual a $10.000.000 debe ingresar el DNI (7 u 8 dígitos).',
          });
          return;
        }
      }
      if (fiscalCondition === 'Monotributista' || fiscalCondition === 'ResponsableInscripto') {
        const cuitDigits = cuit.replace(/\\D/g, '');
        if (cuitDigits.length !== 11) {
          Swal.fire({
            icon: 'warning',
            title: 'CUIT inválido',
            text: 'Debe ingresar un CUIT válido de 11 dígitos.',
          });
          return;
        }
        if (!razonSocial.trim()) {
          Swal.fire({
            icon: 'warning',
            title: 'Razón social obligatoria',
            text: 'Debe ingresar la razón social.',
          });
          return;
        }
      }
    }

    const facturaType = isMeli
      ? fiscalCondition === 'ResponsableInscripto'
        ? 'A'
        : 'B'
      : client.iva == 'Monotributista'
      ? 'A'
      : 'A';

    let tipoDocumento = 'CUIT';
    let numeroDocumento = cuitTransformToNumber(client.cuit);
    let billingRazonSocial = null;
    let billingCuit = null;
    let billingIva = null;

    if (isMeli) {
      billingIva = fiscalCondition;
      if (fiscalCondition === 'Final') {
        tipoDocumento = dni.replace(/\\D/g, '').length >= 7 ? 'DNI' : 'ConsumidorFinal';
        numeroDocumento =
          tipoDocumento === 'DNI' ? parseInt(dni.replace(/\\D/g, ''), 10) : 0;
        billingRazonSocial = 'Consumidor Final';
        billingCuit = null;
      } else {
        tipoDocumento = 'CUIT';
        numeroDocumento = cuitTransformToNumber(cuit);
        billingRazonSocial = razonSocial.trim();
        billingCuit = cuit;
      }
    }

    const forcedList = isMeli
      ? (listOrder || []).map((i) => ({ ...i, fact: true }))
      : listOrder;

    let sendData = {
      concepto: 'Productos',
      type: 'Factura',
      tipo_de_factura: facturaType,
      tipo_de_documento: tipoDocumento,
      numero_de_documento: numeroDocumento,
      importe_gravado: redondearADosDecimales(totalFacturado() / 1.21),
      importe_excento: 0,
      purchaseOrderId: order.id,
      salePoint: 13,
      iva: 21,
      importe_no_facturado: isMeli ? 0 : totalNoFacturado(),
      listOrder: forcedList,
      discountList: discountList,
      billingRazonSocial,
      billingCuit,
      billingIva,
    };
    dispatch(confirmSellOrderRequest(sendData)).then((res) => {
      closeModal();
      if (res.error) {
        Swal.fire({
          icon: 'warning',
          title: 'No emitimos la factura',
          text: 'Generamos los registros de pendientes y eliminamos la orden de monto cero.',
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 3000,
        });
        navigate('/search/sell');
      } else {
        printBill(
          res.payload,
          totalFacturado() - totalDesFacturado(),
          totalNoFacturado()
        );
        dispatch(searchSellOrderRequest(filterSellOrder)).then((res) => {
          navigate('/search/sell');
        });
      }
    });
  };

  return (
    <div className={styles.buttonContainer}>
      {isMeli ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>Datos fiscales (venta MELI)</span>
          <select
            value={fiscalCondition}
            onChange={(e) => setFiscalCondition(e.target.value)}
            style={{ padding: '6px' }}
          >
            <option value="Final">Consumidor Final</option>
            <option value="Monotributista">Monotributista</option>
            <option value="ResponsableInscripto">Responsable Inscripto</option>
          </select>
          {fiscalCondition === 'Final' ? (
            <input
              type="text"
              placeholder="DNI (obligatorio si total >= $10.000.000)"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              style={{ padding: '6px' }}
            />
          ) : (
            <>
              <input
                type="text"
                placeholder="CUIT (11 dígitos)"
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                style={{ padding: '6px' }}
              />
              <input
                type="text"
                placeholder="Razón social"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
                style={{ padding: '6px' }}
              />
            </>
          )}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>
          {`Total facturado:`}
          <span
            className={styles.datosSpan}
          >{`$ ${redondearADosDecimales(totalFacturado())}`}</span>
        </span>
        <span>
          {`Total presupuesto:`}
          <span
            className={styles.datosSpan}
          >{`$ ${redondearADosDecimales(totalNoFacturado())}`}</span>
        </span>
      </div>
      <LabelGroup tag>
        {discountList.map((d, i) => (
          <Popup
            key={i}
            content={d.concept?.toUpperCase()}
            trigger={
              <Label color={d.oficial ? 'blue' : 'teal'} as="a">
                {d.percentage}%
                <i
                  style={{ marginLeft: '7px' }}
                  className="fa-solid fa-xmark"
                  onClick={() => removeDiscount(i)}
                ></i>
              </Label>
            }
          />
        ))}
      </LabelGroup>
      <Button
        disabled={
          totalFacturado() < totalDesFacturado() ||
          totalNoFacturado() < totalDesNoFacturado()
        }
        onClick={() => {
          newBill();
        }}
        style={{
          backgroundColor: '#673ab7',
          border: '1px solid #673ab7',
          height: '35px',
          width: '100px',
          marginLeft: '10px',
        }}
      >
        {loading ? <Spinner size="sm" /> : 'Confirmar'}
      </Button>
    </div>
  );
};

function NewBill(props) {
  const { closeModal } = props;
  const dispatch = useDispatch();
  const client = useSelector((state) => state.client.data);
  const order = useSelector((state) => state.newBuyOrder.data);
  const clientStatus = client?.data?.inTerm;

  const [discountList, setDiscountList] = useState([]);

  const addDiscount = (data) => {
    const newList = [...discountList];
    if (newList.length > 0) return;
    const newDiscount = {
      concept: data.concept,
      percentage: redondearADosDecimales(Number(data.percentage)),
      oficial: data.isOfficial,
    };
    newList.push(newDiscount);
    console.log(newList)
    setDiscountList(newList);
    localStorage.setItem(order.id, JSON.stringify(newList));
  };

  const removeDiscount = (index) => {
    const newList = [...discountList];
    newList.splice(index, 1);
    setDiscountList(newList);
    localStorage.setItem(order.id, JSON.stringify(newList));
  };

  useEffect(() => {
    const discounts = JSON.parse(localStorage.getItem(order.id));
    setDiscountList(discounts ?? []);
  }, [order]);

  useEffect(() => {
    if (order?.id) {
      dispatch(getOrderItemsRequest(order.id));
    }
  }, [order?.id]);

  return (
    <div className={styles.facContainer}>
      <div className={styles.arrCont}>
        <div className={styles.arrConLef}>
          <div className={styles.dataContainer}>
            <span style={{ width: '33%' }}>
              Fecha:{' '}
              <span className={styles.datosSpan}>
                {dateConverter(new Date())}
              </span>
            </span>
            <span
              style={{
                width: '33%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              CUIT: <span className={styles.datosSpan}>{client.cuit}</span>
            </span>
            <span
              style={{ width: '33%', display: 'flex', justifyContent: 'end' }}
            >
              Razon Social:{' '}
              <span className={styles.datosSpan}>
                {client.razonSocial?.substring(0, 15)}
              </span>
              <span
                style={{ marginLeft: '5px' }}
                className={styles[clientStatus]}
              ></span>
            </span>
          </div>
          <div className={styles.dataContainer}>
            <span style={{ width: '33%' }}>
              Orden: <span className={styles.datosSpan}>{order.numero}</span>
            </span>
            <span
              style={{
                width: '33%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Subtotal:{' '}
              <span
                className={styles.datosSpan}
              >{`$ ${numberToString(order.subTotal)}`}</span>
            </span>
            <span
              style={{ width: '33%', display: 'flex', justifyContent: 'end' }}
            >
              Total:{' '}
              <span
                className={styles.datosSpan}
              >{`$ ${numberToString(order.total)}`}</span>
            </span>
          </div>
        </div>
        <div className={styles.arrConRig}>
          <CustomModal
            title="Agregar descuento"
            fullscreen
            actionButton={
              <button>
                <i className="fa-solid fa-tag"></i>
              </button>
            }
            actionProps={{
              className: 'btn btn-warning',
            }}
            bodyModal={(props) => <InvoiceForm {...props} />}
            bodyProps={{ onSubmit: addDiscount }}
          />
        </div>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.message}>
          Seleccioná aquellos items que deben incluirse en la factura oficial
        </div>
      </div>
      <div className={styles.tableContainer}>
        <CustomTable
          type="fact"
          color="teal"
          products={[]}
          colum={[
            { title: 'Artículo', width: '20%' },
            { title: 'Marca', width: '22%' },
            { title: 'Cantidad', width: '10%' },
            { title: 'Precio Uni', width: '22%' },
            { title: 'IVA', width: '16%' },
            { title: 'Facturar', width: '10%' },
          ]}
        />
      </div>
      <div className={styles.buttonContainer}>
        <TotalComponent
          client={client}
          order={order}
          closeModal={closeModal}
          discountList={discountList}
          removeDiscount={removeDiscount}
          isMeli={order?.numero?.startsWith('ML-') || order?.origin === 'meli'}
        />
      </div>
    </div>
  );
}

export default NewBill;
