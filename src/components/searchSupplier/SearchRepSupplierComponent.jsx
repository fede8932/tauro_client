import React from 'react';
import styles from './searchRepSupplier.module.css';
import Button from 'react-bootstrap/esm/Button';
import CustomInput from '../../commonds/input/CustomInput';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';
import RoleTableContainer from '../../containers/RoleTableContainer';

function SearchRepSupplierComponent(props) {
  const { methods, onSubmit, result } = props;
  return (
    <FormProvider {...methods}>
      <form
        className={styles.formContainer}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Campos de filtrado</span>
            <div
              style={{
                display: 'flex',
                width: '100%',
              }}
            >
              <CustomInput
                name="campo"
                type="text"
                width="extraMedium"
                placeholder="Ingrese el cuit o razón social del proveedor"
                icon="fa-solid fa-magnifying-glass"
                validate={{ required: true }}
              />
              <Button
                type="submit"
                style={{
                  backgroundColor: '#673ab7',
                  border: '1px solid #673ab7',
                  height: '48px',
                  width: '100px',
                  marginLeft: '10px',
                }}
              >
                {!result.loading ? (
                  'Buscar'
                ) : (
                  <Spinner animation="border" variant="light" size="sm" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <span className={styles.subTitle}>Detalle de representantes</span>
          <RoleTableContainer
            colum={[
              { title: 'Nombre', width: '30%' },
              { title: 'Proveedor', width: '19%' },
              { title: 'Email', width: '18%' },
              { title: 'Teléfono', width: '9%' },
              { title: 'Estado', width: '9%' },
              { title: 'Acciones', width: '15%' },
            ]}
            result={result}
            type="repSupplier"
          />
        </div>
      </form>
    </FormProvider>
  );
}

export default SearchRepSupplierComponent;
