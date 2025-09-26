import React, { useEffect, useState } from 'react';
import styles from './formSelect.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import {
  getClientIdRequestNew,
  getClientRequest,
  resetClientState,
  resetSelectClientState,
} from '../../redux/client';
import { useDispatch, useSelector } from 'react-redux';
import { AutoComplete } from 'antd';

function FormSelectClientSellOrder(props) {
  const { setView, confirmFn, type } = props;
  const [textClient, setTextClient] = useState('');
  const [listClient, setListClient] = useState([]);
  const [selectClientId, setSelectClientId] = useState(null);

  const { data, selectClient } = useSelector((state) => state.client);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onChange = (d) => {
    setTextClient(d);
  };

  const onSelect = (value, options) => {
    setTextClient(options?.label ?? '');
    setSelectClientId(value);
  };

  useEffect(() => {
    if (selectClientId) {
      dispatch(getClientIdRequestNew(selectClientId));
    }
    return () => {
      dispatch(resetSelectClientState());
    };
  }, [selectClientId]);

  useEffect(() => {
    dispatch(getClientRequest(true));
    return () => {
      dispatch(resetClientState());
    };
  }, []);

  useEffect(() => {
    if (textClient == '' || !textClient) {
      setListClient(data);
      setSelectClientId(null);
      dispatch(resetSelectClientState());
      return;
    }
    let newClientsList = [...data].filter((c) => {
      return (
        c.label && c.label?.toLowerCase().includes(textClient?.toLowerCase())
      );
    });
    setListClient(newClientsList);
  }, [textClient, data]);
  return (
    <div className={styles.formContainer}>
      <div className={styles.buttonSubFormContainer}>
        <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos de cliente</span>
            <AutoComplete
              value={textClient}
              options={listClient}
              style={{
                width: 300,
              }}
              onSelect={onSelect}
              // onSearch={(text) => setAnotherOptions(getPanelValue(text))}
              onChange={onChange}
              placeholder="Seleccionar cliente"
            />
            <div>
              <div className={styles.acordionBodyContainer}>
                <div className={styles.dataContainer}>
                  <Container style={{ margin: '0' }}>
                    <Row className={styles.filas}>
                      <Col className={styles.colUno}>
                        <span className={styles.titleInfo}>
                          Razón social:
                          <span className={styles.info}>
                            {selectClient?.razonSocial}
                          </span>
                        </span>
                      </Col>
                      <Col className={styles.colDos}>
                        <span className={styles.titleInfo}>
                          CUIT:
                          <span className={styles.info}>
                            {selectClient?.cuit}
                          </span>
                        </span>
                      </Col>
                      <Col className={styles.colTres}>
                        <span className={styles.titleInfo}>
                          Estado:
                          {selectClient ? (
                            <span
                              className={`${styles.info} ${styles.statusTrue}`}
                            >
                              {selectClient?.user?.status
                                ? 'Active'
                                : 'Inactive'}
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
                            {selectClient?.calle}
                          </span>
                        </span>
                      </Col>
                      <Col className={styles.colDos}>
                        <span className={styles.titleInfo}>
                          Altura:
                          <span className={styles.info}>
                            {selectClient?.altura}
                          </span>
                        </span>
                      </Col>
                      <Col className={styles.colTres}>
                        <span className={styles.titleInfo}>
                          Localidad:
                          <span className={styles.info}>
                            {selectClient?.localidad}
                          </span>
                        </span>
                      </Col>
                    </Row>
                    <Row className={styles.filas}>
                      <Col className={styles.colUno}>
                        <span className={styles.titleInfo}>
                          Email:
                          <span className={styles.info}>
                            {selectClient?.user?.email}
                          </span>
                        </span>
                      </Col>
                      <Col className={styles.colDos}>
                        <span className={styles.titleInfo}>
                          Teléfono:
                          <span className={styles.info}>
                            {selectClient?.telefono}
                          </span>
                        </span>
                      </Col>
                      <Col className={styles.colTres}>
                        <span className={styles.titleInfo}>
                          Cuenta corriente:
                          {/* <span
                            className={`${styles.info} ${styles.statusFalse}`}
                          >
                            {client && `$ ${client?.currentAcount?.resume}`}
                          </span> */}
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
                      {selectClient?.comentarios}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            className={`${styles.buttonStyle} ${styles.buttonStyleBack}`}
            variant="danger"
            onClick={() => {
              type == 'sale' ? navigate('/') : setView('Productos');
            }}
          >
            {type == 'sale' ? 'Cancelar' : 'Atras'}
          </Button>
          <Button
            disabled={selectClient ? false : true}
            className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
            onClick={confirmFn}
          >
            {type == 'sale' ? 'Siguiente' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormSelectClientSellOrder;
