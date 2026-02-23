import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logoBlase from '../../../assets/logo/logoBlase.png';
import {
  billDateTostringDate,
  checkActive,
  convertImageToBase64,
  convertirFechaISOaDDMMYYYYHHMM,
  getBillType,
  numberToString,
  presDateIsoTostringDate,
  redondearADosDecimales,
  selectStylesByDate,
} from '../../../utils';
import logoAfip from '../../../assets/afip/logo-vector-afip.jpg';
import { Checkbox, Pagination, Popup, Select } from 'semantic-ui-react';
import styles from './clientAcountTables.module.css';
import {
  getBillDataRequest,
  printNCByNumRequest,
  printNCPresByNumRequest,
  rePrintPresRequest,
} from '../../../request/orderRequest';
import QRCode from 'qrcode';
import { billHtml } from '../../../templates/bill';
import {
  resetFilterMovements,
  setFilterMovements,
} from '../../../redux/filtersMovements';
import {
  getMovementsByCurrentAcountIdX,
  marcMovementsByCurrentAcountId,
  resetMovementsByCurrentAcountId,
} from '../../../redux/searchCurrentAcount';
import { MovTypeEnum } from '../../../enum/MovEnum';
import CustomModal from '../../../commonds/customModal/CustomModal';
import BillViewModalContainer from '../../../containers/BillViewModalContainer';
import { getBillByIdRequest } from '../../../request/billRequest';
import { ncAHtml } from '../../../templates/ncA';
import { ncPresupHtml } from '../../../templates/ncPresupBlase';
import { presupHtml } from '../../../templates/presupBlase';
import { ndHtml } from '../../../templates/ndBlase';
import { remitHtml } from '../../../templates/RemBlase';
import { payDetail } from '../../../templates/payDetail';
import { printNDByIdRequest } from '../../../request/currentAcountRequest';

const CustomComp = ({ data }) => {
  // console.log(data);
  const { list } = useSelector((state) => state.searchMovements).data
    ?.movements;
  // console.log(list[0])
  // return <></>
  const selectMov = list?.find((m) => m.id == data.id);
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(marcMovementsByCurrentAcountId(data.id));
  };
  return (
    <div className={styles.buttonContainer}>
      <Checkbox
        disabled={checkActive(data)}
        onChange={onClick}
        checked={selectMov?.marc}
      />
    </div>
  );
};

