import React from 'react';
import styles from './widget.module.css';
import Chart from 'chart.js/auto';

function Widget(props) {
  //color = violet, blue, orange, green
  const { color, icon, number, info, comparativa } = props;
  return (
    <div className={`${styles.widgetContainer} ${styles[color]}`}>
      <div className={styles.iconContainer}>
        <i className={`${styles.icon} ${icon}`}></i>
      </div>
      <div className={styles.titleDataContainer}>
        <h1 className={styles.titleData}>{number}</h1>
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.info}>{info}</span>
      </div>
      <div className={`${styles.comparativaContainer}`}>
        <span
          className={`${styles.comparativa} ${
            comparativa < 0 ? styles.compRed : styles.compGreen
          }`}
        >
          {`${comparativa * 100} %`}
        </span>
        <i
          className={` ${comparativa < 0 ? styles.compRed : styles.compGreen} ${
            comparativa > 0
              ? 'fa-solid fa-angles-up'
              : 'fa-solid fa-angles-down'
          } ${styles.compIcon}`}
        ></i>
      </div>
    </div>
  );
}

export default Widget;
