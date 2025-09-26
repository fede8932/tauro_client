import React, { useState } from 'react';
import styles from './orderView.module.css';
import { Label } from 'semantic-ui-react';
import OrderDetailTable from '../../commonds/orderDetailTable/OrderDetailTable';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import { numberToString } from '../../utils';
import { orderStatus, typeOrder } from '../../enum/StatusOrderEnum';

function OrderViewComponent(props) {
  const { close, order, addFact, printBill, confirmFn } = props;

  // console.log(order);

  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        {typeOrder[order.type] != "Sell" ? (
          <span className={styles.inputLabel}>
            ID Orden:<span className={styles.dataUser}>{order.id}</span>
          </span>
        ) : null}
        <span>
          Nº de Orden:<span className={styles.dataUser}>{order.numero}</span>
        </span>
        <span>
          Tipo:
          <span className={styles.dataUser}>
            {typeOrder[order.type] != "Sell" ? 'COMPRA' : 'VENTA'}
          </span>
        </span>
        <span>
          {typeOrder[order.type] == "Buy" ? 'Proveedor:' : 'Cliente:'}
          <span className={styles.dataUser}>
            {typeOrder[order.type] == "Buy"
              ? order.supplier?.razonSocial?.toUpperCase()
              : order.client?.razonSocial?.toUpperCase()}
          </span>
        </span>
        <span>
          Total:<ProtectedComponent listAccesss={[1, 2]}>
          <span className={styles.dataUser}>{`$ ${numberToString(
            order.subTotal
          )}`}</span></ProtectedComponent>
        </span>
        {order.oferta ? <Label color="green">Oferta</Label> : null}
        <div>
          <Label color="blue">{orderStatus[order.status]}</Label>
        </div>
        {typeOrder[order.type] == "Sell" && orderStatus[order.status] == 'Sent' ? (
          <Button
            disabled={true}
            type="button"
            style={{
              backgroundColor: '#673ab7',
              border: '1px solid #673ab7',
              height: '38px',
              width: '100px',
              marginLeft: '10px',
            }}
            onClick={async () => {
              setLoading(true);
              await printBill(order.id);
              setLoading(false);
            }}
          >
            {loading ? <Spinner /> : 'Factura'}
          </Button>
        ) : null}
      </div>
      <div className={styles.tableContainer}>
        <OrderDetailTable
          columns={[
            { title: 'Código', width: '10%' },
            { title: 'Descripción', width: '50%' },
            { title: 'Marca', width: '10%' },
            { title: 'Precio', width: '10%' },
            { title: 'Cantidad', width: '10%' },
            { title: 'Total', width: '10%' },
          ]}
          color="teal"
          data={order}
        />
      </div>
      <div className={styles.buttonContainer}>
        {orderStatus[order.status] == 'Recived' && order.movements.length == 0 ? (
          <ProtectedComponent listAccesss={[1, 2, 5]}>
            <Button
              onClick={() => {
                addFact(order.id);
              }}
              style={{
                backgroundColor: '#673ab7',
                border: '1px solid #673ab7',
                height: '38px',
                width: '160px',
                marginLeft: '10px',
              }}
            >
              Agregar Factura
            </Button>
          </ProtectedComponent>
        ) : null}
        {orderStatus[order.status] == 'Open' && order.movements.length == 0 ? (
          <Button
            onClick={() => {
              confirmFn(order.id, 'Confirm', typeOrder[order.type]);
            }}
            style={{
              backgroundColor: '#673ab7',
              border: '1px solid #673ab7',
              height: '38px',
              width: '160px',
              marginLeft: '10px',
            }}
          >
            Confirmar Orden
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default OrderViewComponent;
