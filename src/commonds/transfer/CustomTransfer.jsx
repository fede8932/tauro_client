import React, { useState } from 'react';
import styles from './customTransfer.module.css';
import { Table } from 'semantic-ui-react';
import { isSupplierInBrand } from '../../utils';

const CustomTransfer = (props) => {
  const { suppliers, brand, addSuppliers, deleteSupplier } = props;
  let tableSuppliers = [
    ...suppliers.data /*,
    ...Array(13 - suppliers.data.length).fill({}),*/,
  ];
  let tableBrandSuppliers = [
    ...brand.brandSuppliers /*,
    ...Array(13 - brand.brandSuppliers.length).fill({}),*/,
  ];
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  return (
    <div className={styles.transferContainer}>
      <div className={styles.tableContainer}>
        <Table color="blue">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: '8%' }}>Check</Table.HeaderCell>
              <Table.HeaderCell style={{ width: '75%' }}>
                Razón Social
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: '17%' }}>Id</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableSuppliers.map((supplier, i) => (
              <Table.Row style={{ height: '30px' }} key={i}>
                <Table.Cell
                  style={{ heigth: '30px', padding: '5px 0px 0px 12px' }}
                >
                  {supplier.id ? (
                    <input
                      disabled={isSupplierInBrand(supplier, brand)}
                      type="checkbox"
                      name={supplier.id}
                      onChange={() => {
                        setSelectedCheckboxes((prevSelected) => ({
                          ...prevSelected,
                          [supplier.id]: !prevSelected[supplier.id],
                        }));
                      }}
                      checked={selectedCheckboxes[supplier.id] || false}
                    />
                  ) : null}
                </Table.Cell>
                <Table.Cell
                  style={{ heigth: '30px', padding: '4px 0px 0px 12px' }}
                >
                  {supplier.razonSocial}
                </Table.Cell>
                <Table.Cell
                  style={{ heigth: '30px', padding: '5px 0px 0px 12px' }}
                >
                  {supplier.id}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div
        className={styles.buttonContainer}
        onClick={() => {
          addSuppliers(selectedCheckboxes);
        }}
      >
        <button className={styles.button}>
          <i className="fa-solid fa-chevron-right fa-xl"></i>
        </button>
      </div>
      <div className={styles.tableContainer}>
        <Table color="green">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: '17%' }}>Id</Table.HeaderCell>
              <Table.HeaderCell style={{ width: '70%' }}>
                Razón Social
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: '15%' }}>
                Acción
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {tableBrandSuppliers.map((bp, i) => (
              <Table.Row style={{ height: '30px' }} key={i}>
                <Table.Cell
                  style={{ heigth: '30px', padding: '5px 0px 0px 12px' }}
                >
                  {bp.supplierId ? bp.supplier.id : ''}
                </Table.Cell>
                <Table.Cell
                  style={{ heigth: '30px', padding: '5px 0px 0px 12px' }}
                >
                  {bp.supplierId ? bp.supplier.razonSocial : ''}
                </Table.Cell>
                <Table.Cell
                  style={{ heigth: '30px', padding: '6px 0px 0px 12px' }}
                >
                  {bp.supplierId ? (
                    <button
                      className={styles.button}
                      onClick={() => {
                        deleteSupplier({
                          brandId: bp.brandId,
                          supplierId: bp.supplierId,
                        });
                      }}
                    >
                      <i
                        className={`${styles.iconStyle} fa-regular fa-trash-can`}
                      ></i>
                    </button>
                  ) : (
                    ''
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default CustomTransfer;
