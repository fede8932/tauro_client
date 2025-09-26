import React from 'react';
import styles from './searchUsers.module.css';
import UsersTable from '../tables/usersTable/UsersTable';

function SearchUsersComponent(props) {
  return (
    <div className={styles.formContainer}>
      <UsersTable />
    </div>
  );
}

export default SearchUsersComponent;
