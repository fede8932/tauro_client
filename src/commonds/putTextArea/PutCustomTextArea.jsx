import React, { useRef, useState } from 'react';
import styles from './customTextArea.module.css';
import { useFormContext } from 'react-hook-form';

function PutCustomTextArea(props) {
  const { width, name, obligatorio, defaultValue, value } = props;
  const { register } = useFormContext();
  const inputRef = useRef(null);
  const [classDivContainer, setClassDivContainer] = useState('inputContainer');
  return (
    <div
      // onClick={() => {
      //   inputRef.current.focus();
      //   setClassDivContainer("inputContainerActive");
      // }}
      onBlur={() => {
        setClassDivContainer('inputContainer');
      }}
      className={`${styles[classDivContainer]} ${styles[width]}`}
    >
      <textarea
        value={value ?? defaultValue}
        onFocus={() => {
          setClassDivContainer('inputContainerActive');
        }}
        // ref={inputRef}
        {...register(name, { required: obligatorio })}
        className={styles.input}
        {...props}
        maxLength={300}
      />
    </div>
  );
}

export default PutCustomTextArea;
