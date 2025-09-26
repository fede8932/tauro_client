import React, { useState } from 'react';
import styles from './editStock.module.css';
import { controlOrderString, fechaConverter } from '../../utils';
import { Table } from 'semantic-ui-react';
import CustomPagination from '../../commonds/pagination/CustomPagination';
import { Button } from 'semantic-ui-react';
import CustomPopup from '../../commonds/popup/CustomPopup';
import { Spinner } from 'react-bootstrap';

function EditStock({ order, onClick, updateAmount, loading }) {
  return (
    <div className={styles.editStockContainer}>
      <div className={styles.genericInfo}>
        <span>
          Fecha:{' '}
          <span className={styles.spanData}>
            {fechaConverter(order.controlOrder.createdAt)}
          </span>
        </span>
        <span>
          Control:{' '}
          <span className={styles.spanData}>
            {controlOrderString(order.controlOrder.id)}
          </span>
        </span>
        <span>
          Orden:{' '}
          <span className={styles.spanData}>
            {order.controlOrder.purchaseOrder.numero}
          </span>
        </span>
        <span>
          N° Remito:{' '}
          <span className={styles.spanData}>
            {order.controlOrder.numRemito}
          </span>
        </span>
      </div>
      <div className={styles.tableContainer}>
        <Table color={'violet'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Código</Table.HeaderCell>
              <Table.HeaderCell>Descripción</Table.HeaderCell>
              <Table.HeaderCell>Marca</Table.HeaderCell>
              <Table.HeaderCell>Cantidad</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {order.items.map((item, i) => (
              <Table.Row key={i}>
                <Table.Cell>{item.product.article.toUpperCase()}</Table.Cell>
                <Table.Cell>
                  <CustomPopup
                    content={item.product.description.toUpperCase()}
                  />
                </Table.Cell>
                <Table.Cell>{item.product.brand.toUpperCase()}</Table.Cell>
                <Table.Cell>
                  <input
                    defaultValue={item.amount}
                    onChange={(e) => {
                      updateAmount({ id: item.id, amount: e.target.value });
                    }}
                    className={styles.editInput}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div className={styles.paginationContainer}>
          <div></div>
          <Button
            primary
            type="submit"
            onClick={() => {
              onClick(order.controlOrder.id);
            }}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditStock;
