import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertirFechaISOaDDMMYYYY,
  redondearADosDecimales,
} from '../../../utils';
import { Pagination, Select } from 'semantic-ui-react';
import styles from './comitionsTable.module.css';
import { useLocation } from 'react-router';
import { setFilterComis } from '../../../redux/filtersComis';
import { getLiquidation } from '../../../redux/sellerLiquidations';
import CustomModal from '../../../commonds/customModal/CustomModal';
import ComitionsTable from '../comitionsTable/ComitionsTable';

const CustomComp = ({ data, printResume }) => {
  // console.log(printResume);
  return (
    <div className={styles.buttonContainer}>
      <CustomModal
        size="lg"
        title="Detalle de liquidación"
        actionButton={
          <i
            className={`fa-solid fa-circle-info ${styles.iButton} ${styles.iconButton}`}
          ></i>
        }
        bodyModal={(props) => <ComitionsTable {...props} />}
        bodyProps={{ liqId: data.id }}
      />
      <i
        onClick={() => printResume(data.id, false)}
        className={`fa-solid fa-print ${styles.pButton} ${styles.iconButton}`}
      ></i>
      <i
        onClick={() => printResume(data.id, true)}
        className={`fa-solid fa-print ${styles.rButton} ${styles.iconButton}`}
      ></i>
    </div>
  );
};

function LiquidationsTable(props) {
  const { printResume } = props;
  const sellerId = Number(useLocation().pathname.split('/')[3]);
  const dispatch = useDispatch();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Fecha',
      valueGetter: (params) =>
        convertirFechaISOaDDMMYYYY(params.data.createdAt),
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Concepto',
      valueGetter: (params) => `LIQ-${params.data.id}`,
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Monto',
      valueGetter: (params) => `$ ${redondearADosDecimales(params.data.total)}`,
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => (
        <CustomComp data={params.data} printResume={printResume} />
      ),
      field: 'id',
      sortable: false,
      filter: false,
      flex: 1,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  const { loading, error, data } = useSelector((state) => state.liquidations);

  // console.log(data);

  const filterCom = useSelector((state) => state.filterCom);

  const selectChange = (e, d) => {
    dispatch(setFilterComis({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterComis({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    let getData = { sellerId: sellerId, ...filterCom };
    dispatch(getLiquidation(getData));
  }, [filterCom]);

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
        <span>{`Se encontraron ${data.totalPages} páginas con ${data.totalResults} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterCom.pageSize}
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
            activePage={filterCom.page}
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

export default LiquidationsTable;
