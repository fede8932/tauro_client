import React from 'react';
import styles from './addFac.module.css';
import AddDataFacContainer from '../../containers/AddDataFacContainer';

function AddFactView(props) {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Carga de factura</h6>
      <AddDataFacContainer {...props} />
    </div>
  );
}

export default AddFactView;
