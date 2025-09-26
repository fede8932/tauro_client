import React from 'react';
import styles from './supplierForm.module.css';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../commonds/input/CustomInput';
import Button from 'react-bootstrap/Button';
import CustomTextArea from '../../commonds/textarea/CustomTextArea';
import Spinner from 'react-bootstrap/Spinner';

function SupplierFormCmponent(props) {
  const { onSubmit, status, methods } = props;
  return (
    <FormProvider {...methods}>
      <form
        className={styles.formContainer}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos comerciales</span>
            <CustomInput
              name="razonSocial"
              type="text"
              width="large"
              placeholder="Razón social*"
              icon="fa-solid fa-id-card"
              validate={{ required: true, maxLength: 25 }}
            />
            <CustomInput
              name="cuit"
              type="text"
              width="large"
              placeholder="Cuit*"
              icon="fa-solid fa-id-card"
              validate={{
                required: true,
                pattern: {
                  value: /^\d{2}-\d{8}-\d{1}$/,
                  message: 'El CUIT debe tener el formato 99-99999999-9',
                },
              }}
            />
            <CustomTextArea
              name="comentarios"
              width="large"
              placeholder="En este campo puedes ingresar descripciones... (Máximo 160 caracteres)"
              type="textarea"
              validate={{ required: false, maxLength: 160 }}
            />
          </div>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos de contacto</span>
            <CustomInput
              name="calle"
              type="text"
              width="large"
              placeholder="Calle"
              icon="fa-solid fa-location-dot"
              validate={{ required: false, maxLength: 25 }}
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
                width="extraSmall"
                placeholder="Altura"
                icon="fa-solid fa-location-dot"
                validate={{ required: false, maxLength: 10 }}
              />
              <CustomInput
                name="codigoPostal"
                type="text"
                width="extraSmall"
                placeholder="Código postal"
                icon="fa-solid fa-location-dot"
                validate={{ required: false, maxLength: 10 }}
              />
              <CustomInput
                name="localidad"
                type="text"
                width="extraSmall"
                placeholder="Localidad"
                icon="fa-solid fa-location-dot"
                validate={{ required: false, maxLength: 25 }}
              />
            </div>
            <CustomInput
              name="email"
              type="text"
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
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
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
              <CustomInput
                name="descuento"
                type="text"
                width="small"
                placeholder="Porcentaje de descuento"
                icon="fa-solid fa-percent"
                validate={{
                  required: true,
                  validate: (value) => {
                    const isValid = /^(?:\d{1,2})(?:\.\d{1,2})?$/.test(value);
                    if (!isValid) {
                      return 'Ingrese un número con hasta 2 enteros y 2 decimales';
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.inputContainerLong}>
          <span className={styles.subTitle}>Representantes</span>
          <div className={styles.divContainer}>
            <div className={styles.containerTable2}>
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
                validate={{ required: true, maxLength: 15 }}
              />
              <CustomInput
                name="repEmail"
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
            </div>
            <div className={styles.containerTable2}>
              <CustomInput
                name="repPhone"
                type="text"
                width="large"
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
              <CustomTextArea
                name="repComent"
                width="large"
                placeholder="En este campo puedes ingresar datos adicionales... (Máximo 160 caracteres)"
                type="textarea"
                validate={{ required: false, maxLength: 160 }}
              />
            </div>
          </div>
        </div>
        <Button
          type="submit"
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

export default SupplierFormCmponent;
