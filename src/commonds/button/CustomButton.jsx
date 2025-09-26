import React from 'react';
import styles from './customButon.module.css';
import { useState } from 'react';

const CustomButton = ({ props }) => {
  const {
    buttonStyle,
    icon,
    iconStyle,
    iconHoverStyle,
    textButton,
    fnSidebar,
  } = props;
  const [iconClass, setIconClass] = useState(iconStyle);
  const [buttonClass, setButtonClass] = useState('textButton');
  return (
    <button
      onMouseOver={() => {
        setIconClass(iconHoverStyle);
        setButtonClass('textButtonOver');
      }}
      onMouseLeave={() => {
        setIconClass(iconStyle);
        setButtonClass('textButton');
      }}
      onClick={(event) => {
        event.preventDefault();
        fnSidebar();
      }}
      className={styles[buttonStyle]}
    >
      <i className={`${styles[iconClass]} ${icon}`}></i>
      {textButton ? (
        <span className={styles[buttonClass]}>{textButton}</span>
      ) : null}
    </button>
  );
};

export default CustomButton;
