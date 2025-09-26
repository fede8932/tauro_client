import React, { useState } from 'react';
import styles from './confirmBuy.module.css';
import { Button } from 'react-bootstrap';
import { Label } from 'semantic-ui-react';
import LongTableContainer from '../../containers/LongTableContainer';

function ConfirmBuy(props) {
  const { addRem, order, ajustFn } = props;
  const ajustButton = order.data.orderAjust
    ? order.data.orderAjust.status
    : 'Open';
  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        <span className={styles.inputLabel}>
          Orden Nº:<span className={styles.dataUser}>{order.data.numero}</span>
        </span>
        <span>
          Proveedor:
          <span className={styles.dataUser}>
            {order.data.supplier.razonSocial}
          </span>
        </span>
        <span className={styles.inputLabel}>
          Total:
          <span className={styles.dataUser}>{`$ ${
            order.data.orderAjust
              ? order.data.orderAjust.total
              : order.data.total
          }`}</span>
        </span>
        <span>
          Estado:
          <span className={styles.dataUser}>
            <Label color="green">{order.data.status}</Label>
          </span>
        </span>
      </div>
      <div className={styles.tableContainer}>
        <span className={styles.subTitle}>Detalle de productos</span>
        <LongTableContainer
          colum={[
            { title: 'Marca', width: '20%' },
            { title: 'Código', width: '20%' },
            { title: 'Descripción', width: '45%' },
            { title: 'Cantidad', width: '15%' },
          ]}
          data={order.data}
          type="orderItems"
        />
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.buttonSubContainer}>
          {ajustButton == 'Open' ? (
            <Button
              onClick={() => {
                ajustFn();
              }}
              style={{
                backgroundColor: '#fbfbfb',
                color: '#673ab7',
                border: '1px solid #673ab7',
                height: '35px',
                width: '100px',
                marginLeft: '10px',
              }}
            >
              Ajustar
            </Button>
          ) : null}
          <Button
            onClick={() => {
              addRem(order.data.id);
            }}
            style={{
              backgroundColor: '#673ab7',
              border: '1px solid #673ab7',
              height: '35px',
              width: '100px',
              marginLeft: '10px',
            }}
          >
            {!order.loading ? (
              'Guardar'
            ) : (
              <Spinner animation="border" variant="light" size="sm" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBuy;
