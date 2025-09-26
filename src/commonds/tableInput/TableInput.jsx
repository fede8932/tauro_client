import React, { useState } from 'react';
import styles from './tableInput.module.css';

const TableInput = (props) => {
  const { type, step, defValue, fn, dataItem } = props;
  const [inputValue, setInputValue] = useState(defValue);
  const [borderInput, setBorderInput] = useState('inputBorderGrey');
  const newDataItem = dataItem;
  newDataItem.editCamp = inputValue;
  const handleInputChange = (event) => {
    if (event.target.value >= 0) {
      newDataItem.editCamp = event.target.value;
      fn(newDataItem);
    }
  };
  
  return (
    <div className={`${styles[borderInput]} ${styles.inputContainer}`}>
      <input
        disabled
        className={styles.inputStyle}
        type={type}
        step={step}
        value={defValue}
        onChange={handleInputChange}
        // onBlur={handleInputBlur}
      />
    </div>
  );
};

export default TableInput;
