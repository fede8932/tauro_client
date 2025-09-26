import React from 'react';
import styles from './searchOrder.module.css';
import SellOrderTable from '../tables/sellOrderTable/SellOrderTable';
import BuyOrderTable from '../tables/buyOrderTable/BuyOrderTable';

function SearchOrderComponent(props) {
  const { deleteOrder, cancelOrder, setOrder, buyOrderSelect, type } = props;

  return (
    <div className={styles.formContainer}>
      {type == 'Sell' ? (
        <SellOrderTable
          cancelOrder={cancelOrder}
          deleteOrder={deleteOrder}
          setOrder={setOrder}
          buyOrderSelect={buyOrderSelect}
        />
      ) : (
        <BuyOrderTable
          cancelOrder={cancelOrder}
          deleteOrder={deleteOrder}
          setOrder={setOrder}
          buyOrderSelect={buyOrderSelect}
        />
      )}
    </div>
  );
}

export default SearchOrderComponent;
