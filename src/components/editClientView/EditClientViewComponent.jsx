import React, { useState } from 'react';
import styles from './editClientView.module.css';
import Button from 'react-bootstrap/esm/Button';
import CustomInput from '../../commonds/putInput/CustomInput';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';
import CustomSelect from '../../commonds/select/CustomSelect';
import Form from 'react-bootstrap/Form';
import { Checkbox, Button as SemanticButton } from 'semantic-ui-react';
import { useNavigate } from 'react-router';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import PutCustomTextArea from '../../commonds/putTextArea/PutCustomTextArea';
import { useDispatch } from 'react-redux';
import { changeInput } from '../../redux/client';

function EditClientViewComponent(props) {
  const { client, update, methods, loading, sellers } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(client);
  const [readOnly, setReadOnly] = useState(true);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(changeInput({ name, value }));
  };

  const handleChequedChange = (e, d) => {
    const { checked, name } = d;
    dispatch(changeInput({ name, value: checked }));
  };
  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        <span className={styles.inputLabel}>
          User ID:<span className={styles.dataUser}>{client?.user?.id}</span>
        </span>
        <span>
          Client ID:<span className={styles.dataUser}>{client?.id}</span>
        </span>
        <span>
          Cliente:
          <span
            className={styles.dataUser}
          >{`${client?.user?.name} ${client?.user?.lastName}`}</span>
        </span>
        <span>
          Vendedor Asigando:
          <span
            className={styles.dataUser}
          >{`${client?.seller?.user?.name} ${client?.seller?.user?.lastName}`}</span>
        </span>
        <span>
          IVA:<span className={styles.dataUser}>{client?.iva}</span>
        </span>
        <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Editar"
            onChange={() => {
              setReadOnly(!readOnly);
            }}
          />
        </ProtectedComponent>
      </div>
      <FormProvider {...methods}>
        <form onChange={handleInputChange} className={styles.formContainer}>
          <div className={styles.inputContainer}>
            <div className={styles.leftInputContainer}>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '50%', padding: '0px 0px 0px 5px' }}>
                  <span className={styles.inputLabel}>Nombre</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="name"
                    type="text"
                    width="complete"
                    placeholder="Nombre"
                    icon="fa-solid fa-id-card"
                    validate={{ required: true }}
                    value={client?.user?.name}
                  />
                </div>
                <div style={{ width: '50%', padding: '0px 0px 0px 5px' }}>
                  <span className={styles.inputLabel}>Apellido</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="lastName"
                    type="text"
                    width="complete"
                    placeholder="Apellido"
                    icon="fa-solid fa-id-card"
                    validate={{ required: true }}
                    value={client?.user?.lastName}
                  />
                </div>
              </div>
              <span className={styles.inputLabel}>Razon Social</span>
              <CustomInput
                readOnly={readOnly}
                name="razonSocial"
                type="text"
                width="large"
                placeholder="Razón social"
                icon="fa-regular fa-envelope"
                validate={{
                  required: true,
                }}
                value={client?.razonSocial}
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
                value={client?.user?.email}
              />

              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '50%', padding: '0px 0px 0px 5px' }}>
                  <span className={styles.inputLabel}>CUIL</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="cuit"
                    type="text"
                    width="complete"
                    placeholder="Cuil"
                    icon="fa-solid fa-id-card"
                    validate={{ required: true }}
                    value={client?.cuit}
                  />
                </div>
                <div style={{ width: '50%', padding: '0px 0px 0px 5px' }}>
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
                    }}
                    value={client?.telefono}
                  />
                </div>
              </div>
              <span className={styles.inputLabel}>Localidad</span>
              <CustomInput
                readOnly={readOnly}
                name="localidad"
                type="text"
                width="large"
                placeholder="Localidad"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
                value={client?.localidad}
              />
            </div>
            <div className={styles.rigthInputContainer}>
              <span className={styles.inputLabel}>Calle</span>
              <CustomInput
                readOnly={readOnly}
                name="calle"
                type="text"
                width="large"
                placeholder="Calle"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
                value={client?.calle}
              />
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
                    value={client?.altura}
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
                    value={client?.codigoPostal}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '50%', padding: '0px 5px 0px 0px' }}>
                  <span className={styles.inputLabel}>Vendedor</span>
                  <CustomSelect
                    readOnly={readOnly}
                    name="sellerId"
                    text="Seleccioná un vendedor"
                    arrayOptions={sellers}
                    //validate={{ required: false }}
                    value={client?.sellerId}
                  />
                </div>
                <div style={{ width: '50%', padding: '0px 0px 0px 5px' }}>
                  <span className={styles.inputLabel}>IVA</span>
                  <CustomSelect
                    name="iva"
                    text="Seleccioná el tipo de iva"
                    arrayOptions={[
                      {
                        value: 'ResponsableInscripto',
                        text: 'ResponsableInscripto',
                      },
                      { value: 'Monotributista', text: 'Monotributista' },
                      { value: 'Excento', text: 'Excento' },
                      { value: 'NoGravado', text: 'NoGravado' },
                      { value: 'Final', text: 'Final' },
                    ]}
                    //validate={{ required: false }}
                    value={client?.iva}
                  />
                </div>
              </div>
              <div style={{ width: '100%', padding: '0px 0px 0px 5px' }}>
                <div
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Checkbox
                    label="Acepta pendiente"
                    disabled={readOnly}
                    checked={client?.acceptPending}
                    name="acceptPending"
                    onChange={handleChequedChange}
                  />
                  <Checkbox
                    label="Tiene ofertas"
                    disabled={readOnly}
                    checked={client?.hasSale}
                    name="hasSale"
                    onChange={handleChequedChange}
                  />
                  <ProtectedComponent listAccesss={[1, 2]}>
                    <Checkbox
                      label="Cliente especial"
                      disabled={readOnly}
                      checked={client?.comitionSale}
                      name="comitionSale"
                      onChange={handleChequedChange}
                    />
                  </ProtectedComponent>
                </div>
                <span className={styles.inputLabel}>Comentarios</span>
                <PutCustomTextArea
                  width="large"
                  name="comentarios"
                  value={client?.comentarios}
                />
              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.buttonSubContainer}>
              <ProtectedComponent listAccesss={[1, 2, 5]}>
                <SemanticButton
                  color="orange"
                  type="button"
                  onClick={() => {
                    navigate(`/edit/client/${client?.id}`);
                  }}
                >
                  Descuentos
                </SemanticButton>
              </ProtectedComponent>
              <ProtectedComponent listAccesss={[1, 2, 5]}>
                <SemanticButton
                  color="teal"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/search/acount/client/${client?.currentAcount?.id}`
                    );
                  }}
                >
                  Cuenta corriente
                </SemanticButton>
              </ProtectedComponent>
              <Button
                onClick={methods.handleSubmit(update)}
                type="button"
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

export default EditClientViewComponent;
