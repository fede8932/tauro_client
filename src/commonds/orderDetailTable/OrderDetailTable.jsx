import React from 'react';
import { Table } from 'semantic-ui-react';
import CustomPopup from '../popup/CustomPopup';
import { numberToString, redondearADosDecimales } from '../../utils';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';

const OrderDetailTable = (props) => {
  const { columns, style, color, data } = props;
  const items = data.orderAjust
    ? data.orderAjust.ajustOrderItems
    : data.purchaseOrderItems;

  // console.log(items);

  return (
    <div style={style}>
      <Table color={color}>
        <Table.Header>
          <Table.Row>
            {columns.map((column, i) => (
              <Table.HeaderCell key={i}>{column.title}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items?.map((item, i) => (
            <Table.Row key={i}>
              <Table.Cell>{item.product.article.toUpperCase()}</Table.Cell>
              <Table.Cell>
                <CustomPopup
                  characters={60}
                  content={item.product.description.toUpperCase()}
                />
              </Table.Cell>
              <Table.Cell>{item.product.brand.name.toUpperCase()}</Table.Cell>
              <Table.Cell style={{ fontSize: '12px' }}>
                <ProtectedComponent listAccesss={[1, 2]}>
                  <span>
                    {`$ ${numberToString(
                      data.type != 1 ? item.buyPrice : item.sellPrice
                    )}`}
                  </span>
                </ProtectedComponent>
              </Table.Cell>
              <Table.Cell>{item.amount}</Table.Cell>
              <Table.Cell style={{ fontSize: '12px' }}>
                <ProtectedComponent listAccesss={[1, 2]}>
                  <span>
                    {`$ ${numberToString(
                      data.type != 1
                        ? item.buyPrice * item.amount
                        : item.sellPrice * item.amount
                    )}`}
                  </span>
                </ProtectedComponent>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
export default OrderDetailTable;
