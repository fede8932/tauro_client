import React, { useEffect } from 'react';
import styles from './pos.module.css';
import { useDispatch } from 'react-redux';
import { resetProductSearch } from '../../redux/product';
import { resetFilterProduct } from '../../redux/filtersProducts';
import PosContainer from '../../containers/PosContainer';

function Pos() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetProductSearch());
      dispatch(resetFilterProduct());
    };
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Punto de venta</h6>
      <div>
        <PosContainer />
      </div>
    </div>
  );
}

export default Pos;
