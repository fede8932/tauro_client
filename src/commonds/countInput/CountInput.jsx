import React, { useState } from 'react';
import styles from './countInput.module.css';

const CountInput = () => {
  const [valor, setValor] = useState(0); // Valor por defecto
  const handleSub = () => {
    const newValor = valor == 0 ? 0 : valor - 1;
    setValor(newValor);
  };
  const handleAdd = () => {
    const newValor = valor + 1;
    setValor(newValor);
  };
  return (
    <div className={styles.container}>
      <input className={styles.inputInter} type="text" value={valor} />
      <button
        className={`${styles.button} ${styles.buttonSup}`}
        onClick={handleSub}
      >
        <i class="fa-solid fa-minus"></i>
      </button>
      <button
        className={`${styles.button} ${styles.buttonAdd}`}
        onClick={handleAdd}
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
  );
};

export default CountInput;
