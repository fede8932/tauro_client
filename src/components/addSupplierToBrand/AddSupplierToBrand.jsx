import React from 'react';
import styles from './addSupplierToBrand.module.css';
import CustomTransfer from '../../commonds/transfer/CustomTransfer';
import { useForm } from 'react-hook-form';
// import CustomPagination from "../../commonds/pagination/CustomPagination"

function AddSupplierToBrand(props) {
  const { suppliers, addSuppliers, deleteSupplier, brand } = props;
  const methods = useForm();
  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        <span className={styles.inputLabel}>
          Brand ID:<span className={styles.dataUser}>{brand.id}</span>
        </span>
        <span>
          Brand:<span className={styles.dataUser}>{brand.name}</span>
        </span>
      </div>
      <div style={{ marginTop: '30px' }}>
        <CustomTransfer
          suppliers={suppliers}
          brand={brand}
          addSuppliers={addSuppliers}
          deleteSupplier={deleteSupplier}
          methods={methods}
        />
        {/* <div style={{marginLeft: "140px"}}>
        <CustomPagination /></div> */}
      </div>
    </div>
  );
}

export default AddSupplierToBrand;
