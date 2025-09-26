import React from 'react';
import styles from './searchControlOrder.module.css';
import SearchControlOrderContainer from '../../containers/SearchControlOrderContainer';

function SearchControlOrder() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Ordenes de control</h6>
      <div>
        <SearchControlOrderContainer />
      </div>
    </div>
  );
}

export default SearchControlOrder;
