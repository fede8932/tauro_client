import React, { useState } from 'react';
import styles from './editRepresView.module.css';
import Button from 'react-bootstrap/esm/Button';
import CustomInput from '../../commonds/putInput/CustomInput';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';
import CustomTextArea from '../../commonds/putTextArea/PutCustomTextArea';
import Form from 'react-bootstrap/Form';

function EditRepresentativesViewComponent(props) {
  const { supplier, methods, update, loading, path, repindex } = props;
  const { representative } = supplier;
  const [readOnly, setReadOnly] = useState(true);
  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        <span>
          Supplier ID:<span className={styles.dataUser}>{supplier.id}</span>
        </span>
        <span>
          Proveedor:
          <span className={styles.dataUser}>{supplier.razonSocial}</span>
        </span>
        <span>
          IVA:<span className={styles.dataUser}>No definido</span>
        </span>
        {path !== '/search/supplier' ? (
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Editar"
            onChange={() => {
              setReadOnly(!readOnly);
            }}
          />
        ) : null}
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(update)}
          className={styles.formContainer}
        >
          <div className={styles.inputContainer}>
            <div className={styles.leftInputContainer}>
              <span className={styles.inputLabel}>Nombre</span>
              <CustomInput
                readOnly={path === '/search/supplier' ? false : readOnly}
                name="name"
                type="text"
                width="large"
                placeholder="Nombre"
                icon="fa-solid fa-id-card"
                validate={{ required: true }}
                defaultValue={
                  path === '/search/supplier'
                    ? null
                    : representative[repindex].name
                }
              />
              <span className={styles.inputLabel}>Apellido</span>
              <CustomInput
                readOnly={path === '/search/supplier' ? false : readOnly}
                name="apellido"
                type="text"
                width="large"
                placeholder="Apellido"
                icon="fa-solid fa-id-card"
                validate={{ required: true }}
                defaultValue={
                  path === '/search/supplier'
                    ? null
                    : representative[repindex].apellido
                }
              />
              <span className={styles.inputLabel}>Email</span>
              <CustomInput
                readOnly={path === '/search/supplier' ? false : readOnly}
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
                defaultValue={
                  path === '/search/supplier'
                    ? null
                    : representative[repindex].email
                }
              />
              <span className={styles.inputLabel}>Teléfono</span>
              <CustomInput
                readOnly={path === '/search/supplier' ? false : readOnly}
                name="telefono"
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
                defaultValue={
                  path === '/search/supplier'
                    ? null
                    : representative[repindex].telefono
                }
              />
            </div>
            <div className={styles.rigthInputContainer}>
              <span className={styles.inputLabel}>Comentarios</span>
              <CustomTextArea
                readOnly={path === '/search/supplier' ? false : readOnly}
                name="comentarios"
                width="medium"
                placeholder="En este campo puedes ingresar descripciones... (Máximo 160 caracteres)"
                type="textarea"
                validate={{ required: false, maxLength: 160 }}
                defaultValue={
                  path === '/search/supplier'
                    ? null
                    : representative[repindex].comentarios
                }
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.buttonSubContainer}>
              <Button
                disabled={path === '/search/supplier' ? false : readOnly}
                type="submit"
                style={{
                  backgroundColor: '#673ab7',
                  border: '1px solid #673ab7',
                  height: '35px',
                  width: '100px',
                  marginLeft: '10px',
                }}
              >
                {!loading ? (
                  <>{path === '/search/supplier' ? 'Agregar' : 'Actualizar'}</>
                ) : (
                  <Spinner animation="border" variant="light" size="sm" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditRepresentativesViewComponent;
