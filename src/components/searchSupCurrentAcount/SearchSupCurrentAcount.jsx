import React from 'react';
import styles from './searchCurrentAcount.module.css';
import { Button, Label, Radio } from 'semantic-ui-react';
import CustomModal from '../../commonds/customModal/CustomModal';
import { numberToString } from '../../utils';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import NewSupCaMovement from '../newSupCAMovement/NewSupCaMovement';
import { useDispatch, useSelector } from 'react-redux';
import SupplierAcountTable from '../tables/SupplierAcountTable/SupplierAcountTable';
import { setFilterSupMovements } from '../../redux/filtersSupMovements';

function SearchSupCurrentAcount(props) {
  const { currentAcount, nuevaOrdenDePago } = props;
  const { totalMarc, active, data } = useSelector(
    (state) => state.supCurrentAcount
  );
  const { pending } = useSelector((state) => state.filterSupMovement);

  const dispatch = useDispatch();
  return (
    <div className={styles.formContainer}>
      <div className={styles.subFormContainer}>
        <div className={styles.inputContainer}>
          <div>
            <div className={styles.dataContainer}>
              <span className={styles.spanTitle}>
                Razón Social:{' '}
                <span className={styles.spanContent}>
                  {currentAcount?.supplier?.razonSocial.toUpperCase()}
                </span>
              </span>
              <span className={styles.spanTitle}>
                CUIT:{' '}
                <span className={styles.spanContent}>
                  {currentAcount?.supplier?.cuit}
                </span>
              </span>
              <span className={styles.spanTitle}>
                Saldo:{' '}
                <ProtectedComponent listAccesss={[1, 2]}>
                  <span
                    style={{
                      color: `${currentAcount?.resume < 0 ? 'red' : 'green'}`,
                      fontWeight: '700',
                    }}
                    className={`$styles.spanContent`}
                  >{`$ ${numberToString(currentAcount?.resume)}`}</span>
                </ProtectedComponent>
              </span>
            </div>
            <div className={styles.dataContainer}>
              <span className={styles.spanTitle}>
                Numero de cuenta:{' '}
                <span className={styles.spanContent}>
                  {currentAcount?.acountNumber}
                </span>
              </span>
              <span className={styles.spanTitle}>
                Total marcado:{' '}
                <span
                  style={{
                    color: `${currentAcount?.resume < 0 ? 'red' : 'green'}`,
                    fontWeight: '700',
                  }}
                  className={`$styles.spanContent`}
                >{`$ ${numberToString(totalMarc)}`}</span>
              </span>
              <span className={styles.spanTitle}>
                Estado:{' '}
                <Label color={currentAcount?.status ? 'green' : 'red'}>
                  {currentAcount?.status ? 'Habilitada' : 'Inhabilitada'}
                </Label>
              </span>
            </div>
          </div>
        </div>
      </div>
      <ProtectedComponent listAccesss={[1, 2, 5]}>
        <div className={styles.buttonMovContainer}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <Button
              disabled={totalMarc < 0 || !active}
              onClick={() =>
                nuevaOrdenDePago(
                  totalMarc,
                  data.list?.filter((obj) => obj.marc) ?? [],
                  { total: true }
                )
              }
            >
              Nueva orden de pago
            </Button>
            <CustomModal
              title={`Registrar Movimiento`}
              size="lg"
              actionButton={<Button>Nuevo movimiento</Button>}
              bodyModal={(props) => <NewSupCaMovement {...props} />}
              bodyProps={{
                currentAcountId: currentAcount?.id,
              }}
            />
            <div
              style={{
                marginLeft: '90px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <label>Liquidado</label>
              <Radio
                toggle
                defaultChecked={pending}
                onChange={() => {
                  dispatch(
                    setFilterSupMovements({
                      name: 'pending',
                      value: !pending,
                    })
                  );
                }}
                style={{ margin: '0px 5px' }}
              />
              <label>Pendiente</label>
            </div>
          </div>
            <div style={{marginTop: "5px"}}>{currentAcount?.supplier?.descuento > 0 ? `Descuento: ${currentAcount.supplier.descuento * 100} %` :""}</div>
        </div>
      </ProtectedComponent>
      <ProtectedComponent listAccesss={[1, 2]}>
        <div className={styles.tableCont}>
          <SupplierAcountTable currentAcountId={currentAcount?.id} />
        </div>
      </ProtectedComponent>
    </div>
  );
}

export default SearchSupCurrentAcount;
