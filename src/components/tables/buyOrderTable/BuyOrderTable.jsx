import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertirFechaISOaDDMMYYYY,
  numberToString,
  redondearADosDecimales,
} from '../../../utils';
import { Label, Pagination, Popup, Select } from 'semantic-ui-react';
import styles from './comitionsTable.module.css';
import {
  resetFilterBuyOrder,
  setFilterBuyOrder,
} from '../../../redux/filtersBuyOrder';
import {
  resetOrderState,
  searchBuyOrderRequest,
} from '../../../redux/searchOrders';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import ActionModalContainer from '../../../containers/ActionModalContainer';
import { printBillRequest } from '../../../request/orderRequest';
import { QRCode } from 'antd';
import { billHtml } from '../../../templates/bill';
import filtersBuyOrder from '../../../redux/filtersBuyOrder';

const CustomActionComp = ({
  data,
  deleteOrder,
  cancelOrder,
  setOrder,
  buyOrderSelect,
}) => {
  const printBill = async (id) => {
    // Obtener datos de la factura
    const billData = await printBillRequest(id);
    const codigoQR = await QRCode.toDataURL(billData.url);
    // console.log(codigoQR);
    const order = props.buyOrderSelect.buyOrderSelected;
    // console.log(billData);
    // console.log(order);

    // Abrir una nueva ventana
    const nuevaVentana = window.open('', '', 'width=900,height=1250');

    // Crear un contenedor en la ventana nueva
    const container = nuevaVentana.document.createElement('div');
    nuevaVentana.document.body.appendChild(container);

    // Asignar la plantilla HTML al contenedor
    container.innerHTML = await billHtml(
      billData.billData.ResultGet,
      order,
      codigoQR
    );
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close(); // Cierra la ventana después de imprimir
    });
    // Imprimir la ventana
    nuevaVentana.print();
  };

  console.log(data.status);

  return (
    <div className={styles.buttonContainer}>
      <div style={{ marginTop: '2px' }}>
        <ActionModalContainer
          size="xl"
          selectedId={data.id}
          data={buyOrderSelect.buyOrderSelected}
          title="Información de orden"
          type="viewOrder"
          icon="fa-solid fa-circle-info fa-lg"
          buyOrderSelect={buyOrderSelect}
          popupText="Detalle de orden"
          printBill={printBill}
        />
      </div>
      <Popup
        trigger={
          <button
            style={{ margin: '1px 0px 0px 7px' }}
            className={styles.iconButton}
            // disabled={
            //   data.status == 'Open' || data.status == 'Confirm' ? false : true
            // }
            onClick={() => {
              setOrder(data.id, data.clientId);
            }}
            type="button"
          >
            <i
              className={`fa-regular fa-pen-to-square fa-lg ${
                data.status == 'Open' || data.status == 'Confirm'
                  ? styles.blueIcon
                  : styles.blueIcon //styles.greyIcon
              }`}
            ></i>
          </button>
        }
        content="Editar"
      />
      <ProtectedComponent listAccesss={[1, 2]}>
        <Popup
          trigger={
            <button
              style={{ margin: '1px 0px 0px 7px' }}
              className={styles.iconButton}
              disabled={
                data.status == 'Open' || data.status == 'Confirm' ? false : true
              }
              onClick={() => {
                if (data.status == 'Open') {
                  deleteOrder(data.id);
                } else {
                  cancelOrder(data.id);
                }
              }}
              type="button"
            >
              <i
                className={`fa-solid fa-xmark fa-xl ${
                  data.status == 'Open' || data.status == 'Confirm'
                    ? styles.redIcon
                    : styles.greyIcon
                }`}
              ></i>
            </button>
          }
          content="Cancelar"
        />
      </ProtectedComponent>
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filterBuyOrder = useSelector((state) => state.filterBuyOrder);
  const [inp, setInp] = useState(false);
  const inputRef = useRef(null);

  const onTitleClick = () => {
    setInp(true);
  };
  const onInputChange = (e) => {
    const value = e.target.value;
    dispatch(setFilterBuyOrder({ name: 'page', value: 1 }));
    dispatch(setFilterBuyOrder({ name, value }));
    if (value == '') {
      setInp(false);
    }
  };

  const handleClickOutside = () => {
    if (!filterBuyOrder[name]) {
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
  }, [filtersBuyOrder, inp]);

  return inp ? (
    <input
      ref={inputRef}
      className={styles.input}
      value={filtersBuyOrder[name]}
      onChange={onInputChange}
    />
  ) : (
    <span onClick={onTitleClick}>{title}</span>
  );
};

