import React from 'react';
import styles from './addUser.module.css';
import SellerFormContainer from '../../containers/SellerFormContainer';

function AddUser() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Registrar vendedor</h6>
      <div>
        <SellerFormContainer />
      </div>
    </div>
  );
}

export default AddUser;
