import React from 'react';
import styles from './supPaymentOrder.module.css';
import SupplierPaymentTable from '../tables/SupplierPaymentTable/SupplierPaymentTable';

function SupPaymentOrder(props) {
  const { accountId } = props;
  return (
    <div className={styles.container}>
      <SupplierPaymentTable currentAcountId={accountId} />
    </div>
  );
}

export default SupPaymentOrder;
