import React from 'react';
import styles from './sellPending.module.css';
import SellPendingContainer from '../../containers/SellPendingContainer';

function SellPending() {
  return (
    <div className={styles.addUserContainer}>
      <div className={styles.titleContainer}>
        <h6 className={styles.formTitle}>Registro de pendientes</h6>
      </div>
      <div>
        <SellPendingContainer />
      </div>
    </div>
  );
}

export default SellPending;