function BuyOrderTable(props) {
  const { cancelOrder, deleteOrder, setOrder, buyOrderSelect } = props;
  // console.log(props);
  const dispatch = useDispatch();

  let columnInitialState = [
    {
      headerName: 'Fecha',
      valueGetter: (params) => convertirFechaISOaDDMMYYYY(params.data.date),
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Número',
      field: 'numero',
      headerComponent: () => <HeaderInput title="Número" name={'number'} />,
      valueGetter: (params) => params.data.numero,
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Proveedor',
      headerComponent: () => (
        <HeaderInput title="Proveedor" name={'supplier'} />
      ),
      valueGetter: (params) => params.data.supplier?.razonSocial,
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'SubTotal',
      cellRenderer: (params) => (
        <ProtectedComponent
          listAccesss={[1, 2]}
        >{`$ ${numberToString(params.data.subTotal)}`}</ProtectedComponent>
      ),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Total (c/IVA)',
      cellRenderer: (params) => (
        <ProtectedComponent
          listAccesss={[1, 2]}
        >{`$ ${numberToString(params.data.total)}`}</ProtectedComponent>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Estado',
      cellRenderer: (params) => (
        <div className={styles.statusCell}>
          {params.data.status == 'Open' ? (
            <Label
              color="yellow"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Abierta
            </Label>
          ) : null}
          {params.data.status == 'Confirm' ? (
            <Label
              color="green"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Confirmada
            </Label>
          ) : null}
          {params.data.status == 'Stocked' ? (
            <Label
              color="teal"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              En Stock
            </Label>
          ) : null}
          {params.data.status == 'Cancel' ? (
            <Label
              color="red"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Cancelada
            </Label>
          ) : null}
          {params.data.status == 'Recived' ? (
            <Label
              color="blue"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Recibido
            </Label>
          ) : null}
          {params.data.status == 'Sent' ? (
            <Label
              color="teal"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Facturado
            </Label>
          ) : null}
        </div>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Orden de control',
      valueGetter: (params) => params.data.controlOrder?.id,
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => (
        <CustomActionComp
          data={params.data}
          deleteOrder={deleteOrder}
          cancelOrder={cancelOrder}
          setOrder={setOrder}
          buyOrderSelect={buyOrderSelect}
        />
      ),
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

  const { loading, error, data } = useSelector((state) => state.searchOrders);

  // console.log(data);

  const filterBuyOrder = useSelector((state) => state.filterBuyOrder);

  const selectChange = (e, d) => {
    dispatch(setFilterBuyOrder({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterBuyOrder({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    dispatch(searchBuyOrderRequest(filterBuyOrder));
    return () => {
      dispatch(resetOrderState());
    };
  }, [filterBuyOrder]);

  useEffect(() => {
    return () => {
      dispatch(resetFilterBuyOrder());
    };
  }, []);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 600, marginTop: '-20px' }}
    >
      <AgGridReact
        rowData={data.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${data.totalPages} páginas con ${data.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterBuyOrder.pageSize}
              onChange={selectChange}
              options={[
                { key: 50, value: 50, text: 50 },
                { key: 100, value: 100, text: 100 },
                { key: 500, value: 500, text: 500 },
              ]}
            />
          </div>
          <Pagination
            boundaryRange={0}
            activePage={filterBuyOrder.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={data.totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default BuyOrderTable;
