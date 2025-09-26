import React from 'react';
import styles from './addProductModal.module.css';
import CustomCard from '../../commonds/card/CustomCard';

function AddProductModalComponent() {
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <CustomCard title="Orden de compra" headerId="headerCompra" />
        <CustomCard title="Orden de venta" headerId="headerVenta" />
        <CustomCard title="Orden de compra" headerId="headerCompra" />
        <CustomCard title="Orden de venta" headerId="headerVenta" />
      </div>
    </div>
  );
}

export default AddProductModalComponent;
