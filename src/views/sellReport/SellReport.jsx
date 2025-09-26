import React, { useEffect } from 'react';
import styles from './sellReport.module.css';
import SellReportContainer from '../../containers/SellReportContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getDateReportRequest } from '../../redux/dateReport';
import { dateConverter } from '../../utils';

function SellReport() {
  const dispatch = useDispatch();
  const dateReport = useSelector((state) => state.dateReport);
  useEffect(() => {
    dispatch(getDateReportRequest());
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <div className={styles.titleContainer}>
        <h6 className={styles.formTitle}>Reporte de ventas</h6>
        <span className={styles.actualizacion}>
          Último pedido:{' '}
          <span style={{ fontWeight: '500' }}>
            {dateConverter(dateReport.data?.date)}
          </span>
        </span>
      </div>
      <div>
        <SellReportContainer />
      </div>
    </div>
  );
}

export default SellReport;
