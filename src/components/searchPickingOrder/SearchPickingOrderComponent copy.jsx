import React from 'react';
import styles from './searchPickingOrder.module.css';
import RoleTableContainer from '../../containers/RoleTableContainer';

function SearchPickingOrderComponent(props) {
  const { result, printFn, updatePicking, chagePage } = props;
  return (
    <div className={styles.tableContainer}>
      <span className={styles.subTitle}>Ordenes de control</span>
      <div>
        <RoleTableContainer
          colum={[
            { title: 'Fecha', width: '10%' },
            { title: 'N° Picking', width: '15%' },
            { title: 'Remito', width: '15%' },
            { title: 'Orden de compra', width: '15%' },
            { title: 'Estado', width: '15%' },
            { title: 'Despacho', width: '15%' },
            { title: 'Acciones', width: '15%' },
          ]}
          result={result}
          printFn={printFn}
          type="pickingOrder"
          updatePicking={updatePicking}
          changePageFn={chagePage}
        />
      </div>
    </div>
  );
}

export default SearchPickingOrderComponent;
