import React, { useEffect } from 'react';
import styles from './searchCurrentAcount.module.css';
import { Radio } from 'semantic-ui-react';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import { useDispatch, useSelector } from 'react-redux';
import ClosingTable from '../tables/ClosingTable/ClosingTable';
import {
  setFilterClosing,
  resetFilterclosing,
} from '../../redux/filtersClosing';

function SearchClosing(props) {
  const dispatch = useDispatch();
  // const acountState = useSelector((state) => state.searchMovements);
  // console.log(acountState);

  const filtersClosing = useSelector((state) => state.filterClosing);

  useEffect(() => {
    return () => {
      dispatch(resetFilterclosing());
    };
  }, []);

  return (
    <div className={styles.formContainer}>
      <ProtectedComponent listAccesss={[1, 2, 5]}>
        <div className={styles.buttonMovContainer}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <div
              style={{
                margin: '20px 0px 15px 15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <label>Recibido</label>
              <Radio
                toggle
                defaultChecked={filtersClosing.pending}
                onChange={() => {
                  dispatch(
                    setFilterClosing({
                      name: 'pending',
                      value: !filtersClosing.pending,
                    })
                  );
                }}
                style={{ margin: '0px 5px' }}
              />
              <label>Pendiente</label>
            </div>
          </div>
        </div>
      </ProtectedComponent>
      <div className={styles.tableCont}>
        <ClosingTable />
      </div>
    </div>
  );
}

export default SearchClosing;
