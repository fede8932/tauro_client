import React from 'react';
import styles from './table.module.css';
import { Table, Label, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

function TableComponent(props) {
  const { brands, indicadores, delFn } = props;
  console.log(brands);
  let tableBrand = [...brands /*, ...Array(13 - brands.length).fill({})*/];
  return (
    <div className={styles.tableWrapper}>
      <Table color="violet">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ width: '40%' }}>
              {indicadores[0]}
            </Table.HeaderCell>
            <Table.HeaderCell style={{ width: '35%' }}>
              {indicadores[1]}
            </Table.HeaderCell>
            <Table.HeaderCell style={{ width: '20%' }}>
              {indicadores[2]}
            </Table.HeaderCell>
            <Table.HeaderCell style={{ width: '30%' }}>
              {indicadores[3]}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tableBrand.map((brand, i) => (
            <Table.Row key={i} style={{ height: '34px' }}>
              <Table.Cell
                style={{ heigth: '30px', padding: '5px 0px 0px 12px' }}
              >
                {brand.brandId ? brand.brand.name : null}
              </Table.Cell>
              <Table.Cell
                style={{ heigth: '30px', padding: '5px 0px 0px 12px' }}
              >
                {brand.brandId ? (
                  <>
                    {brand.porcentaje >= 0 ? (
                      <Label color="red" horizontal>
                        Recargo
                      </Label>
                    ) : (
                      <Label color="green" horizontal>
                        Descuento
                      </Label>
                    )}
                  </>
                ) : null}
              </Table.Cell>
              <Table.Cell
                style={{ heigth: '30px', padding: '5px 0px 0px 12px' }}
              >
                {brand.brandId ? (
                  <Popup
                    style={{
                      padding: '5px',
                      border: '2px solid #B6B6B6',
                    }}
                    content={brand.notas}
                    trigger={<span>{`${brand.porcentaje * 100} %`}</span>}
                  />
                ) : null}
              </Table.Cell>
              <Table.Cell
                style={{ heigth: '30px', padding: '5px 0px 0px 12px' }}
              >
                {brand.brandId ? (
                  <button
                    className={styles.butonStyle}
                    onClick={() => {
                      delFn(brand.brandId, brand.clientId);
                    }}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                ) : null}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default TableComponent;
