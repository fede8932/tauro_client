import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertirFechaISOaDDMMYYYYHHMM,
  pickingOrderString,
  redondearADosDecimales,
} from '../../../utils';
import { Checkbox, Label, Pagination, Select } from 'semantic-ui-react';
import styles from './comitionsTable.module.css';
import {
  searchPickingOrderRequest,
  toggleMarc,
} from '../../../redux/clientPickingOrder';
import {
  resetFilterPickinngs,
  setFilterPickinngs,
} from '../../../redux/filtersPickings';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import ActionModalContainer from '../../../containers/ActionModalContainer';

const CustomActionComp = ({ data, printFn, updatePicking }) => {
  // console.log(data);
  return (
    <div className={styles.buttonContainer}>
      <ActionModalContainer
        size="xl"
        selectedId={data.purchaseOrderId}
        title="Información de orden"
        type="viewControlOrder"
        icon="fa-solid fa-circle-info fa-lg"
        popupText="Detalle de orden"
      />
      <IconButonUsersTable
        disabled={data.status}
        popupText="Imprimir"
        fn={async () => {
          await printFn(data.id);
        }}
        icon={'fa-solid fa-print'}
        iconInitialStyle={data.status ? 'iconStyleGrey' : 'iconStyleBlue'}
      />
      <IconButonUsersTable
        disabled={data.status == 1}
        popupText="Confirmar"
        fn={() => {
          updatePicking(data.id);
        }}
        icon={'fa-solid fa-clipboard-check'}
        iconInitialStyle={data.status == 1 ? 'iconStyleGrey' : 'iconStyleGreen'}
      />
    </div>
  );
};

const CheckedComponent = ({ data }) => {
  const dispatch = useDispatch();
  const { pickingOrders } = useSelector((state) => state.pickingOrders).data;
  const item = pickingOrders.find((item) => item.id == data.id);
  return (
    <Checkbox
      disabled={data.status == 1}
      checked={item?.marc}
      onChange={() => dispatch(toggleMarc(data.id))}
    />
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filterPickings = useSelector((state) => state.filterPickings);
  const [inp, setInp] = useState(false);
  const inputRef = useRef(null);

  const onTitleClick = () => {
    setInp(true);
  };
  const onInputChange = (e) => {
    const value = e.target.value;
    dispatch(setFilterPickinngs({ name: 'page', value: 1 }));
    dispatch(setFilterPickinngs({ name, value }));
    if (value == '') {
      setInp(false);
    }
  };

  const handleClickOutside = () => {
    if (!filterPickings[name]) {
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
  }, [filterPickings, inp]);

  return inp ? (
    <input
      ref={inputRef}
      className={styles.input}
      value={filterPickings[name]}
      onChange={onInputChange}
    />
  ) : (
    <span onClick={onTitleClick}>{title}</span>
  );
};

function PickingTable(props) {
  const { updatePicking, printFn } = props;
  // console.log(props);
  const dispatch = useDispatch();

  let columnInitialState = [
    {
      headerName: 'Marcar',
      cellRenderer: (params) => <CheckedComponent data={params.data} />,
      flex: 1,
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
      headerName: 'Núm de picking',
      field: 'numero',
      headerComponent: () => (
        <HeaderInput title="Núm de picking" name={'number'} />
      ),
      valueGetter: (params) => pickingOrderString(params.data.id),
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Cliente',
      headerComponent: () => <HeaderInput title="Cliente" name={'client'} />,
      valueGetter: (params) => params.data.purchaseOrder.client?.razonSocial,
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Orden de compra',
      valueGetter: (params) => params.data.purchaseOrder.numero,
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Remito',
      valueGetter: (params) =>
        params.data.numRemito
          ? `N° ${redondearADosDecimales(params.data.numRemito)}`
          : '',
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Preparado',
      valueGetter: (params) =>
        params.data.numRemito
          ? convertirFechaISOaDDMMYYYYHHMM(params.data.updatedAt)
          : '',
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Estado',
      cellRenderer: (params) => (
        <div className={styles.statusCell}>
          {params.data.status == 1 ? (
            <Label
              color="green"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Preparado
            </Label>
          ) : params.data.print ? (
            <Label
              color="yellow"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Pendiente
            </Label>
          ) : (
            <Label
              color="orange"
              style={{
                width: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Recibido
            </Label>
          )}
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
          updatePicking={updatePicking}
          printFn={printFn}
        />
      ),
      filter: false,
      flex: 1,
    },
  ];

  const [columnDefs, setColumnDefs] = useState(columnInitialState);

  const onColumnMoved = (event) => {
    console.log(event);
  };

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  const { loading, error, data } = useSelector((state) => state.pickingOrders);

  // console.log(data);

  const filterPickings = useSelector((state) => state.filterPickings);

  const renderData = useMemo(
    () => data.pickingOrders,
    [filterPickings, loading]
  );

  const [debouncedFilter, setDebouncedFilter] = useState(filterPickings);
  // Para hacer el debounce con un delay de 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filterPickings);
    }, 500); // 500ms de delay

    // Limpia el timeout si el filtro cambia antes de los 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [filterPickings]);

  const selectChange = (e, d) => {
    dispatch(setFilterPickinngs({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterPickinngs({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    if (debouncedFilter) {
      dispatch(searchPickingOrderRequest(debouncedFilter));
    }
  }, [debouncedFilter, dispatch]);
  useEffect(() => {
    return () => {
      dispatch(resetFilterPickinngs());
    };
  }, []);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 600, marginTop: '-20px' }}
    >
      <AgGridReact
        rowData={renderData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onColumnMoved={onColumnMoved}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${data.totalPages} páginas con ${data.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterPickings.pageSize}
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
            activePage={filterPickings.page}
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

export default PickingTable;
