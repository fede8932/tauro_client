import React, { useEffect } from 'react';
import styles from './pos.module.css';
import { useDispatch } from 'react-redux';
import { resetProductEquivalenceSearch } from '../../redux/productEquivalence';
import { resetFilterProduct } from '../../redux/filtersProducts';
import PosContainerV2 from '../../containers/PosContainerV2';

function PosV2() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetProductEquivalenceSearch());
      dispatch(resetFilterProduct());
    };
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Punto de venta V2</h6>
      <div>
        <PosContainerV2 />
      </div>
    </div>
  );
}

export default PosV2;
