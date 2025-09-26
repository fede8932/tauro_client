import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { convertirFechaISOaDDMMYYYYHHMM, numberToString } from '../../../utils';
import { Pagination, Radio, Select } from 'semantic-ui-react';
import styles from './clientAcountTables.module.css';
import {
  resetFilterMovements,
  setFilterMovements,
} from '../../../redux/filtersMovements';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import {
  deletePaymentOrderRequest,
  searchOrderRequest,
  updatePaymentOrderRequest,
} from '../../../redux/supPaymentOrder';
import { setfiltersPaymentOrder } from '../../../redux/filtersPaymentOrder';
import { PaymentStatusEnum } from '../../../enum/PaymentStatusEnum';
import Swal from 'sweetalert2';
import { printPaymentOrderRequest } from '../../../request/supMovementRequest';
import { useNavigate } from 'react-router';

//#region CustomAction
const CustomActionComp = ({ data }) => {
  const dispatch = useDispatch();

  const updateOrder = (status) => {
    if (status == 1 || status == 2) {

      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Vas a actualizar la orden',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      })
        .then((result) => {
          if (result.isConfirmed) {
            // Acción si se confirma
            dispatch(
              updatePaymentOrderRequest({ id: data.id, status: status })
            ).then((res) => {
              if (res.error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Ocurrio un error',
                });
                return;
              }
              Swal.fire({
                title: 'Actualizado!',
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
    } else {

      Swal.fire({
        title: 'Ingresar pago',
        html: `
      <label style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <input type="checkbox" id="completePayment" style="margin-right: 5px;"> Completar
      </label>
      <input type="number" id="paymentAmount" class="swal2-input" placeholder="Monto">
    `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
          const amountInput = Swal.getPopup().querySelector('#paymentAmount');
          const completeCheckbox = Swal.getPopup().querySelector('#completePayment');

          // Maneja el estado del input según el checkbox
          completeCheckbox.addEventListener('change', () => {
            amountInput.disabled = completeCheckbox.checked;
            if (completeCheckbox.checked) amountInput.value = '';
          });
        },
        preConfirm: () => {
          const amount = Swal.getPopup().querySelector('#paymentAmount').value;
          const complete = Swal.getPopup().querySelector('#completePayment').checked;

          // Validación: si no está completo, el monto debe ser válido
          if (!complete && (!amount || parseFloat(amount) <= 0)) {
            Swal.showValidationMessage('Debes ingresar un monto válido si no completas el pago');
            return false;
          }

          return { amount, complete };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { amount, complete } = result.value;

          dispatch(updatePaymentOrderRequest({
            id: data.id,
            status: status,
            partialAmount: complete ? null : parseFloat(amount),
            complete: complete
          }))
            .then((res) => {
              if (res.error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Ocurrió un error',
                });
                return;
              }
              Swal.fire({
                title: 'Actualizado!',
                icon: 'success',
                draggable: true,
              });
            });
        } else {
          console.log('Ingreso de pago cancelado');
        }
      }).catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error',
        });
      });
    }
  };



  const deletePaymentOrder = () => {
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
          dispatch(deletePaymentOrderRequest(data.id)).then((res) => {
            if (res.error) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrio un error',
              });
              return;
            }
            Swal.fire({
              title: 'Actualizado!',
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

  const printPayment = async () => {
    const { extension, base64 } = await printPaymentOrderRequest(data.id);
    if (extension === 'pdf' && base64) {
      // Decodificar base64 a binario
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }
  };
  const user = useSelector((state) => state.user).data;

  return (
    <div className={styles.buttonContainer}>
      <ProtectedComponent listAccesss={[1, 2, 5]}>
        {data.status < 2 ? (
          <>
            {user?.rolId != 5 || (user?.rolId == 5 && data.status == 1) ? (
              <IconButonUsersTable
                popupText={
                  data.status == 0 ? 'Pasar a preparada' : 'Pasar a enviada'
                }
                fn={() => updateOrder(data.status + 1)}
                icon="fa-solid fa-arrow-up-from-bracket"
                iconInitialStyle={
                  data.status == 0 ? 'iconStyleBlue' : 'iconStyleGreen'
                }
              />
            ) : null}
          </>
        ) : null}
        <div style={{ marginLeft: '5px' }}>
          {user?.rolId != 5 ? (
            <IconButonUsersTable
              popupText="Imprimir detalle"
              fn={() => printPayment()}
              icon="fa-solid fa-print"
              iconInitialStyle="iconStyleBlue"
            />
          ) : null}
        </div>
        <div style={{ marginLeft: '5px' }}>
          {data.status < 2 && user?.rolId != 5 ? (
            <IconButonUsersTable
              popupText="Eliminar"
              fn={() => deletePaymentOrder()}
              icon="fa-regular fa-trash-can"
              iconInitialStyle="iconStyleRed"
            />
          ) : null}
        </div>
      </ProtectedComponent>
    </div>
  );
};
//#endregion

//#region HeaderInput
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
//#endregion

function SupplierPaymentTable(props) {
  const { currentAcountId } = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  let columnInitialState =
    currentAcountId > 0
      ? [
        {
          headerName: 'ID',
          cellRenderer: (params) => (
            <span>{params.data.supplierPaymentOrder.id}</span>
          ),
          flex: 1,
          filterParams: {
            filterOptions: ['contains'], // Solo opción 'contains'
            suppressFilterButton: true, // Ocultar el botón del menú del filtro
          },
        },
        {
          headerName: 'Fecha',
          cellRenderer: (params) => (
            <span>{convertirFechaISOaDDMMYYYYHHMM(params.data.supplierPaymentOrder.fecha)}</span>
          ),
          flex: 1,
          filterParams: {
            filterOptions: ['contains'], // Solo opción 'contains'
            suppressFilterButton: true, // Ocultar el botón del menú del filtro
          },
        },
        {
          headerName: 'Estado',
          cellRenderer: (params) => (
            <span className={styles[PaymentStatusEnum[params.data.supplierPaymentOrder.status]]}>
              {PaymentStatusEnum[params.data.supplierPaymentOrder.status]}
            </span>
          ),
          filter: false,
          flex: 1,
          sortable: false,
        },
        {
          headerName: 'Monto',
          cellRenderer: (params) => (
            <ProtectedComponent listAccesss={[1, 2]}><span>{`$${numberToString(params.data.amount)}`}</span></ProtectedComponent>
          ),
          filter: false,
          flex: 1,
        },
        {
          headerName: 'Descuento',
          cellRenderer: (params) => (
            <ProtectedComponent listAccesss={[1, 2]}><span>{`$${numberToString(params.data.descuento)}`}</span></ProtectedComponent>
          ),
          filter: false,
          flex: 1,
        },
        {
          headerName: 'Total',
          cellRenderer: (params) => (
            <ProtectedComponent listAccesss={[1, 2]}><span>{`$${numberToString(params.data.total)}`}</span></ProtectedComponent>
          ),
          filter: false,
          flex: 1,
        },
        {
          headerName: 'Pendiente',
          cellRenderer: (params) => (
            <ProtectedComponent listAccesss={[1, 2]}><span>{`$${numberToString(params.data.supplierPaymentOrder.pendingAmount)}`}</span></ProtectedComponent>
          ),
          filter: false,
          flex: 1,
        },
        {
          headerName: 'Acciones',
          cellRenderer: (params) => <CustomActionComp data={params.data.supplierPaymentOrder} />,
          filter: false,
          flex: 1,
        },
      ]
      : [
        {
          headerName: 'Fecha',
          cellRenderer: (params) => (
            <span>{convertirFechaISOaDDMMYYYYHHMM(params.data.supplierPaymentOrder.fecha)}</span>
          ),
          flex: 1,
          filterParams: {
            filterOptions: ['contains'], // Solo opción 'contains'
            suppressFilterButton: true, // Ocultar el botón del menú del filtro
          },
        },
        {
          headerName: 'Proveedor',
          cellRenderer: (params) => (
            <span
              className={styles.link}
              onClick={() => {
                navigate(
                  `/search/acount/supplier/${params.data.supplierPaymentOrder?.currentAcount?.id}`
                );
              }}
            >
              {params.data.supplierPaymentOrder?.currentAcount?.supplier?.razonSocial?.toUpperCase() ??
                '-'}
            </span>
          ),
          flex: 1,
          filterParams: {
            filterOptions: ['contains'], // Solo opción 'contains'
            suppressFilterButton: true, // Ocultar el botón del menú del filtro
          },
        },
        {
          headerName: 'Estado',
          cellRenderer: (params) => (
            <span className={styles[PaymentStatusEnum[params.data.supplierPaymentOrder?.status]]}>
              {PaymentStatusEnum[params.data.supplierPaymentOrder?.status]}
            </span>
          ),
          filter: false,
          flex: 1,
          sortable: false,
        },
        {
          headerName: 'Monto',
          cellRenderer: (params) => (
            <ProtectedComponent listAccesss={[1, 2]}><span>{`$${numberToString(params.data.total)}`}</span></ProtectedComponent>
          ),
          filter: false,
          flex: 1,
        },
        {
          headerName: 'Acciones',
          cellRenderer: (params) => <CustomActionComp data={params.data.supplierPaymentOrder} />,
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

  const paymentOrderState = useSelector((state) => state.supPaymentOrder);

  const data = useMemo(() => {
    return paymentOrderState.data;
  }, [paymentOrderState.data]);

  const filterPaymentOrder = useSelector((state) => state.filterPaymentOrder);
  // console.log(filterPaymentOrder);

  const selectChange = (e, d) => {
    dispatch(setfiltersPaymentOrder({ name: 'size', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setfiltersPaymentOrder({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetFilterMovements());
    };
  }, []);

  useEffect(() => {
    dispatch(
      searchOrderRequest({ id: currentAcountId, ...filterPaymentOrder })
    );
  }, [filterPaymentOrder, currentAcountId, paymentOrderState.actualizar]);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 480, marginTop: '5px' }}
    >
      <div
        style={{
          marginTop: '10px',
          marginBottom: '10px',
          marginLeft: '10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Radio
          toggle
          defaultChecked={filterPaymentOrder.pending}
          onChange={() => {
            dispatch(
              setfiltersPaymentOrder({
                name: 'pending',
                value: !filterPaymentOrder.pending,
              })
            );
          }}
          style={{ margin: '0px 5px' }}
        />
        <label>Solo pendiente</label>
      </div>
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
              defaultValue={filterPaymentOrder.size}
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
            activePage={filterPaymentOrder.page}
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

export default SupplierPaymentTable;
