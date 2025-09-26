import React, { useEffect } from 'react';
import styles from './searchSupplier.module.css';
import SearchSupplierContainer from '../../containers/SearchSupplierContainer';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { ResetSupplierRequest } from '../../redux/searchSupplier';

function SearchSupplier() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(ResetSupplierRequest());
    };
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>
        {pathname == '/search/supplier'
          ? 'Buscador de proveedores'
          : 'Buscador de representantes'}
      </h6>
      <div>
        <SearchSupplierContainer />
      </div>
    </div>
  );
}

export default SearchSupplier;
