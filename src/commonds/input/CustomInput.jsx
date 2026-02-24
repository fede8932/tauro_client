import React, { useState } from 'react';
import styles from './customInput.module.css';
import { useFormContext } from 'react-hook-form';

function CustomInput(props) {
  const { width, icon, name, validate } = props;
  const [classDivContainer, setClassDivContainer] = useState('inputContainer');
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div style={{ marginBottom: '15px' }} className={`${styles[width]}`}>
      <div
        onBlur={() => {
          setClassDivContainer('inputContainer');
        }}
        className={`${styles[classDivContainer]}`}
      >
        <i className={`${styles.searchIcon} ${icon}`}></i>
        <input
          {...register(name, validate)}
          onFocus={() => {
            setClassDivContainer('inputContainerActive');
          }}
          autoComplete="off"
          className={styles.input}
          {...props}
        />
      </div>
      <div className={styles.errorContainer}>
        {errors[name] && <span>{errors[name].message}</span>}
      </div>
    </div>
  );
}

export default CustomInput;
