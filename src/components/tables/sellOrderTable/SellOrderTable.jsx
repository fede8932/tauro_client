import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { convertirFechaISOaDDMMYYYYHHMM, numberToString } from '../../../utils';
import { Checkbox, Label, Pagination, Popup, Select } from 'semantic-ui-react';
import styles from './comitionsTable.module.css';
import {
  resetFilterSellOrder,
  setFilterSellOrder,
} from '../../../redux/filtersSellOrder';
import {
  resetOrderState,
  searchSellOrderRequest,
  setOrderMarc,
} from '../../../redux/searchOrders';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import ActionModalContainer from '../../../containers/ActionModalContainer';
import { printBillRequest, markOrderAsPaid } from '../../../request/orderRequest';
import Swal from 'sweetalert2';
import { QRCode } from 'antd';
import { billHtml } from '../../../templates/bill';

const CustomComp = ({ data }) => {
  const { list } = useSelector((state) => state.searchOrders).data;
  const dispatch = useDispatch();
  const onClick = (e, d) => {
    dispatch(setOrderMarc({ id: data.id }));
  };

  return (
    <div className={styles.buttonContainer}>
      <Checkbox
        disabled={data.oferta ? true : data.status == 'Sent' ? true : false}
        onChange={onClick}
        checked={list?.find((item) => item.id == data.id)?.marc}
      />
    </div>
  );
};

const CustomActionComp = ({
  data,
  deleteOrder,
  cancelOrder,
  setOrder,
  buyOrderSelect,
  refreshOrders,
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

  const handleMarkAsPaid = async (orderId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Vas a marcar esta orden como pagada',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, marcar como pagada',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await markOrderAsPaid(orderId);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Orden marcada como pagada',
            showConfirmButton: false,
            timer: 1500
          });
          if (refreshOrders) {
            refreshOrders();
          }
        } catch (error) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.error || 'No se pudo marcar la orden como pagada',
            showConfirmButton: true
          });
        }
      }
    });
  };

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
            disabled={
              data.status == 'Open' || data.status == 'Confirm' ? false : true
            }
            onClick={() => {
              setOrder(data.id, data.clientId);
            }}
            type="button"
          >
            <i
              className={`fa-regular fa-pen-to-square fa-lg ${
                data.status == 'Open' || data.status == 'Confirm'
                  ? styles.blueIcon
                  : styles.greyIcon
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
              disabled={data.status !== 'Open' || data.mercadoPagoPayment === true}
              onClick={() => handleMarkAsPaid(data.id)}
              type="button"
            >
              <i
                className={`fa-solid fa-dollar-sign fa-lg ${
                  data.status === 'Open' && data.mercadoPagoPayment !== true
                    ? styles.greenIcon
                    : styles.greyIcon
                }`}
              ></i>
            </button>
          }
          content="Marcar como pagada"
        />
      </ProtectedComponent>
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
                  if (data.pickingOrder?.status == 0) {
                    deleteOrder(data.id);
                  } else {
                    cancelOrder(data.id);
                  }
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
  const filterSellOrder = useSelector((state) => state.filterSellOrder);
  const [inp, setInp] = useState(false);
  const inputRef = useRef(null);

  const onTitleClick = () => {
    setInp(true);
  };
  const onInputChange = (e) => {
    const value = e.target.value;
    dispatch(setFilterSellOrder({ name: 'page', value: 1 }));
    dispatch(setFilterSellOrder({ name, value }));
    if (value == '') {
      setInp(false);
    }
  };

  const handleClickOutside = () => {
    if (!filterSellOrder[name]) {
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
  }, [filterSellOrder, inp]);

  return inp ? (
    <input
      ref={inputRef}
      className={styles.input}
      value={filterSellOrder[name]}
      onChange={onInputChange}
    />
  ) : (
    <span onClick={onTitleClick}>{title}</span>
  );
};

function SellOrderTable(props) {
  const { cancelOrder, deleteOrder, setOrder, buyOrderSelect } = props;
  // console.log(props);

  const dispatch = useDispatch();

  const { loading, error, data } = useSelector((state) => state.searchOrders);

  // console.log(data);

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
        <span className={params.data.oferta ? styles.greeText : ''}>
          {convertirFechaISOaDDMMYYYYHHMM(params.data.date)}
        </span>
      ),
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
      cellRenderer: (params) => (
        <span className={params.data.oferta ? styles.greeText : ''}>
          {params.data.numero}
        </span>
      ),
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Cliente',
      headerComponent: () => <HeaderInput title="Cliente" name={'client'} />,
      cellRenderer: (params) => (
        <span className={params.data.oferta ? styles.greeText : ''}>
          {params.data.client?.razonSocial?.toUpperCase()}
        </span>
      ),
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'SubTotal',
      cellRenderer: (params) => (
        <span
          className={params.data.oferta ? styles.greeText : ''}
        >{`$ ${numberToString(params.data.subTotal)}`}</span>
      ),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Total (c/IVA)',
      cellRenderer: (params) => (
        <span
          className={params.data.oferta ? styles.greeText : ''}
        >{`$ ${numberToString(params.data.total)}`}</span>
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
          {params.data.status == 'Ajusted' ? (
            <Label
              color="teal"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Ajustada
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
          {params.data.status == 'Paid' ? (
            <Label
              color="green"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Pagada
            </Label>
          ) : null}
        </div>
      ),
      filter: false,
      flex: 1,
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
          refreshOrders={() => dispatch(searchSellOrderRequest(filterSellOrder))}
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

  const filterSellOrder = useSelector((state) => state.filterSellOrder);
  const dataMemo = useMemo(() => data, [filterSellOrder, data?.list?.length]);

  const selectChange = (e, d) => {
    dispatch(setFilterSellOrder({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterSellOrder({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      dispatch(searchSellOrderRequest(filterSellOrder));
    }, 500); // Cambia 500 ms por el tiempo de espera que prefieras

    return () => {
      clearTimeout(debounceTimeout);
      dispatch(resetOrderState());
    };
  }, [filterSellOrder]);

  useEffect(() => {
    return () => {
      dispatch(resetFilterSellOrder());
    };
  }, []);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 600, marginTop: '-20px' }}
    >
      <AgGridReact
        rowData={dataMemo?.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${data?.totalPages} páginas con ${data?.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterSellOrder.pageSize}
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
            activePage={filterSellOrder.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={data?.totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default SellOrderTable;
