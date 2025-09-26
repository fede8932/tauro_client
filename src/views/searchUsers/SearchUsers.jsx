import React, { useEffect } from 'react';
import styles from './searchUsers.module.css';
import { useDispatch } from 'react-redux';
import { ResetStatusClients } from '../../redux/searchClient';
import SearchUsersContainer from '../../containers/SearchUsersContainer ';

function SearchUsers() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(ResetStatusClients());
    };
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Buscador de usuarios</h6>
      <div>
        <SearchUsersContainer />
      </div>
    </div>
  );
}

export default SearchUsers;
