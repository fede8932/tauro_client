import React from 'react';
import LoginContainer from '../../containers/LoginContainer';
import styles from './loginView.module.css';

function LoginView() {
  return (
    <div className={styles.loginViewContainer}>
      <LoginContainer />
    </div>
  );
}

export default LoginView;
