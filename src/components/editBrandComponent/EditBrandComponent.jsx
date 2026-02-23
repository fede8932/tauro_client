import React from 'react';
import styles from './editBrand.module.css';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../commonds/putInput/CustomInput';
import { Button, Spinner } from 'react-bootstrap';

function EditBrandComponent(props) {
  const { brand, methods, handleSubmit, suppliers, loading } = props;
  console.log(brand)
  return (
    <div className={styles.editBrandContainer}>
      <FormProvider {...methods}>
        <form>
          {/*suppliers && (
            <CustomSelect
              text="Seleccioná el proveedor"
              name="supplierId"
              validate={{ required: true }}
              arrayOptions={suppliers}
            />
          )*/}
          <CustomInput
            defaultValue={brand?.code}
            name="code"
            type="text"
            width="complete"
            placeholder="Código"
            icon="fas fa-hashtag"
            validate={{ required: true, maxLength: 25 }}
          />
          <CustomInput
            defaultValue={brand?.name}
            name="name"
            type="text"
            width="complete"
            placeholder="Nombre"
            icon="fa-solid fa-id-card"
            validate={{ required: true, maxLength: 25 }}
          />
          <CustomInput
            defaultValue={
              brand?.rentabilidad
                ? brand.rentabilidad * 100
                : 0
            }
            name="rentabilidad"
            type="number"
            width="complete"
            placeholder="Porcentaje de renta"
            icon="fa-solid fa-percent"
            validate={{ required: true }}
          />
          <Button
            onClick={methods.handleSubmit(handleSubmit)}
            style={{
              width: '100%',
              backgroundColor: '#673ab7',
              border: '1px solid #673ab7',
              height: '40px',
            }}
          >
            {!loading ? (
              'Actualizar'
            ) : (
              <Spinner animation="border" variant="light" size="sm" />
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditBrandComponent;
