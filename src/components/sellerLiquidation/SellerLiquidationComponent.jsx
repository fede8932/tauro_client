import React from 'react';
import styles from './sellerLiquidation.module.css';
import { Label } from 'semantic-ui-react';
import { redondearADosDecimales } from '../../utils';
import LiquidationsTable from '../tables/liquidationsTable/LiquidationsTable';

function SellerLiquidationComponent(props) {
  const { resumeSeller, loading, printResume } = props;
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
      <LiquidationsTable printResume={printResume} />
    </div>
  );
}

export default SellerLiquidationComponent;
