import React from 'react';
import { Table } from 'semantic-ui-react';
import CustomPopup from '../popup/CustomPopup';
import { redondearADosDecimales } from '../../utils';

const BillDetailTable = (props) => {
  const { columns, style, color, data } = props;
  const items = data?.orderAjust
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
              <Table.Cell>{item.product.article?.toUpperCase()}</Table.Cell>
              <Table.Cell>
                <CustomPopup
                  characters={60}
                  content={item.product.description.toUpperCase()}
                />
              </Table.Cell>
              <Table.Cell>{item.product.brand.name.toUpperCase()}</Table.Cell>
              <Table.Cell>
                {`$ ${redondearADosDecimales(
                  item.sellPrice * (item.fact ? 1.21 : 1)
                )}`}
              </Table.Cell>
              <Table.Cell>{item.amount}</Table.Cell>
              <Table.Cell>
                {`$ ${redondearADosDecimales(
                  item.sellPrice * item.amount * (item.fact ? 1.21 : 1)
                )}`}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
export default BillDetailTable;
