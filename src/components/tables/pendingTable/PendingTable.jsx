import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Select } from 'semantic-ui-react';
import styles from './pendingTable.module.css';
import {
  resetFilterPending,
  setFilterPending,
} from '../../../redux/filtersPending';
import {
  resetPendingList,
  searchPendingsRequest,
} from '../../../redux/pending';
// import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
// import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import CustomModal from '../../../commonds/customModal/CustomModal';
import ViewPendingDetail from '../../../containers/ViewPendingDetail';

const CustomComp = ({ data, props }) => {
  const { deletePending } = props;
  return (
    <div className={styles.buttonContainer}>
      <CustomModal
        title="Detalle de pendientes"
        size="lg"
        actionButton={
          <buton className={`${styles.iconB} ${styles.blueIcon}`}>
            <i class="fa-solid fa-circle-info"></i>
          </buton>
        }
        bodyModal={(props) => <ViewPendingDetail {...props} data={data} />}
      />
      {/* <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Eliminar"
          fn={() => deletePending(data.id)}
          icon="fa-regular fa-trash-can"
          iconInitialStyle="iconStyleRed"
        />
      </ProtectedComponent> */}
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filtersPending = useSelector((state) => state.filterPending);
  const [inp, setInp] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(filtersPending[name]);
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
      dispatch(setFilterPending({ name, value }));
      dispatch(setFilterPending({ name: 'page', value: 1 }));
      // if (value === '') {
      //   setInp(false);
      // }
    }, 500); // El valor 500 representa el tiempo de espera en milisegundos
  };

  const handleClickOutside = () => {
    if (!filtersPending[name]) {
      setInp(false);
    }
  };

  useEffect(() => {
    if (inp && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inp]);

  useEffect(() => {
    dispatch(searchPendingsRequest(filtersPending));
    return () => {
      dispatch(resetPendingList(null));
    };
  }, [filtersPending]);

  useEffect(() => {
    if (inp) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filtersPending, inp]);

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

function PendingTable(porps) {
  const { deletePending } = porps;
  const dispatch = useDispatch();

  const filtersPending = useSelector((state) => state.filterPending);
  const listPending = useSelector((state) => state.pendings);

  const { totalPages, totalResults, list } = listPending.data;
  // console.log(filtersPending);

  let columnInitialState = [
    {
      headerComponent: () => <HeaderInput title="Código" name={'article'} />,
      valueGetter: ({ data }) => data.product?.article,
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerComponent: () => <HeaderInput title="Descripción" name={'description'} />,
      valueGetter: ({ data }) => data.product?.description,
      flex: 5,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Marca',
      valueGetter: ({ data }) => data.product.brand?.name,
      flex: 2,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Cantidad',
      valueGetter: ({ data }) => data.amount,
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Cliente',
      valueGetter: ({ data }) => data.client?.razonSocial?.toUpperCase(),
      filter: false,
      flex: 3,
      sortable: false,
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => (
        <CustomComp
          data={params.data}
          props={{ deletePending: deletePending }}
        />
      ),
      flex: 1,
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

  const selectChange = (e, d) => {
    dispatch(setFilterPending([{ name: 'pageSize', value: d.value }]));
  };
  const changePage = (e, d) => {
    dispatch(setFilterPending([{ name: 'page', value: d.activePage }]));
  };

  useEffect(() => {
    return () => {
      dispatch(resetFilterPending(null));
    };
  }, []);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 600, marginTop: '-10px' }}
    >
      <AgGridReact
        rowData={list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${totalPages} páginas con ${totalResults} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filtersPending.pageSize}
              onChange={selectChange}
              options={[
                { key: 20, value: 20, text: 20 },
                { key: 50, value: 50, text: 50 },
                { key: 100, value: 100, text: 100 },
              ]}
            />
          </div>
          <Pagination
            boundaryRange={0}
            activePage={filtersPending.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default PendingTable;
