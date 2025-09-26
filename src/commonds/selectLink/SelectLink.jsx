import React, { useState } from 'react';
import styles from './selectLink.module.css';

const SelectLink = (props) => {
  const { view, order } = props;

  return (
    <div className={styles.pestañasContainer}>
      <div className={styles.linkContainer} style={{ display: 'flex' }}>
        <span
          id={view === order[0] ? styles.linkActive : styles.linkInactive}
          variant="link"
        >
          {order[0]}
        </span>
      </div>
      <div
        className={styles.linkContainer}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <span
          id={view === order[1] ? styles.linkActive : styles.linkInactive}
          variant="link"
        >
          {order[1]}
        </span>
      </div>
      <div
        className={styles.linkContainer}
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <span
          id={view === order[2] ? styles.linkActive : styles.linkInactive}
          variant="link"
        >
          {order[2]}
        </span>
      </div>
    </div>
  );
};

export default SelectLink;
