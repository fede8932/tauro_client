import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './pendingTable.module.css';
import { dateConverter } from '../../../utils';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import { delPendingsRegRequest } from '../../../redux/pending';

const CustomComp = ({ data }) => {
  // console.log(data)
  const dispatch = useDispatch()
  return (
    <div className={styles.buttonContainer}>
      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Eliminar"
          fn={() => dispatch(delPendingsRegRequest(data.id))}
          icon="fa-regular fa-trash-can"
          iconInitialStyle="iconStyleRed"
        />
      </ProtectedComponent>
    </div>
  );
};

function PendingRegistryTable(porps) {
  const { data } = porps;
  const dispatch = useDispatch();

  let columnInitialState = [
    {
      headerName: 'Fecha',
      valueGetter: ({ data }) => dateConverter(data.createdAt),
      flex: 4,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Cantidad',
      valueGetter: ({ data }) => data.amount,
      flex: 3,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Pendiente',
      valueGetter: ({ data }) => data.pending,
      flex: 3,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => <CustomComp data={params.data} />,
      flex: 3,
      sortable: false,
      filter: false,
    },
  ];

  const [columnDefs, setColumnDefs] = useState(columnInitialState);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  return (
    <div className={'ag-theme-quartz'} style={{ height: 400 }}>
      <AgGridReact
        rowData={data.registers}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}

export default PendingRegistryTable;
