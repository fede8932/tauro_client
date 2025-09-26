import React from 'react';
import styles from './sellerAcount.module.css';
import { Label } from 'semantic-ui-react';
import ComitionsTable from '../tables/comitionsTable/ComitionsTable';
import { redondearADosDecimales } from '../../utils';

function SellerAcountComponent(props) {
  const { resumeSeller, loading } = props;
  // console.log(resumeSeller);
  return (
    <div className={styles.formContainer}>
      <div className={styles.subFormContainer}>
        <div
          style={{
            width: '100%',
            height: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            marginBottom: '20px',
          }}
        >
          <div className={styles.dataContainer}>
            <span className={styles.spanTitle}>
              Nombre y apellido:{' '}
              <span className={styles.spanContent}>
                {`${resumeSeller.seller?.user?.name} ${resumeSeller.seller?.user?.lastName}`.toUpperCase()}
              </span>
            </span>
            <span className={styles.spanTitle}>
              CUIL:{' '}
              <span className={styles.spanContent}>
                {resumeSeller.seller?.cuil}
              </span>
            </span>
            <span className={styles.spanTitle}>
              Facturado:{' '}
              <span className={styles.spanContent}>
                {`$ ${redondearADosDecimales(resumeSeller.selectTotal)}`}
              </span>
            </span>
            <span className={styles.spanTitle}>
              Comisión:{' '}
              <span className={styles.spanContent}>
                {`$ ${redondearADosDecimales(resumeSeller.selectComision)}`}
              </span>
            </span>
            <span className={styles.spanTitle}>
              Estado:{' '}
              <Label
                color={resumeSeller.seller?.user?.status ? 'green' : 'red'}
              >
                {resumeSeller.seller?.user?.status
                  ? 'Habilitada'
                  : 'Inhabilitada'}
              </Label>
            </span>
          </div>
        </div>
      </div>
      <ComitionsTable />
    </div>
  );
}

export default SellerAcountComponent;
