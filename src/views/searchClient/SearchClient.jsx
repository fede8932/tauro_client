import React, { useEffect } from 'react';
import styles from './searchClient.module.css';
import SearchClientContainer from '../../containers/SearchClientContainer ';
import { useDispatch } from 'react-redux';
import { ResetStatusClients } from '../../redux/searchClient';

function SearchClient() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(ResetStatusClients());
    };
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Buscador de clientes</h6>
      <div>
        <SearchClientContainer />
      </div>
    </div>
  );
}

export default SearchClient;
