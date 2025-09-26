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

const TotalComponent = (props) => {
  const { client, order, closeModal, discountList, removeDiscount } = props;
  const listOrder = useSelector((state) => state.listOrderItems).data;
  const loading = useSelector((state) => state.searchOrders.loading);
  const filterSellOrder = useSelector((state) => state.filterSellOrder);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const totalFacturado = useCallback(
    () =>
      listOrder.reduce((accumulator, object) => {
        if (object.fact) {
          return accumulator + object.sellPrice * object.amount * 1.21;
        } else {
          return accumulator;
        }
      }, 0),
    [listOrder]
  );
  const totalNoFacturado = useCallback(
    () =>
      listOrder.reduce((accumulator, object) => {
        if (!object.fact) {
          return accumulator + object.sellPrice * object.amount;
        } else {
          return accumulator;
        }
      }, 0),
    [listOrder]
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
        if (d.oficial) {
          factItems.push({
            product: {
              article: 'OP-ES01',
              description: si.concept?.toUpperCase() ?? '-',
            },
            amount: 1,
            sellPrice: 0 - redondearADosDecimales(si.amount / 1.21),
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

      const factItems = order.purchaseOrderItems.filter((poi) => !poi.fact);

      presData.specialItems?.map((si) => {
        if (!si.oficial) {
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
          order,
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
    // console.log(client);
    const facturaType = client.iva == 'Monotributista' ? 'A' : 'A';
    let sendData = {
      concepto: 'Productos',
      type: 'Factura',
      tipo_de_factura: facturaType,
      tipo_de_documento: 'CUIT',
      numero_de_documento: cuitTransformToNumber(client.cuit),
      importe_gravado: redondearADosDecimales(totalFacturado() / 1.21),
      importe_excento: 0,
      purchaseOrderId: order.id,
      salePoint: 13,
      iva: 21,
      importe_no_facturado: totalNoFacturado(),
      listOrder: listOrder,
      discountList: discountList,
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
        />
      </div>
    </div>
  );
}

export default NewBill;