const CustomActionComp = ({ data }) => {
  // console.log(data)
  const [printLoading, setPrintLoading] = useState(false);
  const { client } = useSelector((state) => state.searchMovements)?.data
    ?.currentAcount;
  // console.log(client);
  const rePrint = async (bill) => {
    // console.log(bill);
    let billRemDate = { type: null, date: null };
    setPrintLoading(true);
    let purchaseOrder;
    let numRemito;
    const logoAfipBase64 = await convertImageToBase64(logoAfip);
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);
    const { billType, numComprobante, id } = bill;

    let nuevaVentana;
    // NOTA DE DEBITO (manejar antes de presupuestos y remitos)
    if (data.type == 5) {
      const ndData = await printNDByIdRequest(bill.id);

      nuevaVentana = window.open('', '', 'width=900,height=1250');
      const render = ndHtml(ndData, ndData.client, logoBlaseBase64);

      const containerND = nuevaVentana.document.createElement('div');
      nuevaVentana.document.body.appendChild(containerND);
      containerND.innerHTML = render;

      await waitForImagesToLoad(nuevaVentana);
      nuevaVentana.addEventListener('afterprint', () => {
        nuevaVentana.close();
      });
      nuevaVentana.print();
      setPrintLoading(false);
      return;
    }

    //FACTURA A
    if (billType == 1 || billType == 6) {
      const billData = await getBillDataRequest(
        numComprobante,
        billType,
        data.ptoVta
      );
      numRemito = billData.billData.ResultGet.CbteDesde;
      billRemDate.type = 'f';
      billRemDate.date = billDateTostringDate(
        billData.billData.ResultGet.CbteFch
      );
      const billInfo = await getBillByIdRequest(id);
      const { fItems } = billInfo;
      purchaseOrder = billInfo.purchaseOrder;
      const codigoQR = await QRCode.toDataURL(billData.url);

      // console.log("verfact->", billData.billData.ResultGet)
      const factItems = fItems;

      billInfo.specialItems?.map((si) => {
        if (si.oficial) {
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
      nuevaVentana = window.open('', '', 'width=900,height=1250');

      // Primero imprimimos las facturas
      for (let i = 0; i < factItems.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = factItems.slice(i, i + itemsPerPage);

        const render = await billHtml(
          billData.billData.ResultGet,
          purchaseOrder,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          logoAfipBase64,
          logoBlaseBase64
        );
        const containerFact = nuevaVentana.document.createElement('div');
        containerFact.innerHTML = render;

        // Agregar el contenido generado a la ventana
        nuevaVentana.document.body.appendChild(containerFact);

        // Si no es la última página, agregar un salto de página
        if (pageNumber < totalPages) {
          const pageBreak = nuevaVentana.document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always'; // Salto de página después del contenido
          nuevaVentana.document.body.appendChild(pageBreak);
        }
      }
    }
    //PRESUPUESTO
    if (billType == 0) {
      const presData = await rePrintPresRequest(bill.id);
      purchaseOrder = presData.purchaseOrder;
      // console.log(presData);

      numRemito = purchaseOrder.pickingOrder.numRemito;

      const factPresItems = purchaseOrder.purchaseOrderItems.filter(
        (poi) => !poi.fact
      );
      presData.specialItems?.map((si) => {
        if (!si.oficial) {
          factPresItems.push({
            product: {
              article: 'OP-ES01',
              description: si.concept?.toUpperCase() ?? '-',
            },
            amount: 1,
            sellPrice: 0 - si.amount,
          });
        }
      });

      billRemDate.type = 'p';
      billRemDate.date = presDateIsoTostringDate(presData.fecha);

      const itemsPerPage = 10; // Número de ítems por página
      const totalPresPages = Math.ceil(factPresItems.length / itemsPerPage);

      nuevaVentana = window.open('', '', 'width=900,height=1250');

      for (let i = 0; i < factPresItems.length; i += itemsPerPage) {
        const pagePresNumber = Math.floor(i / itemsPerPage) + 1;
        const pagePresItems = factPresItems.slice(i, i + itemsPerPage);

        const render = presupHtml(
          presData,
          purchaseOrder,
          logoBlaseBase64,
          pagePresItems,
          pagePresNumber,
          totalPresPages
        );
        const containerPres = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
      // nuevaVentana.document.body.appendChild(
      //   nuevaVentana.document.createElement("div")
      // ).style.pageBreakBefore = "always";
    }

    // NOTA DE DEBITO
    if (data.type == 5) {
      const ndData = await printNDByIdRequest(bill.id);
      
      nuevaVentana = window.open('', '', 'width=900,height=1250');
      
      const render = ndHtml(
        ndData,
        ndData.client,
        logoBlaseBase64
      );
      
      const containerND = nuevaVentana.document.createElement('div');
      nuevaVentana.document.body.appendChild(containerND);
      
      containerND.innerHTML = render;
      
      await waitForImagesToLoad(nuevaVentana);
      nuevaVentana.addEventListener('afterprint', () => {
        nuevaVentana.close();
      });
      nuevaVentana.print();
      setPrintLoading(false);
      return;
    }

    // Después imprimimos los remitos (solo si hay purchaseOrder)
    if (purchaseOrder && purchaseOrder.purchaseOrderItems) {
      const itemsRemPage = 14;
      const totalRemPages = Math.ceil(
        purchaseOrder.purchaseOrderItems.length / itemsRemPage
      );

      for (
        let i = 0;
        i < purchaseOrder.purchaseOrderItems.length;
        i += itemsRemPage
      ) {
      const pageNumber = Math.floor(i / itemsRemPage) + 1;
      const pageItems = purchaseOrder.purchaseOrderItems.slice(
        i,
        i + itemsRemPage
      );

      const containerRem = nuevaVentana.document.createElement('div');
      containerRem.innerHTML = remitHtml(
        purchaseOrder,
        numRemito,
        pageItems,
        pageNumber,
        totalRemPages,
        logoBlaseBase64,
        billRemDate
      );

      nuevaVentana.document.body.appendChild(containerRem);

      // Si no es la última página, agregar un salto de página
      if (pageNumber < totalRemPages) {
        const pageBreak = nuevaVentana.document.createElement('div');
        pageBreak.style.pageBreakAfter = 'always'; // Salto de página después del contenido
        nuevaVentana.document.body.appendChild(pageBreak);
      }
      }
    }
    setPrintLoading(false);
  };

  const ncRePrint = async (nc) => {
    setPrintLoading(true);
    const { currentAcountId, numComprobante, billType } = nc;
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);
    if (billType == 1 || billType == 8 || billType == 3) {
      const ncData = await printNCByNumRequest(
        numComprobante,
        currentAcountId,
        data.ptoVta
      );
      const ncDetail = await getBillByIdRequest(nc.id);
      const items = ncDetail.ncOrderItems;
      const client = ncDetail.currentAcount.client;

      const codigoQR = await QRCode.toDataURL(ncData.url);

      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(items.length / itemsPerPage);
      let nuevaVentana = window.open('', '', 'width=900,height=1250');

      for (
        let i = 0;
        i < (items.length == 0 ? 1 : items.length);
        i += itemsPerPage
      ) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems =
          items?.length > 0 ? items.slice(i, i + itemsPerPage) : [];

        const render = ncAHtml(
          ncData.billData.ResultGet,
          client,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          nc.concept
        );

        const containerFact = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerFact);

        containerFact.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    if (billType == 2) {
      const presData = await printNCPresByNumRequest(numComprobante);
      const client = presData.currentAcount?.client;

      const items = presData.ncOrderItems;
      const itemsPerPage = 10; // Número de ítems por página
      const totalPages =
        Math.ceil(items?.length / itemsPerPage) > 0
          ? Math.ceil(items?.length / itemsPerPage)
          : 1;

      for (
        let i = 0;
        i < (items.length > 0 ? items.length : 1);
        i += itemsPerPage
      ) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = items?.slice(i, i + itemsPerPage);

        const render = ncPresupHtml(
          presData,
          client,
          pageItems,
          pageNumber,
          totalPages,
          logoBlaseBase64,
          presData.concept
        );

        const nuevaVentana = window.open('', '', 'width=900,height=1250');
        const containerPres = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    setPrintLoading(false);
  };

  const printPayDetail = async (client, payData) => {
    const nuevaVentana = window.open('', '', 'width=900,height=625');
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);

    const containerRem = nuevaVentana.document.createElement('div');
    nuevaVentana.document.body.appendChild(containerRem);
    // console.log(payData);
    containerRem.innerHTML = payDetail(client, payData, logoBlaseBase64);
    // Espera a que las imágenes se carguen antes de imprimir
    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };

  const payReprint = async (movement) => {
    printPayDetail(client, movement.payDetail);
  };
  return (
    <div className={styles.buttonContainer}>
      <CustomModal
        title={`Comprobante N° ${data.numComprobante}`}
        size="xl"
        actionButton={
          <button
            style={{ margin: '1px 0px 0px 7px' }}
            className={styles.iconButton}
            type="button"
          >
            <i className={`fa-solid fa-circle-info ${styles.blueIcon}`}></i>
          </button>
        }
        bodyModal={(props) => <BillViewModalContainer {...props} />}
        bodyProps={{ movId: data.id }}
      />
      <button
        style={{ margin: '1px 0px 0px 7px' }}
        className={styles.iconButton}
        type="button"
        onClick={() => {
          // console.log(data);
          if (data.billType == 2 || data.billType == 3 || data.billType == 8) {
            ncRePrint(data);
          }
          if (
            (data.billType == 0 && data.type != 2) ||
            data.billType == 1 ||
            data.billType == 6
          ) {
            rePrint(data);
          }
          if (data.type == 2) {
            payReprint(data);
          }
        }}
      >
        {false ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <i className={`fa-solid fa-print ${styles.greenIcon}`}></i>
        )}
      </button>
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filterMovements = useSelector((state) => state.filterMovementsOrder);
  const [inp, setInp] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(filterMovements[name]);
  const inputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const onTitleClick = () => {
    setInp(true);
  };

  const onInputChange = (e) => {
    const value = e.target.value;
    setDebouncedValue(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      dispatch(setFilterMovements({ name: 'page', value: 1 }));
      dispatch(setFilterMovements({ name, value }));
      // if (value === '') {
      //   setInp(false);
      // }
    }, 500); // El valor 500 representa el tiempo de espera en milisegundos
  };

  const handleClickOutside = () => {
    if (!filterMovements[name]) {
      setInp(false);
    }
  };

  useEffect(() => {
    if (inp && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inp]);

  useEffect(() => {
    if (inp) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterMovements, inp]);

  return inp ? (
    <input
      ref={inputRef}
      className={styles.input}
      value={debouncedValue}
      onChange={onInputChange}
    />
  ) : (
    <span onClick={onTitleClick}>{title}</span>
  );
};

function ClientAcountTable(props) {
  // console.log(props);
  const [printLoading, setPrintLoading] = useState(false);
  const dispatch = useDispatch();

  let columnInitialState = [
    {
      headerName: 'Check',
      cellRenderer: (params) => <CustomComp data={params.data} />,
      flex: 0.5,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Fecha',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {convertirFechaISOaDDMMYYYYHHMM(params.data.fecha)}
        </span>
      ),
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Concepto',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {getBillType(MovTypeEnum[params.data.type], params.data.billType)}
        </span>
      ),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerComponent: () => (
        <HeaderInput title="N° Comprobante" name={'numComprobante'} />
      ),
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {getBillType(MovTypeEnum[params.data.type], params.data.billType) !=
            'Pago' &&
          getBillType(MovTypeEnum[params.data.type], params.data.billType) !=
            'Descuento'
            ? params.data.numComprobante
            : '-'}
        </span>
      ),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Factura Asoc.',
      cellRenderer: (params) => {
        return (
          <span className={params.data.esOferta ? styles.greenRow : ''}>
            {getBillType(MovTypeEnum[params.data.type], params.data.billType) ==
              'Pago' ||
            getBillType(MovTypeEnum[params.data.type], params.data.billType) ==
              'Nota de credito' ||
            getBillType(MovTypeEnum[params.data.type], params.data.billType) ==
              'Nota de credito X'
              ? params.data.bills.map((b, i) => {
                  if (i > 0) {
                    return `-${b.numComprobante}`;
                  }
                  return b.numComprobante;
                })
              : ' '}
            {getBillType(MovTypeEnum[params.data.type], params.data.billType) ==
            'Descuento'
              ? params.data.bills.map((b, i) => {
                  const cte = b.type == 0;
                  if (!cte) return '';
                  if (i > 0) {
                    return ` ${b.numComprobante}`;
                  }
                  return b.numComprobante;
                })
              : ''}
          </span>
        );
      },
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerComponent: () => (
        <HeaderInput title="Cbte Sist." name={'cbteSist'} />
      ),
      cellRenderer: (params) => (
        <Popup
          disabled={!params.data.payDetail?.comprobanteVendedor}
          content={`Cbte manual: ${params.data.payDetail?.comprobanteVendedor}`}
          trigger={
            <span className={params.data.esOferta ? styles.greenRow : ''}>
              {params.data.payDetail?.id ?? '-'}
            </span>
          }
        />
      ),
      filter: false,
      flex: 1,
    },
    {
      headerComponent: () => (
        <HeaderInput title="Cbtes Dig." name={'cbteDig'} />
      ),
      cellRenderer: (params) => {
        // console.log(params.data);
        return (
          <span className={params.data.esOferta ? styles.greenRow : ''}>
            {params.data.sellerReceipts?.reduce((acum, sr) => {
              if (acum === '') return acum + sr.id;
              return acum + ` - ${sr.id}`;
            }, '')}
          </span>
        );
      },
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Monto',
      cellRenderer: (params) => (
        <span
          className={params.data.esOferta ? styles.greenRow : ''}
        >{`$${numberToString(params.data.total)}`}</span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Pendiente',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {params?.data?.saldoPend
            ? `$${numberToString(params?.data?.saldoPend)}`
            : '-'}
        </span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => <CustomActionComp data={params.data} />,
      filter: false,
      flex: 1,
    },
  ];

  const [columnDefs, setColumnDefs] = useState(columnInitialState);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  const currentAcountState = useSelector((state) => state.searchMovements);

  const data = useMemo(() => {
    return currentAcountState.data;
  }, [currentAcountState.data?.currentAcount]);

  // console.log(data.movements);

  const filterMovements = useSelector((state) => state.filterMovementsOrder);
  // console.log(filterMovements);

  const selectChange = (e, d) => {
    dispatch(setFilterMovements({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterMovements({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    dispatch(getMovementsByCurrentAcountIdX(filterMovements))
      .then(() => {})
      .catch((err) => console.log(err));

    return () => {
      dispatch(resetMovementsByCurrentAcountId(null));
    };
  }, [filterMovements]);

  useEffect(() => {
    return () => {
      dispatch(resetFilterMovements());
    };
  }, []);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 480, marginTop: '5px' }}
    >
      <AgGridReact
        rowData={data?.movements?.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowClass={(params) =>
          params.data.pending
            ? styles[selectStylesByDate(params?.data?.fecha)]
            : ''
        }
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${data?.movements?.totalPages} páginas con ${data?.movements?.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px', position: 'relative' }}>
            <Select
              position="absolute"
              width="10px"
              defaultValue={filterMovements.pageSize}
              onChange={selectChange}
              options={[
                { key: 50, value: 50, text: 50 },
                { key: 100, value: 100, text: 100 },
                { key: 500, value: 500, text: 500 },
                { key: 0, value: 0, text: 'Todos' },
              ]}
            />
          </div>
          <Pagination
            boundaryRange={0}
            activePage={filterMovements.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={data?.movements?.totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default ClientAcountTable;
