import React, { useEffect, useState } from 'react';
import styles from './newSellOrder.module.css';
import FormSelectClientContainer from '../../containers/FormSelectClientContainer';
import AddProductToSellOrderContainer from '../../containers/AddProductToSellOrderContainer';
import CustomStep from '../../components/step/CustomStep';
import { resetAllClientRequest } from '../../redux/client';
import { useDispatch } from 'react-redux';
import { resetProductSearch } from '../../redux/product';

function NewSellOrder(props) {
  const { estado, type } = props;
  const [view, setView] = useState(estado);
  const dispatch = useDispatch();
  const steps = [
    {
      title: type == 'sale' ? 'Cliente' : 'Productos',
    },
    {
      title: type == 'sale' ? 'Productos' : 'Cliente',
    },
  ];
  const arrayPrueba = ['Damian Cano', 'Juan Martinez', 'Sofia Altamirano']; //los que esten asociados no deben aparecer

  useEffect(() => {
    return () => {
      dispatch(resetAllClientRequest());
      dispatch(resetProductSearch());
    };
  }, []);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Nueva orden de venta</h6>
      <div className={styles.stepContainer}>
        <CustomStep steps={steps} type="client" view={view} />
      </div>
      <div style={{ marginTop: '12px'}}>
        {type !== 'sale' ? (
          <>
            {view == 0 ? (
              <AddProductToSellOrderContainer nextFn={setView} />
            ) : null}
            {view == 1 ? (
              <FormSelectClientContainer
                nextFn={setView}
                proveedores={arrayPrueba}
              />
            ) : null}
          </>
        ) : (
          <>
            {view == 0 ? (
              <FormSelectClientContainer
                nextFn={setView}
                type={type}
                proveedores={arrayPrueba}
              />
            ) : null}
            {view == 1 ? (
              <AddProductToSellOrderContainer nextFn={setView} type={type} />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default NewSellOrder;
