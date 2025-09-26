import React, { useState } from 'react';
import styles from './sellReport.module.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetFilterReport,
  setFilterReport,
} from '../../redux/filtersSellReports';
import LibreSelect from '../../commonds/libreSelect/LibreSelect';
import SellReportTable from '../tables/sellReportTable/SellReportTable';
import SimpleInputFile from '../../commonds/simpleInputFile/SimpleInputFile';

function SellReportComponent(props) {
  const {
    reportState,
    genOrder,
    brands,
    clients,
    exportar,
    exportLoading,
    importLoading,
    setImportfile,
  } = props;

  const dispatch = useDispatch();
  const filterReport = useSelector((state) => state.filterSellReport);

  const { RangePicker } = DatePicker;
  const { data, loading } = reportState;
  const [isEmpty, setIsEmpty] = useState(false);

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      // Convertir las fechas a objetos Date
      const startDateUTC = new Date(dates[0].toISOString());
      const endDateUTC = new Date(dates[1].toISOString());

      // Establecer la hora de la fecha de inicio a 00:00:00 UTC
      startDateUTC.setUTCHours(0, 0, 0, 0);

      // Establecer la hora de la fecha final a 23:59:59.999 UTC
      endDateUTC.setUTCHours(23, 59, 59, 999);

      const filters = [
        {
          name: 'rangeDate',
          value: [startDateUTC.toISOString(), endDateUTC.toISOString()],
        },
        { name: 'page', value: 1 },
      ];

      dispatch(setFilterReport(filters));
    }
  };

  const handleSelectChange = (obj) => {
    const filters = [obj, { name: 'page', value: 1 }];
    dispatch(setFilterReport(filters));
  };
  // console.log(filterReport);
  const completeBrand = brands
    ? [{ value: '', text: 'Ninguno' }, ...brands]
    : [];
  const completeClient = clients
    ? [{ value: '', text: 'Ninguno' }, ...clients]
    : [];

  return (
    <div className={styles.formContainer}>
      <div className={styles.subFormContainer}>
        <div className={styles.searchContainer}>
          <div className={styles.filterContainer}>
            <div className={styles.rangeContainer}>
              <RangePicker
                onChange={handleDateRangeChange}
                style={{ borderColor: isEmpty ? 'red' : null }}
              />
            </div>
            <LibreSelect
              value={filterReport.clientId}
              width="small"
              placeholder="Sel. cliente"
              arrayOptions={completeClient}
              onChange={(value) => {
                handleSelectChange({
                  name: 'clientId',
                  value: Number(value),
                });
              }}
            />
            <div style={{ marginLeft: '5px' }}></div>
            <LibreSelect
              value={filterReport.brandId}
              width="small"
              placeholder="Sel. marca"
              arrayOptions={completeBrand}
              onChange={(value) => {
                handleSelectChange({ name: 'brandId', value: Number(value) });
              }}
            />
            <div style={{ marginLeft: '5px' }}></div>
            <Button
              onClick={() => {
                dispatch(resetFilterReport(null));
              }}
              type="button"
              style={{
                backgroundColor: 'grey',
                border: '1px solid grey',
                height: '32px',
                width: '100px',
                marginLeft: '10px',
              }}
            >
              {!loading ? (
                'Limpiar'
              ) : (
                <Spinner animation="border" variant="light" size="sm" />
              )}
            </Button>
            <Button
              onClick={exportar}
              type="button"
              style={{
                height: '32px',
                width: '100px',
                marginLeft: '10px',
              }}
            >
              {!exportLoading ? (
                'Exportar'
              ) : (
                <Spinner animation="border" variant="light" size="sm" />
              )}
            </Button>
            <SimpleInputFile
              importLoading={importLoading}
              setFile={setImportfile}
            />
          </div>
          <Button
            type="button"
            onClick={genOrder}
            style={{
              backgroundColor: 'grey',
              border: '1px solid grey',
              height: '32px',
              width: '150px',
              marginLeft: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <i className="fa-solid fa-cart-arrow-down"></i>
              {!loading ? (
                'Nuevo pedido'
              ) : (
                <Spinner animation="border" variant="light" size="sm" />
              )}
            </div>
          </Button>
        </div>
      </div>
      <div style={{ height: '650px' }}>
        <SellReportTable />
      </div>
    </div>
  );
}

export default SellReportComponent;
