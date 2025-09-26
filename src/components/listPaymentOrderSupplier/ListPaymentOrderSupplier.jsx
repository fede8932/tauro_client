import React from 'react';
import SupPaymentOrder from '../supPaymentOrder/SupPaymentOrder';
import styles from "./listPaymentOrderSupplier.module.css"

function ListPaymentOrderSupplier() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Cuenta corriente</h6>
      <SupPaymentOrder accountId={0} />
    </div>
  );
}

export default ListPaymentOrderSupplier;
