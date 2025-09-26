import React, { useRef, useState } from 'react';
import styles from './customTextArea.module.css';
import { useFormContext } from 'react-hook-form';

function CustomTextArea(props) {
  const { width, name, obligatorio } = props;
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
        onFocus={() => {
          setClassDivContainer('inputContainerActive');
        }}
        // ref={inputRef}
        {...register(name, { required: obligatorio })}
        className={styles.input}
        {...props}
        maxLength={160}
      />
    </div>
  );
}

export default CustomTextArea;
