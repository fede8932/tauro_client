import React from 'react';
import styles from './searchOrder.module.css';
import SearchOrderContainer from '../../containers/SearchOrderContainer';
import { Checkbox } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterBuyOrder } from '../../redux/filtersBuyOrder';

function SearchBuyOrder() {
  const filterBuyOrder = useSelector((state) => state.filterBuyOrder);
  const dispatch = useDispatch();
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Buscador de ordenes de compra</h6>
      <div style={{ marginTop: '50px' }}>
        <div className={styles.buttonContainer}>
          <div>
            <Checkbox
              checked={filterBuyOrder.pending}
              toggle
              label="Pendiente"
              onClick={() => {
                dispatch(
                  setFilterBuyOrder({
                    name: 'pending',
                    value: !filterBuyOrder.pending,
                  })
                );
              }}
            />
          </div>
        </div>
        <SearchOrderContainer type="Buy" />
      </div>
    </div>
  );
}

export default SearchBuyOrder;
