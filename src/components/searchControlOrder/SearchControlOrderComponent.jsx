import React from 'react';
import styles from './searchControlOrder.module.css';
import RoleTableContainer from '../../containers/RoleTableContainer';

function SearchControlOrderComponent(props) {
  const { result, printFn, changePag } = props;
  return (
    <div className={styles.tableContainer}>
      <span className={styles.subTitle}>Ordenes de control</span>
      <div>
        <RoleTableContainer
          colum={[
            { title: 'Fecha', width: '10%' },
            { title: 'N° Control', width: '15%' },
            { title: 'Remito', width: '15%' },
            { title: 'Orden de compra', width: '15%' },
            { title: 'Estado', width: '15%' },
            { title: 'Control', width: '15%' },
            { title: 'Acciones', width: '15%' },
          ]}
          result={result}
          printFn={printFn}
          changePageFn={changePag}
          type="controlOrder"
        />
      </div>
    </div>
  );
}

export default SearchControlOrderComponent;
