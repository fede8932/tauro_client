import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertirFechaISOaDDMMYYYYHHMM_V2,
  getBillType,
  numberToString,
} from '../../../utils';
import { Checkbox, Pagination, Select } from 'semantic-ui-react';
import styles from './clientAcountTables.module.css';
import { MovTypeEnum } from '../../../enum/MovEnum';
import { setFilterSupMovements } from '../../../redux/filtersSupMovements';
import {
  deleteMovSupplierRequest,
  getMovSupplierRequest,
  marcSupReport,
  setActualizar,
} from '../../../redux/supCurrentAcount';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import Swal from 'sweetalert2';
import CustomModal from '../../../commonds/customModal/CustomModal';
import { Button } from 'react-bootstrap';
import NewSupCaMovement from '../../newSupCAMovement/NewSupCaMovement';

const CustomComp = ({ data }) => {
  const { list } = useSelector((state) => state.supCurrentAcount).data;
  const selectMov = list?.find((m) => m.id == data.id);
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(marcSupReport(data.id));
  };
  
  // Solo permitir selección si hay saldo pendiente (pendingAmount existe y > 0)
  const hasPendingBalance = data.pendingAmount && data.pendingAmount > 0;
  
  return (
    <div className={styles.chContainer}>
      <Checkbox
        disabled={data.supplierPaymentOrderId || !hasPendingBalance}
        onChange={onClick}
        checked={selectMov?.marc}
      />
    </div>
  );
};

const CustomActionComp = ({ data }) => {
  const dispatch = useDispatch();
  const deleteMov = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Vas a eliminar la orden',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    })
      .then((result) => {
        if (result.isConfirmed) {
          // Acción si se confirma
          dispatch(deleteMovSupplierRequest(data.id)).then((res) => {
            console.log(res);
            if (res.error) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrio un error',
              });
              return;
            }
            dispatch(setActualizar());
            Swal.fire({
              title: 'Eliminado!',
              icon: 'success',
              draggable: true,
            });
          });
        } else {
          // Acción si se cancela
          console.log('Actualización cancelada');
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrio un error',
        });
      });
  };
  return (
    <div className={styles.buttonContainer}>
      <ProtectedComponent listAccesss={[1, 2]}>
        <CustomModal
          title={`Editar movimiento`}
          size="lg"
          actionButton={
            <div className={styles.iBtn}>
              <i className="fa-regular fa-pen-to-square"></i>
            </div>
          }
          bodyModal={(props) => <NewSupCaMovement {...props} />}
          bodyProps={{
            movement: data,
          }}
        />
      </ProtectedComponent>
      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Eliminar"
          fn={() => deleteMov()}
          icon="fa-regular fa-trash-can"
          iconInitialStyle="iconStyleRed"
        />
      </ProtectedComponent>
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filterMovements = useSelector((state) => state.filterSupMovement);
  const [inp, setInp] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(
    filterMovements[name] ?? ''
  );
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
      // Convertir a entero o null si corresponde (para orderId)
      const parsed = value === '' ? null : Number(value);
      const sendValue = isNaN(parsed) ? value : parsed;
      dispatch(setFilterSupMovements({ name: 'page', value: 1 }));
      dispatch(setFilterSupMovements({ name, value: sendValue }));
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

function SupplierAcountTable(props) {
  const { currentAcountId } = props;
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
        <span
          className={
            params.data.supplierPaymentOrder?.id ? styles.conOrden : ''
          }
        >
          {convertirFechaISOaDDMMYYYYHHMM_V2(params.data.fecha)}
        </span>
      ),
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Comprobante',
      // headerComponent: () => (
      //   <HeaderInput title="N° Comprobante" name={'numComprobante'} />
      // ),
      cellRenderer: (params) => (
        <span
          className={
            params.data.supplierPaymentOrder?.id ? styles.conOrden : ''
          }
        >
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
      headerName: 'Concepto',
      cellRenderer: (params) => (
        <span
          className={
            params.data.supplierPaymentOrder?.id ? styles.conOrden : ''
          }
        >
          {getBillType(MovTypeEnum[params.data.type], params.data.billType)}
        </span>
      ),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Monto',
      cellRenderer: (params) => (
        <span
          className={
            params.data.supplierPaymentOrder?.id ? styles.conOrden : ''
          }
        >{`$${numberToString(params.data.total)}`}</span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Monto Pendiente',
      cellRenderer: (params) => (
        <span
          className={
            params.data.supplierPaymentOrder?.id ? styles.conOrden : ''
          }
        >{`$${numberToString(params.data.pendingAmount || 0)}`}</span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Nro de Orden',
      headerComponent: () => (
        <HeaderInput title="Nro de Orden" name={'orderId'} />
      ),
      cellRenderer: (params) => {
        const idsFromFlat = Array.isArray(params.data.paymentOrderIds)
          ? params.data.paymentOrderIds
          : [];
        const idsFromNested = Array.isArray(params.data.supplierPaymentOrders)
          ? params.data.supplierPaymentOrders.filter((o) => o && o.id).map((o) => o.id)
          : [];
        const ids = idsFromFlat.length ? idsFromFlat : idsFromNested;
        const text = ids.length ? ids.join(', ') : '';
        return (
          <span className={ids.length ? styles.conOrden : ''}>{text}</span>
        );
      },
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Observaciones',
      cellRenderer: (params) => (
        <span
          className={
            params.data.supplierPaymentOrder?.id ? styles.conOrden : ''
          }
        >
          {params.data.concept}
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

  const supAcountState = useSelector((state) => state.supCurrentAcount);

  const data = useMemo(() => {
    return supAcountState.data;
  }, [supAcountState.data]);

  const filterSupMovements = useSelector((state) => state.filterSupMovement);
  // console.log(filterSupMovements);

  const selectChange = (e, d) => {
    dispatch(setFilterSupMovements({ name: 'size', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterSupMovements({ name: 'page', value: d.activePage }));
  };
  const { actualizar } = useSelector((state) => state.supCurrentAcount);

  useEffect(() => {
    return () => {
      // No reset de filtrosMovements aquí; este componente usa filterSupMovement
    };
  }, []);

  useEffect(() => {
    dispatch(
      getMovSupplierRequest({ id: currentAcountId, ...filterSupMovements })
    );
  }, [filterSupMovements, currentAcountId, actualizar]);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 480, marginTop: '5px' }}
    >
      <AgGridReact
        rowData={data?.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${data?.totalPages} páginas con ${data?.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px', position: 'relative' }}>
            <Select
              position="absolute"
              width="10px"
              defaultValue={filterSupMovements.size}
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
            activePage={filterSupMovements.page}
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

export default SupplierAcountTable;
