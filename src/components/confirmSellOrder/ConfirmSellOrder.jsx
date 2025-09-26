import React, { useState } from 'react';
import styles from './confirmSellOrder.module.css';
import { FormProvider } from 'react-hook-form';
import CustomSelect from '../../commonds/select/CustomSelect';
import CustomInput from '../../commonds/input/CustomInput';
import { Button } from 'react-bootstrap';
import { dateConverter } from '../../utils';

function ConfirmSellOrder(props) {
  const { methods, order, onSubmit } = props;
  const [viewNoFac, setViewNoFac] = useState(false);
  return (
    <div className={styles.facContainer}>
      <div className={styles.dataContainer}>
        <span style={{ width: '33%' }}>
          Fecha:{' '}
          <span className={styles.datosSpan}>{dateConverter(new Date())}</span>
        </span>
        <span
          style={{ width: '33%', display: 'flex', justifyContent: 'center' }}
        >
          CUIT: <span className={styles.datosSpan}>{order.client.cuit}</span>
        </span>
        <span style={{ width: '33%', display: 'flex', justifyContent: 'end' }}>
          Razon Social:{' '}
          <span className={styles.datosSpan}>{order.client.razonSocial}</span>
        </span>
      </div>
      <div className={styles.dataContainer}>
        <span style={{ width: '33%' }}>
          Orden: <span className={styles.datosSpan}>{order.numero}</span>
        </span>
        <span
          style={{ width: '33%', display: 'flex', justifyContent: 'center' }}
        >
          Subtotal:{' '}
          <span className={styles.datosSpan}>{`$ ${order.subTotal}`}</span>
        </span>
        <span style={{ width: '33%', display: 'flex', justifyContent: 'end' }}>
          Total: <span className={styles.datosSpan}>{`$ ${order.total}`}</span>
        </span>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.message}>
          Preste mucha atención ya que no podrá modificar los montos ingresados
        </div>
        <FormProvider {...methods}>
          <form className={styles.formContainer}>
            <div className={styles.inputContainer}>
              <div className={styles.leftInputContainer}>
                <div style={{ width: '100%' }}>
                  <span className={styles.inputLabel}>Tipo</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CustomSelect
                      width="large"
                      name="code"
                      text="Sel. tipo de fact"
                      arrayOptions={[
                        { text: 'Tipo A', value: 'A' },
                        { text: 'Tipo B', value: 'B' },
                        { text: 'Tipo C', value: 'C' },
                        { text: 'Presupuesto', value: 'P' },
                      ]}
                      validate={{ required: true }}
                      extraFn={setViewNoFac}
                    />
                  </div>
                  {viewNoFac ? (
                    <div className={styles.inputLabelCon}>
                      <span className={styles.inputLabel}>
                        Número de factura
                      </span>
                      <CustomInput
                        name="numFac"
                        type="text"
                        width="large"
                        placeholder="Ingresar el numero de la factura sin los ceros a la izquierda"
                        icon="fa-solid fa-id-card"
                        validate={{
                          required: true,
                          pattern: {
                            value: /^[-+]?\d+(\.\d+)?$/,
                            message:
                              'Debes ingresar un número entero o decimal con . (punto)',
                          },
                        }}
                      />
                    </div>
                  ) : null}
                </div>
                {viewNoFac ? (
                  <>
                    <span className={styles.inputLabel}>Monto facturado</span>
                    <CustomInput
                      name="subtotal"
                      type="text"
                      width="large"
                      placeholder="Ingresá el monto total de la factura (incluyendo el iva)"
                      icon="fa-solid fa-file-invoice-dollar"
                      validate={{
                        required: true,
                        pattern: {
                          value: /^[-+]?\d+(\.\d+)?$/,
                          message:
                            'Debes ingresar un número entero o decimal con . (punto)',
                        },
                      }}
                    />
                  </>
                ) : null}
                <>
                  <span className={styles.inputLabel}>Monto no facturado</span>
                  <CustomInput
                    name="noFact"
                    type="text"
                    width="large"
                    placeholder="Ingresar monto que no se facturó"
                    icon="fa-solid fa-hand-holding-dollar"
                    validate={{
                      required: true,
                      pattern: {
                        value: /^[-+]?\d+(\.\d+)?$/,
                        message:
                          'Debes ingresar un número entero o decimal con . (punto)',
                      },
                    }}
                  />
                </>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <div className={styles.buttonSubContainer}>
                <Button
                  onClick={methods.handleSubmit(onSubmit)}
                  style={{
                    backgroundColor: '#673ab7',
                    border: '1px solid #673ab7',
                    height: '35px',
                    width: '100px',
                    marginLeft: '10px',
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default ConfirmSellOrder;
