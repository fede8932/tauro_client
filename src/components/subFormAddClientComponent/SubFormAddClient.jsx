import React from 'react';
import styles from './subForm.module.css';
import TableContainer from '../../containers/TableContainer';
import FormClientSupplier from '../../commonds/subFormClient/FormClientSupplier';
import { useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import { useSelector } from 'react-redux';

function SubFormAddClientComponent(props) {
  const { methods, onSubmitBrand, tableItems, delFn } = props;
  const { rolId } = useSelector((state) => state.user.data);
  // console.log(rolId);
  const navigate = useNavigate();
  return (
    <div className={styles.inputContainerLong}>
      <span className={styles.subTitle}>Set descuentos</span>
      <div className={styles.divContainer}>
        <ProtectedComponent listAccesss={[1, 2, 5]}>
          <FormClientSupplier
            supMethods={methods}
            onSubmitBrand={onSubmitBrand}
          />
        </ProtectedComponent>
        <div className={styles.containerTable2}>
          <TableContainer
            delFn={delFn}
            brands={tableItems}
            indicadores={['Marca', 'Concepto', 'Porcentaje', 'Acciones']}
          />
        </div>
      </div>
      <Button
        onClick={() => {
          if (rolId == '5' || rolId == '2') {
            navigate('/search/client');
            return;
          }
          navigate('/search/client');
        }}
        style={{
          backgroundColor: '#673ab7',
          border: '1px solid #673ab7',
          margin: '35px 0px',
          height: '38px',
        }}
      >
        Finalizar
      </Button>
    </div>
  );
}

export default SubFormAddClientComponent;
