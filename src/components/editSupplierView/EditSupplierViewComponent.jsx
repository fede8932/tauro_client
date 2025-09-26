import React, { useEffect, useState } from 'react';
import styles from './editSupplierView.module.css';
import Button from 'react-bootstrap/esm/Button';
import CustomInput from '../../commonds/putInput/CustomInput';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';
import PutCustomTextArea from '../../commonds/putTextArea/PutCustomTextArea';
import Form from 'react-bootstrap/Form';
import { getSupplierInfoRequest } from '../../redux/supplier';
import { useDispatch, useSelector } from 'react-redux';

function EditSupplierViewComponent(props) {
  const { supplier, update, methods, loading } = props;
  const [readOnly, setReadOnly] = useState(true);

  const { selectSupplier } = useSelector((state) => state.supplier);
  const dispatch = useDispatch();

  useEffect(() => {
    if (supplier) {
      dispatch(getSupplierInfoRequest(supplier.id))
    }
  }, [supplier]);

  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        <span>
          Supplier ID:<span className={styles.dataUser}>{selectSupplier?.id}</span>
        </span>
        <span>
          Proveedor:
          <span className={styles.dataUser}>{selectSupplier?.razonSocial}</span>
        </span>
        <span>
          IVA:<span className={styles.dataUser}>No definido</span>
        </span>
        <Form.Check // prettier-ignore
          type="switch"
          id="custom-switch"
          label="Editar"
          onChange={() => {
            setReadOnly(!readOnly);
          }}
        />
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(update)}
          className={styles.formContainer}
        >
          <div className={styles.inputContainer}>
            <div className={styles.leftInputContainer}>
              <span className={styles.inputLabel}>Razón Social</span>
              <CustomInput
                readOnly={readOnly}
                name="razonSocial"
                type="text"
                width="large"
                placeholder="Nombre"
                icon="fa-solid fa-id-card"
                validate={{ required: true }}
                defaultValue={selectSupplier?.razonSocial}
              />
              <span className={styles.inputLabel}>Email</span>
              <CustomInput
                readOnly={readOnly}
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
                defaultValue={selectSupplier?.email}
              />
              <span className={styles.inputLabel}>CUIT</span>
              <CustomInput
                readOnly={readOnly}
                name="cuit"
                type="text"
                width="large"
                placeholder="Cuit"
                icon="fa-solid fa-id-card"
                validate={{ required: true }}
                defaultValue={selectSupplier?.cuit}
              />
              <span className={styles.inputLabel}>Localidad</span>
              <CustomInput
                readOnly={readOnly}
                name="localidad"
                type="text"
                width="large"
                placeholder="Localidad"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
                defaultValue={selectSupplier?.localidad}
              />
              <span className={styles.inputLabel}>Calle</span>
              <CustomInput
                readOnly={readOnly}
                name="calle"
                type="text"
                width="large"
                placeholder="Calle"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
                defaultValue={selectSupplier?.calle}
              />
            </div>
            <div className={styles.rigthInputContainer}>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '50%', padding: '0px 5px 0px 0px' }}>
                  <span className={styles.inputLabel}>Altura</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="altura"
                    type="text"
                    width="complete"
                    placeholder="Altura"
                    icon="fa-solid fa-location-dot"
                    validate={{ required: true, maxLength: 10 }}
                    defaultValue={selectSupplier?.altura}
                  />
                </div>
                <div style={{ width: '50%', padding: '0px 0px 0px 5px' }}>
                  <span className={styles.inputLabel}>Código postal</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="codigoPostal"
                    type="text"
                    width="complete"
                    placeholder="Código postal"
                    icon="fa-solid fa-location-dot"
                    validate={{ required: true, maxLength: 10 }}
                    defaultValue={selectSupplier?.codigoPostal}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '49%' }}>
                  <span className={styles.inputLabel}>Teléfono</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="telefono"
                    type="text"
                    width="complete"
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
                    defaultValue={selectSupplier?.telefono}
                  />
                </div>
                <div style={{ width: '49%' }}>
                  <span className={styles.inputLabel}>Porcentaje de descuento</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="descuento"
                    type="text"
                    width="complete"
                    placeholder="Descuento"
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
                    defaultValue={selectSupplier?.descuento * 100}
                  />
                </div>
              </div>
              <span className={styles.inputLabel}>Comentarios</span>
              <PutCustomTextArea
                name="comentarios"
                width="large"
                placeholder="En este campo puedes ingresar descripciones... (Máximo 160 caracteres)"
                type="textarea"
                validate={{ required: false, maxLength: 160 }}
                defaultValue={selectSupplier?.comentarios}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.buttonSubContainer}>
              <Button
                disabled={readOnly}
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
                  'Actualizar'
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

export default EditSupplierViewComponent;
