import React from 'react';
import styles from './billModalView.module.css';
import { useSelector } from 'react-redux';
import { getBillType } from '../../utils';
import { MovTypeEnum } from '../../enum/MovEnum';
import BillDetailTable from '../../commonds/billDetailTable/BillDetailTable';

function BillModalViewComponent(props) {
  const { data } = useSelector((state) => state.selectBill);
  let sendDate = { ...data };
  sendDate.purchaseOrderItems =
    data.type == 1 || data.type == 3 ? data.ncOrderItems : data.fItems;
  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        <span className={styles.inputLabel}>
          Tipo de comprobante:
          <span className={styles.dataUser}>
            {getBillType(MovTypeEnum[data?.type], data?.billType)}
          </span>
        </span>
        <span>
          Total:<span className={styles.dataUser}>${data?.total}</span>
        </span>
        <span>
          Pendiente:
          <span className={styles.dataUser}>${data?.saldoPend}</span>
        </span>
      </div>
      <div className={styles.tableContainer}>
        <BillDetailTable
          columns={[
            { title: 'Código', width: '10%' },
            { title: 'Descripción', width: '50%' },
            { title: 'Marca', width: '10%' },
            { title: 'Precio', width: '10%' },
            { title: 'Cantidad', width: '10%' },
            { title: 'Total', width: '10%' },
          ]}
          color="teal"
          data={sendDate}
        />
      </div>
    </div>
  );
}

export default BillModalViewComponent;
