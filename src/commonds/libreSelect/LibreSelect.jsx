import React from 'react';
import styles from './customSelect.module.css';

function LibreSelect(props) {
  const { placeholder, arrayOptions, width, active, onChange, value } = props;

  return (
    <select
      value={value ?? 0}
      disabled={active == undefined ? false : !active}
      className={`form-select ${styles.selectContainer} ${styles[width]}`}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {arrayOptions?.map((option, i) => {
        return (
          <option key={i} value={option.value}>
            {option.text?.toUpperCase()}
          </option>
        );
      })}
    </select>
  );
}

export default LibreSelect;
