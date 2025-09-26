import React from 'react';
import styles from './otherForm.module.css';
import CustomInput from '../../commonds/input/CustomInput';
import Button from 'react-bootstrap/Button';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';
import CustomSelect from '../../commonds/select/CustomSelect';

function OtherFormComponent(props) {
  const { methods, onSubmit, status } = props;
  return (
    <FormProvider {...methods}>
      <form className={styles.formContainer}>
        <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos de usuario</span>
            <CustomInput
              name="name"
              type="text"
              width="large"
              placeholder="Nombre"
              icon="fa-solid fa-id-card"
              validate={{ required: true, maxLength: 25 }}
            />
            <CustomInput
              name="lastName"
              type="text"
              width="large"
              placeholder="Apellido"
              icon="fa-solid fa-id-card"
              validate={{ required: true, maxLength: 25 }}
            />
            <CustomInput
              name="email"
              type="email"
              width="large"
              placeholder="Correo electrónico"
              icon="fa-regular fa-envelope"
              validate={{
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Ingrese un correo electrónico válido',
                },
              }}
            />
            <CustomInput
              name="cuil"
              type="text"
              width="large"
              placeholder="Cuil"
              icon="fa-solid fa-id-card"
              validate={{
                required: true,
                pattern: {
                  value: /^\d{2}-\d{8}-\d{1}$/,
                  message: 'El CUIT debe tener el formato 99-99999999-9',
                },
              }}
            />
          </div>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos personales</span>
            <CustomInput
              name="calle"
              type="text"
              width="large"
              placeholder="Calle"
              icon="fa-solid fa-location-dot"
              validate={{ required: true, maxLength: 25 }}
            />
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <CustomInput
                name="altura"
                type="text"
                width="small"
                placeholder="Altura"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 10 }}
              />
              <CustomInput
                name="codigoPostal"
                type="text"
                width="small"
                placeholder="Código postal"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 10 }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <CustomInput
                name="localidad"
                type="text"
                width="small"
                placeholder="Localidad"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
              />
              <CustomInput
                name="telefono"
                type="text"
                width="small"
                placeholder="Número de teléfono"
                icon="fa-solid fa-phone"
                validate={{
                  required: true,
                  validate: (value) => {
                    const isValid = /^\d{8,10}$/.test(value);
                    if (!isValid) {
                      return 'El número de teléfono debe tener entre 8 y 10 dígitos';
                    }
                  },
                }}
              />
            </div>
            <CustomSelect
              name="rolId"
              text="Seleccioná el tipo de usuario"
              arrayOptions={[
                { value: 2, text: 'Administrador' },
                { value: 5, text: 'Encargado' },
                { value: 6, text: 'Administración' },
                { value: 7, text: 'Operario' },
              ]}
              validate={{ required: true }}
            />
          </div>
        </div>
        <div className={styles.inputContainerLong}>
          <span className={styles.subTitle}>Adicional</span>
        </div>
        <Button
          type="submit"
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

export default OtherFormComponent;
