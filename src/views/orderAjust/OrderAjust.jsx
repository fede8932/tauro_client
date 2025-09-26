import React from 'react';
import styles from './orderAjust.module.css';
import AddProductToBuyOrderContainer from '../../containers/AddProductToBuyOrderContainer';

function OrderAjust() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Ajuste de orden</h6>
      <div>
        <AddProductToBuyOrderContainer type="ajuste" />
      </div>
    </div>
  );
}

export default OrderAjust;
