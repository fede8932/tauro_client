import React from 'react';
import styles from './confirmBuy.module.css';
import ConfirmBuyContainer from '../../containers/ConfirmBuyContainer';

function ConfirmBuy(props) {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>
        Recepción de pedido y carga de remito
      </h6>
      <ConfirmBuyContainer {...props} />
    </div>
  );
}

export default ConfirmBuy;
