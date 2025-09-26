import React from 'react';
import styles from './searchBrand.module.css';
import BrandsTable from '../tables/brandsTable/BrandsTable';

function SearchBrandComponent(props) {
  return (
    <div className={styles.formContainer}>
      <BrandsTable />
    </div>
  );
}

export default SearchBrandComponent;
