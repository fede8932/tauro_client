import React, { useEffect, useState } from 'react';
import styles from './newBuyOrder.module.css';
import AddProductToBuyOrderContainer from '../../containers/AddProductToBuyOrderContainer';
import FormSelectProveedorContainer from '../../containers/FormSelectProveedorContainer';
import CustomStep from '../../components/step/CustomStep';
import { resetInfoSupplierRequest } from '../../redux/infoSupplier';
import { useDispatch } from 'react-redux';
import { resetProductSearch } from '../../redux/product';
// import FindBuyOrderContainer from "../../containers/FindBuyOrderContainer";

function NewBuyOrder(props) {
  const { estado } = props;
  const [view, setView] = useState(estado);
  const dispatch = useDispatch();
  const steps = [
    {
      title: 'Proveedor',
    },
    {
      title: 'Productos',
    },
  ];

  useEffect(() => {
    return () => {
      dispatch(resetInfoSupplierRequest());
      dispatch(resetProductSearch());
    };
  }, []);

  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Crear orden de compra</h6>
      <div className={styles.stepContainer}>
        <CustomStep steps={steps} type="client" view={view} />
      </div>
      <div style={{ marginTop: '12px' }}>
        {view == 0 ? <FormSelectProveedorContainer nextFn={setView} /> : null}
        {view == 1 ? (
          <AddProductToBuyOrderContainer nextFn={setView} sType="buy" />
        ) : null}
      </div>
    </div>
  );
}

export default NewBuyOrder;
