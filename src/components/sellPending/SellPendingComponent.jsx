import React, { useMemo, useState } from 'react';
import styles from './sellPending.module.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import LibreSelect from '../../commonds/libreSelect/LibreSelect';
import PendingTable from '../tables/pendingTable/PendingTable';
import {
  resetFilterPending,
  setFilterPending,
} from '../../redux/filtersPending';
// import InputSearch from '../../commonds/inputSearch/InputSearch';

function SellPendingComponent(props) {
  const {
    reportState,
    brands,
    clients,
    exportar,
    exportLoading,
    deletePending,
  } = props;

  const dispatch = useDispatch();
  const filterPending = useSelector((state) => state.filterPending);

  console.log(clients);

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

      dispatch(
        setFilterPending({
          name: 'rangeDate',
          value: [startDateUTC.toISOString(), endDateUTC.toISOString()],
        })
      );
      dispatch(setFilterPending({ name: 'page', value: 1 }));
    }
  };

  const handleSelectChange = (obj) => {
    dispatch(setFilterPending({ name: 'page', value: 1 }));
    dispatch(setFilterPending(obj));
  };
  // console.log(filterReport);
  const completeBrand = brands
    ? [{ value: '', text: 'Ninguno' }, ...brands]
    : [];
  const completeClient = useMemo(() => {
    if (!Array.isArray(clients)) return [{ value: '', text: 'Ninguno' }];
    return [{ value: '', text: 'Ninguno' }, ...clients];
  }, [clients]);

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
            {/* <InputSearch /> */}
            <LibreSelect
              value={filterPending.clientId}
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
              value={filterPending.brandId}
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
                dispatch(resetFilterPending(null));
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
          </div>
        </div>
      </div>
      <div style={{ height: '650px' }}>
        <PendingTable deletePending={deletePending} />
      </div>
    </div>
  );
}

export default SellPendingComponent;
