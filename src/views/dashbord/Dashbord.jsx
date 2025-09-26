import React from 'react';
import styles from './dashbord.module.css';
import DashboardContainer from '../../containers/DashboardContainer';

function Dashbord() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Dashboard</h6>
      <div>
        <DashboardContainer />
      </div>
    </div>
  );
}

export default Dashbord;
