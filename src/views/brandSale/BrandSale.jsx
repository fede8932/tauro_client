import React from 'react';
import styles from './sale.module.css';
import BrandSaleContainer from '../../containers/BrandSaleContainer';
import ProductSaleContainer from '../../containers/ProductSaleContainer';

function BrandSale(props) {
  const { type } = props;
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Configuración de ofertas</h6>
      <div>
        {type == 'product' ? <ProductSaleContainer /> : <BrandSaleContainer />}
      </div>
    </div>
  );
}

export default BrandSale;
