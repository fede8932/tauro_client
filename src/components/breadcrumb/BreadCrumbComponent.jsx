import React from 'react';
import styles from './/breadcrumb.module.css';

function BreadCrumbComponent() {
  return (
    <nav aria-label="breadcrumb" className={styles.navigContainer}>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li className="breadcrumb-item">
          <a href="#">Library</a>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Data
        </li>
      </ol>
    </nav>
  );
}

export default BreadCrumbComponent;
