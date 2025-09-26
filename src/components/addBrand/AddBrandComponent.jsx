import React from 'react';
import styles from './addBrand.module.css';
import CustomInput from '../../commonds/input/CustomInput';
import CustomSelect from '../../commonds/select/CustomSelect';
import CustomTextArea from '../../commonds/textarea/CustomTextArea';
import Button from 'react-bootstrap/esm/Button';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';

function AddBrandComponent(props) {
  const { onSubmit, status, methods, suppliers } = props;
  return (
    <FormProvider {...methods}>
      <form className={styles.formContainer}>
        <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos generales</span>
            <CustomInput
              name="code"
              type="text"
              width="large"
              placeholder="Código de marca"
              icon="fas fa-hashtag"
              validate={{ required: true }}
            />
            <CustomInput
              name="name"
              type="text"
              width="large"
              placeholder="Nombre"
              icon="fa-solid fa-id-card"
              validate={{ required: true }}
            />
            {suppliers && (
              <>
                <CustomSelect
                  width="medium"
                  text="Seleccioná el proveedor"
                  name="supplierName"
                  validate={{ required: true }}
                  arrayOptions={suppliers}
                />
                <CustomSelect
                  width="medium"
                  text="Factura"
                  name="seFactura"
                  validate={{ required: true }}
                  arrayOptions={[
                    { value: true, text: 'Facturar' },
                    { value: false, text: 'No facturar' },
                  ]}
                />
              </>
            )}
          </div>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos adicionales</span>
            <CustomInput
              name="renta"
              type="number"
              width="complete"
              placeholder="Rentabilidad"
              icon="fa-solid fa-percent"
              validate={{ required: true }}
            />
            <CustomTextArea
              name="notas"
              width="large"
              placeholder="En este campo puedes ingresar la descripción... (Máximo 160 caracteres)"
              type="textarea"
              validate={{ required: false, maxLength: 160 }}
            />
          </div>
        </div>
        <Button
          onClick={methods.handleSubmit(onSubmit)}
          style={{
            backgroundColor: '#673ab7',
            border: '1px solid #673ab7',
            marginTop: '35px',
            height: '48px',
          }}
        >
          {!status ? (
            'Agregar'
          ) : (
            <Spinner animation="border" variant="light" size="sm" />
          )}
        </Button>
      </form>
    </FormProvider>
  );
}

export default AddBrandComponent;
