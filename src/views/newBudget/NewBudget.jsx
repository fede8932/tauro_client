import React, { useState } from 'react';
import styles from './newBudget.module.css';
import FormSelectClientContainer from '../../containers/FormSelectClientContainer';
import AddProductToSellOrderContainer from '../../containers/AddProductToSellOrderContainer';
import CustomStep from '../../components/step/CustomStep';

function NewBudget(props) {
  const { estado } = props;
  const [view, setView] = useState(estado);
  const steps = [
    {
      title: 'Productos',
    },
    {
      title: 'Cliente',
    },
  ];
  const arrayPrueba = ['Damian Cano', 'Juan Martinez', 'Sofia Altamirano']; //los que esten asociados no deben aparecer
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Nuevo presupuesto</h6>
      <div className={styles.stepContainer}>
        <CustomStep steps={steps} type="client" view={view} />
      </div>
      <div style={{ marginTop: '30px' }}>
        {view == 0 ? <AddProductToSellOrderContainer nextFn={setView} /> : null}
        {view == 1 ? (
          <FormSelectClientContainer
            nextFn={setView}
            proveedores={arrayPrueba}
          />
        ) : null}
      </div>
    </div>
  );
}

export default NewBudget;
