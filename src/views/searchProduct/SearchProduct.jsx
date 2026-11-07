import React, { useEffect, useRef } from 'react';
import styles from './searchProduct.module.css';
import SearchProductContainer from '../../containers/SearchProductContainer';
import { useDispatch } from 'react-redux';
import { resetProductSearch } from '../../redux/product';
import { resetFilterProduct } from '../../redux/filtersProducts';

function SearchProduct() {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    return () => {
      // dispatch(resetProductSearch());
      // dispatch(resetFilterProduct());
    };
  }, []);
  return (
    <div ref={scrollContainerRef} className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Buscador de productos</h6>
      <div>
        <SearchProductContainer scrollContainerRef={scrollContainerRef} />
      </div>
    </div>
  );
}

export default SearchProduct;
