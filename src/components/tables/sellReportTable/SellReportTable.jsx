import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Select } from 'semantic-ui-react';
import styles from './sellReportTable.module.css';
import {
  resetFilterReport,
  setFilterReport,
} from '../../../redux/filtersSellReports';
import { getReportRequest, resetSellReports } from '../../../redux/report';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import CustomModal from '../../../commonds/customModal/CustomModal';
import BillsByProduct from '../BillsByProduct/BillsByProduct';

const CustomComp = ({ data, props }) => {
  const filtersReports = useSelector((state) => state.filterSellReport);
  const { product, brand } = data;
  return (
    <div className={styles.buttonContainer}>
      <ProtectedComponent listAccesss={[1, 2]}>
        <CustomModal
          title="Listado de facturas"
          size="lg"
          actionButton={
            <buton className={styles.iconStyleTeal}>
              <i class="fa-solid fa-file-invoice-dollar"></i>
            </buton>
          }
          bodyModal={() => (
            <BillsByProduct
              productId={product.id}
              brandId={brand.id}
              clientId={filtersReports.clientId}
            />
          )}
        />
      </ProtectedComponent>
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filtersReports = useSelector((state) => state.filterSellReport);
  const [inp, setInp] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(filtersReports[name]);
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
      dispatch(
        setFilterReport([
          { name: 'page', value: 1 },
          { name, value },
        ])
      );
      // if (value === '') {
      //   setInp(false);
      // }
    }, 500); // El valor 500 representa el tiempo de espera en milisegundos
  };

  const handleClickOutside = () => {
    if (!filtersReports[name]) {
      setInp(false);
    }
  };

  useEffect(() => {
    if (inp && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inp]);

  useEffect(() => {
    dispatch(getReportRequest(filtersReports));
    return () => {
      dispatch(resetSellReports(null));
    };
  }, [filtersReports.code]);

  useEffect(() => {
    if (inp) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filtersReports, inp]);

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

function SellReportTable() {
  const dispatch = useDispatch();
  const listReport = useSelector((state) => state.report);

  const filtersReports = useSelector((state) => state.filterSellReport);

  const { totalPages, totalRows, list } = listReport.data;
  // console.log(list);

  let columnInitialState = [
    {
      headerComponent: () => <HeaderInput title="Código" name={'code'} />,
      valueGetter: ({ data }) => data.product?.article,
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Descripción',
      valueGetter: ({ data }) => data.product?.description,
      flex: 5,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Marca',
      valueGetter: ({ data }) => data.brand?.name,
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Cantidad',
      valueGetter: ({ data }) => data.amount,
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => <CustomComp data={params.data} props={{}} />,
      field: 'actions',
      sortable: false,
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

  const selectChange = (e, d) => {
    dispatch(setFilterReport([{ name: 'pageSize', value: d.value }]));
  };
  const changePage = (e, d) => {
    dispatch(setFilterReport([{ name: 'page', value: d.activePage }]));
  };

  useEffect(() => {
    return () => {
      dispatch(resetFilterReport(null));
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
        <span>{`Se encontraron ${totalPages} páginas con ${totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filtersReports.pageSize}
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
            activePage={filtersReports.page}
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

export default SellReportTable;
