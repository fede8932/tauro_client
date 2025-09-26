import React from 'react';
import styles from './clientAcordion.module.css';
import Accordion from 'react-bootstrap/Accordion';
import CustomInput from '../input/CustomInput';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomSelect from '../select/CustomSelect';
import { useForm, FormProvider } from 'react-hook-form';
import CustomSearch from '../customSearch/CustomSearch';

function ClientAcordion({ client, type }) {
  const methodsNoClient = useForm();
  return (
    <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Cliente registrado</Accordion.Header>
        <Accordion.Body>
          <div className={styles.acordionBodyContainer}>
            <CustomSearch
              type="text"
              placeholder="CUIL/CUIT o Razón Social"
              icon="fa-solid fa-magnifying-glass"
            />
            <div className={styles.dataContainer}>
              <Container style={{ margin: '0' }}>
                <Row className={styles.filas}>
                  <Col className={styles.colUno}>
                    <span className={styles.titleInfo}>
                      Razón social:
                      <span className={styles.info}>
                        {client && client.razonSocial}
                      </span>
                    </span>
                  </Col>
                  <Col className={styles.colDos}>
                    <span className={styles.titleInfo}>
                      CUIT:
                      <span className={styles.info}>
                        {client && client.cuit}
                      </span>
                    </span>
                  </Col>
                  <Col className={styles.colTres}>
                    <span className={styles.titleInfo}>
                      Estado:
                      {client ? (
                        <span className={`${styles.info} ${styles.statusTrue}`}>
                          {client?.user?.status ? 'Active' : 'Inactive'}
                        </span>
                      ) : null}
                    </span>
                  </Col>
                </Row>
                <Row className={styles.filas}>
                  <Col className={styles.colUno}>
                    <span className={styles.titleInfo}>
                      Calle:
                      <span className={styles.info}>
                        {client && client.calle}
                      </span>
                    </span>
                  </Col>
                  <Col className={styles.colDos}>
                    <span className={styles.titleInfo}>
                      Altura:
                      <span className={styles.info}>
                        {client && client.altura}
                      </span>
                    </span>
                  </Col>
                  <Col className={styles.colTres}>
                    <span className={styles.titleInfo}>
                      Localidad:
                      <span className={styles.info}>
                        {client && client.localidad}
                      </span>
                    </span>
                  </Col>
                </Row>
                <Row className={styles.filas}>
                  <Col className={styles.colUno}>
                    <span className={styles.titleInfo}>
                      Email:
                      <span className={styles.info}>
                        {client && client.user?.email}
                      </span>
                    </span>
                  </Col>
                  <Col className={styles.colDos}>
                    <span className={styles.titleInfo}>
                      Teléfono:
                      <span className={styles.info}>
                        {client && client.telefono}
                      </span>
                    </span>
                  </Col>
                  <Col className={styles.colTres}>
                    <span className={styles.titleInfo}>
                      Cuenta corriente:
                      <span className={`${styles.info} ${styles.statusFalse}`}>
                        {client && `$ ${client?.currentAcount?.resume}`}
                      </span>
                    </span>
                  </Col>
                </Row>
              </Container>
            </div>
            <div
              className={styles.inputContainer}
              style={{ marginBottom: '35px', height: '125px' }}
            >
              <span className={styles.titleInfo}>
                Comentarios:
                <span className={styles.info}>
                  {client && client.comentarios}
                </span>
              </span>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      {/* <Accordion.Item eventKey="1">
        <Accordion.Header>Cliente sin registrar</Accordion.Header>
        {type != "sale" ? (
          <Accordion.Body>
            <div className={styles.acordionBodyContainer}>
              <FormProvider {...methodsNoClient}>
                <form
                  className={styles.formContainer}
                  onSubmit={methodsNoClient.handleSubmit(() => {
                    console.log("ok");
                  })}
                >
                  <div className={styles.miniInputContainer}>
                    <CustomInput
                      name="name"
                      type="text"
                      width="small"
                      placeholder="Nombre"
                      icon="fa-solid fa-id-card"
                      validate={{ required: true, maxLength: 25 }}
                    />
                    <CustomInput
                      name="lastName"
                      type="text"
                      width="small"
                      placeholder="Apellido"
                      icon="fa-solid fa-id-card"
                      validate={{ required: true, maxLength: 25 }}
                    />
                  </div>
                  <div className={styles.miniInputContainer}>
                    <CustomInput
                      name="razonSocial"
                      type="text"
                      width="small"
                      placeholder="Razon social"
                      icon="fa-solid fa-id-card"
                      validate={{ required: true, maxLength: 25 }}
                    />
                    <CustomInput
                      name="cuit"
                      type="text"
                      width="small"
                      placeholder="Cuil/Cuit"
                      icon="fa-solid fa-id-card"
                      validate={{
                        required: true,
                        pattern: {
                          value: /^\d{2}-\d{8}-\d{1}$/,
                          message:
                            "El CUIT debe tener el formato 99-99999999-9",
                        },
                      }}
                    />
                  </div>
                  <div className={styles.miniInputContainer}>
                    <CustomInput
                      name="email"
                      type="email"
                      width="small"
                      placeholder="Correo electrónico"
                      icon="fa-regular fa-envelope"
                      validate={{
                        required: true,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Ingrese un correo electrónico válido",
                        },
                      }}
                    />
                    <CustomInput
                      name="telefono"
                      type="text"
                      width="small"
                      placeholder="Teléfono"
                      icon="fa-solid fa-phone"
                      validate={{
                        required: true,
                        validate: (value) => {
                          const isValid = /^\d{8,10}$/.test(value);
                          if (!isValid) {
                            return "El número de teléfono debe tener entre 8 y 10 dígitos";
                          }
                        },
                      }}
                    />
                  </div>
                  <div className={styles.miniInputContainer}>
                    <CustomInput
                      name="calleAltura"
                      type="text"
                      width="small"
                      placeholder="Domicilio"
                      icon="fa-solid fa-location-dot"
                      validate={{ required: true, maxLength: 25 }}
                    />
                    <CustomInput
                      name="localidad"
                      type="text"
                      width="small"
                      placeholder="Localidad"
                      icon="fa-solid fa-location-dot"
                      validate={{ required: true, maxLength: 25 }}
                    />
                  </div>
                  <div className={styles.miniSelectContainer}>
                    <div className={styles.miniSelect}>
                      <CustomSelect
                        name="iva"
                        text="Seleccioná el tipo de factura"
                        arrayOptions={[
                          {
                            value: "ResponsableInscripto",
                            text: "ResponsableInscripto",
                          },
                          { value: "Monotributista", text: "Monotributista" },
                          { value: "Final", text: "Final" },
                        ]}
                        validate={{ required: true }}
                      />
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Accordion.Body>
        ) : null}
      </Accordion.Item> */}
    </Accordion>
  );
}

export default ClientAcordion;
