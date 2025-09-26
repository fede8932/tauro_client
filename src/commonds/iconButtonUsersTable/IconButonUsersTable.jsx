import React from 'react';
import styles from './iconButon.module.css';
import { Popup } from 'semantic-ui-react';

const IconButonUsersTable = (props) => {
  const { icon, iconInitialStyle, fn, disabled, popupText, id } = props;
  return (
    <Popup
      trigger={
        <button
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault();
            id ? fn(id) : fn();
          }}
          className={styles.butStyle}
        >
          <i className={`${icon} ${styles[iconInitialStyle]}`}></i>
        </button>
      }
      content={popupText}
    />
  );
};

export default IconButonUsersTable;
