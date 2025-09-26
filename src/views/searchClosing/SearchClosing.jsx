import React from 'react';
import styles from './searchCurrentAcount.module.css';
import SearchClosingContainer from '../../containers/SearchClosingContainer';
// import { useLocation } from "react-router";

function SearchClosing() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Cierres diarios</h6>
      <SearchClosingContainer />
    </div>
  );
}

export default SearchClosing;
