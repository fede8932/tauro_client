import React from 'react';
import styles from './separador.module.css';

function Separador({ props }) {
  const { clase } = props;
  return <div className={styles[clase]}></div>;
}

export default Separador;
