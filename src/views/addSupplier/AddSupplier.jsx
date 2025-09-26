import React from 'react';
import styles from './addSupplier.module.css';
import SupplierFormContainer from '../../containers/SupplierFormContainer';

function AddSupplier() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Registrar proveedor</h6>
      <div>
        <SupplierFormContainer />
      </div>
    </div>
  );
}

export default AddSupplier;
