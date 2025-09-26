import React from 'react';
import styles from './addUser.module.css';
import OtherFormContainer from '../../containers/OtherFormContainer';

function AddOtherUser() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Registrar usuario</h6>
      <div>
        <OtherFormContainer />
      </div>
    </div>
  );
}

export default AddOtherUser;
