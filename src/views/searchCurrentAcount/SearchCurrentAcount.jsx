import React from 'react';
import styles from './searchCurrentAcount.module.css';
import SearchCurrentAcountContainer from '../../containers/SearchCurrentAcountContainer';
import { useLocation } from "react-router";
import SearchSupCurrentAcountContainer from '../../containers/SearchSupCurrentAcountContainer';

function SearchCurrentAcount() {
  const location = useLocation();

  const isSupplier = location.pathname.includes('/supplier/');
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Cuenta corriente</h6>
      {isSupplier ? <SearchSupCurrentAcountContainer /> : <SearchCurrentAcountContainer />}
    </div>
  );
}

export default SearchCurrentAcount;
