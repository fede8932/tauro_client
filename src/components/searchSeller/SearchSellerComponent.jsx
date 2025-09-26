import React from 'react';
import styles from './searchSeller.module.css';
import Button from 'react-bootstrap/esm/Button';
import CustomInput from '../../commonds/input/CustomInput';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';
import RoleTableContainer from '../../containers/RoleTableContainer';
import { useNavigate } from 'react-router';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import { Checkbox } from 'semantic-ui-react';

function SearchSellerComponent(props) {
  const {
    methods,
    onSubmit,
    result,
    resetSearch,
    clientsResumePrint,
    changePage,
    onlyActive,
    setOnlyActive,
  } = props;

  const navigate = useNavigate();
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
                name="text"
                type="text"
                width="extraMedium"
                placeholder="Ingrese el cuil o nombre del vendedor"
                icon="fa-solid fa-magnifying-glass"
                validate={{ required: true }}
              />
              <Checkbox
                toggle
                checked={!!onlyActive}
                onChange={(e, data) => setOnlyActive(!!data.checked)}
                label={onlyActive ? 'Solo activos' : 'Todos'}
                style={{
                  marginLeft: '10px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  background: '#f4f4f6',
                  borderRadius: '6px',
                }}
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
              <Button
                type="reset"
                style={{
                  backgroundColor: 'grey',
                  border: '1px solid grey',
                  height: '47px',
                  width: '100px',
                  marginLeft: '10px',
                }}
                onClick={() => {
                  resetSearch();
                }}
              >
                Limpiar
              </Button>
              <ProtectedComponent listAccesss={[1, 2, 5]}>
                <Button
                  style={{
                    height: '47px',
                    width: '100px',
                    marginLeft: '10px',
                  }}
                  onClick={() => navigate('/search/closing')}
                >
                  Ver cierres
                </Button>
              </ProtectedComponent>
            </div>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <span className={styles.subTitle}>Detalle de vendedores</span>
          <RoleTableContainer
            omitPaginator
            colum={[
              { title: 'Nombre', width: '25%' },
              { title: 'Apellido', width: '25%' },
              { title: 'CUIL', width: '15%' },
              { title: 'ID User', width: '10%' },
              { title: 'Estado', width: '10%' },
              { title: 'Acciones', width: '15%' },
            ]}
            clientsResumePrint={clientsResumePrint}
            result={result}
            type="seller"
            changePageFn={changePage}
          />
        </div>
      </form>
    </FormProvider>
  );
}

export default SearchSellerComponent;
