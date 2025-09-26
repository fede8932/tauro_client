import React, { useEffect } from 'react';
import styles from './searchProduct.module.css';
import SearchProductContainer from '../../containers/SearchProductContainer';
import { useDispatch } from 'react-redux';
import { resetProductSearch } from '../../redux/product';
import { resetFilterProduct } from '../../redux/filtersProducts';

function SearchProduct() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetProductSearch());
      dispatch(resetFilterProduct());
    };
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Buscador de productos</h6>
      <div>
        <SearchProductContainer />
      </div>
    </div>
  );
}

export default SearchProduct;
