import React from 'react';
import styles from './formSelectProveedor.module.css';
import { useNavigate } from 'react-router';
import CustomSelect from '../../commonds/select/CustomSelect';
import Button from 'react-bootstrap/Button';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/Spinner';
import Description from '../../commonds/description/Description';

function FormSelectProveedorComponent(props) {
  const {
    proveedores,
    representantes,
    methods,
    onSubmit,
    fnSelect,
    subSelectStatus,
    infoProveedor,
    orderState,
  } = props;

  const navigate = useNavigate();
  return (
    <FormProvider {...methods}>
      <form className={styles.formContainer}>
        <div className={styles.buttonSubFormContainer}>
          <div className={styles.subFormContainer}>
            <div className={styles.inputContainer}>
              <span className={styles.subTitle}>Datos de proveedor</span>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                {proveedores && (
                  <CustomSelect
                    name="supplier"
                    text="Seleccioná la proveedor"
                    width="selectContainerMedium"
                    arrayOptions={proveedores}
                    validate={{ required: true }}
                    fnSelect={fnSelect}
                  />
                )}
                {/* <CustomSelect
                  active={subSelectStatus}
                  name="represent"
                  text="Seleccioná el representante"
                  width="selectContainerMedium"
                  arrayOptions={representantes}
                  validate={{ required: true }}
                /> */}
              </div>
              <div className={styles.dataContainer}>
                <Description infoProv={infoProveedor} />
              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              className={`${styles.buttonStyle} ${styles.buttonStyleBack}`}
              variant="danger"
              onClick={() => {
                navigate('/');
              }}
            >
              Cancelar
            </Button>
            <Button
              className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
              onClick={methods.handleSubmit(onSubmit)}
            >
              {!orderState.loading ? (
                'Siguiente'
              ) : (
                <Spinner animation="border" variant="light" size="sm" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default FormSelectProveedorComponent;
