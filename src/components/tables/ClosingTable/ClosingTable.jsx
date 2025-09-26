import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { convertirFechaISOaDDMMYYYYHHMM } from '../../../utils';
import { Pagination, Select } from 'semantic-ui-react';
import styles from './clientAcountTables.module.css';
import {
  finishClosingRequest,
  resetSearchClousing,
  searchClousingRequest,
} from '../../../redux/cloausing';
import { setFilterClosing } from '../../../redux/filtersClosing';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import Swal from 'sweetalert2';
import CustomModal from '../../../commonds/customModal/CustomModal';
import ClosingDetail from '../../closingDetail/ClosingDetail';

const CustomActionComp = ({ data }) => {
  const dispatch = useDispatch();
  const paymentRec = (data) => {
    Swal.fire({
      title: 'Confirmar recepción?',
      text: `Vas a recibir un pago por $ ${data.totalCierre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(finishClosingRequest(data.id))
          .then((res) => {
            if (res.error) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${res.error.message}`,
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 2500,
              });
              return;
            }
            Swal.fire({
              title: 'Recibido!',
              text: 'Recibiste el pago con éxito',
              icon: 'success',
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 1000,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Error: ${error.message}`,
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 2500,
            });
          });
      }
    });
  };
  return (
    <div className={styles.buttonContainer}>
      <ProtectedComponent listAccesss={[1, 2, 5]}>
        <CustomModal
          title="Detalle de cierre"
          size="xl"
          actionButton={
            <button className={styles.iconStyleBlue}>
              <i className="fa-solid fa-circle-info"></i>
            </button>
          }
          bodyModal={(props) => (
            <ClosingDetail id={data.id} {...props} />
          )}
        />
        <IconButonUsersTable
          disabled={data.completed}
          popupText="Marcar como pagado"
          fn={() => {
            paymentRec(data);
          }}
          icon="fa-solid fa-money-check-dollar"
          iconInitialStyle={data.completed ? 'iconStyleGrey' : 'iconStyleTeal'}
        />
      </ProtectedComponent>
    </div>
  );
};

function ClosingTable() {
  const dispatch = useDispatch();

  let columnInitialState = [
    {
      headerName: 'N° cierre',
      valueGetter: (params) => params.data.id,
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Fecha',
      valueGetter: (params) =>
        convertirFechaISOaDDMMYYYYHHMM(params.data.createdAt),
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Vendedor',
      valueGetter: (params) =>
        `${params.data.seller?.user?.name} ${params.data.seller?.user?.lastName}`.toUpperCase(),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Total cierre',
      valueGetter: (params) => `$ ${params.data.totalCierre}`,
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Efectivo',
      valueGetter: (params) => `$ ${params.data.totalEfectivo}`,
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Cheque',
      valueGetter: (params) => `$ ${params.data.totalCheque}`,
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Trasnferencia',
      valueGetter: (params) => `$ ${params.data.totalTransferencia}`,
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Fecha de recep.',
      valueGetter: (params) =>
        params.data.completed
          ? convertirFechaISOaDDMMYYYYHHMM(params.data.completed)
          : '-',
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Usuario recep.',
      valueGetter: (params) =>
        params.data.userReceiving
          ? `${params.data.userReceiving.name} ${params.data.userReceiving.lastName}`.toUpperCase()
          : '-',
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Demora',
      valueGetter: (params) =>
        params.data.userReceiving
          ? `${params.data.userReceiving.name} ${params.data.userReceiving.lastName}`.toUpperCase()
          : '-',
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

  //_________NUEVO
  const filterCosing = useSelector((state) => state.filterClosing);
  const closings = useSelector((state) => state.closing);

  const selectChange = (e, d) => {
    dispatch(setFilterClosing({ name: 'pageSize', value: d.value }));
  };

  const changePage = (e, d) => {
    dispatch(setFilterClosing({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    dispatch(searchClousingRequest(filterCosing));

    return () => {
      dispatch(resetSearchClousing());
    };
  }, [filterCosing]);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 480, marginTop: '5px' }}
    >
      <AgGridReact
        rowData={closings.ansSearch?.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${closings.ansSearch?.totalPages} páginas con ${closings.ansSearch?.totalResults} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterCosing.pageSize}
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
            activePage={filterCosing.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={closings.ansSearch?.totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default ClosingTable;
