import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertirFechaISOaDDMMYYYYHHMM,
  getBillType,
  numberToString,
} from '../../../utils';
import styles from './clientAcountTables.module.css';
import { MovTypeEnum } from '../../../enum/MovEnum';
import {
  resetBillsProductState,
  searchBillsByProductsRequest,
} from '../../../redux/bilssByProducts';

function BillsByProduct(props) {
  const { clientId, productId, brandId } = props;
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.billsByProducts);

  let columnInitialState = [
    {
      headerName: 'Fecha',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {convertirFechaISOaDDMMYYYYHHMM(params.data.fecha)}
        </span>
      ),
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Comprobante N°',
      cellRenderer: (params) => (
        <span
          className={params.data.esOferta ? styles.greenRow : ''}
        >{params.data.numComprobante}</span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Tipo',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {getBillType(MovTypeEnum[params.data.type], params.data.billType)?.toUpperCase()}
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
          className={params.data.esOferta ? styles.greenRow : ''}
        >{`$${numberToString(params.data.total)}`}</span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Cliente',
      cellRenderer: (params) => (
        <span
          className={params.data.esOferta ? styles.greenRow : ''}
        >{params.data?.currentAcount?.client?.razonSocial?.toUpperCase()}</span>
      ),
      filter: false,
      flex: 1,
    },
    // {
    //   headerName: 'Acciones',
    //   cellRenderer: (params) => <div></div>,
    //   filter: false,
    //   flex: 1,
    // },
  ];

  const [columnDefs, setColumnDefs] = useState(columnInitialState);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  useEffect(() => {
    dispatch(searchBillsByProductsRequest({ productId, brandId, clientId }));
    return () => {
      dispatch(resetBillsProductState());
    };
  }, [clientId, brandId, productId]);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 480, marginTop: '5px' }}
    >
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}

export default BillsByProduct;
