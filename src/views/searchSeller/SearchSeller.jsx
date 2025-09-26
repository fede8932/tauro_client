import React, { useEffect } from 'react';
import styles from './searchSeller.module.css';
import SearchSellerContainer from '../../containers/SearchSellerContainer';
import { useDispatch } from 'react-redux';
import { ResetStatusSellerRequest } from '../../redux/searchSeller';

function SearchSeller() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(ResetStatusSellerRequest());
    };
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Buscador de vendedores</h6>
      <div>
        <SearchSellerContainer />
      </div>
    </div>
  );
}

export default SearchSeller;
