import React from 'react';
import styles from './addBrand.module.css';
import AddBrandContainer from '../../containers/AddBrandContainer';

function AddBrand() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Registrar marca</h6>
      <div>
        <AddBrandContainer />
      </div>
    </div>
  );
}

export default AddBrand;
