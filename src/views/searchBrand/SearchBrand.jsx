import React from 'react';
import styles from './searchBrand.module.css';
import SearchBrandContainer from '../../containers/SearchBrandContainer';

function SearchBrand() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Buscador de marcas</h6>
      <div>
        <SearchBrandContainer />
      </div>
    </div>
  );
}

export default SearchBrand;
