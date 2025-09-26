import React from 'react';
import styles from './iconButon.module.css';
// import { useSelector } from "react-redux";

const IconButton = (props) => {
  const { icon, iconInitialStyle, fn, product, type, objetive, style, itemId } =
    props;

  // const listProduct = useSelector((state) => state.listOrderItems);
  // const data = {
  //   orderItemId: product.product.id,
  //   orderItems: listProduct.data,
  // };
  return (
    <button
      disabled={objetive ? true : false}
      onClick={(event) => {
        event.preventDefault();
        type == 'delete' ? fn(itemId) : fn(product);
      }}
      className={styles.butStyle}
    >
      <i style={style} className={`${icon} ${styles[iconInitialStyle]}`}></i>
    </button>
  );
};

export default IconButton;
