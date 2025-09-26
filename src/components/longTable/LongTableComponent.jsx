import React from 'react';
import styles from './longTable.module.css';
import ActionModalContainer from '../../containers/ActionModalContainer';
import CustomPopup from '../../commonds/popup/CustomPopup';
import { Label, Popup } from 'semantic-ui-react';
import {
  dateConverter,
  formatNumberWithLeadingZeros,
  redondearADosDecimales,
} from '../../utils';
import CustomModal from '../../commonds/customModal/CustomModal';
import ConfirmSellOrderContainer from '../../containers/ConfirmSellOrderContainer';
import EditBrandContainer from '../../containers/EditBrandContainer';
import AddSupplierToBrandContainer from '../../containers/AddSupplierToBrandContainer';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';

function LongTableComponent(props) {
  const {
    data,
    colum,
    type,
    setBuyOrder,
    deleteOrder,
    reception,
    cancelOrder,
    buyOrderSelect,
    printBill,
  } = props;

  const list = data.orderAjust
    ? data.orderAjust.ajustOrderItems
    : data.purchaseOrderItems;

  return (
    <div className={styles.container}>
      <table className={`table ${styles.table}`}>
        <thead>
          <tr>
            {colum.map((obj, i) => (
              <th id={styles.title} key={i} scope="col" style={colum.ancho}>
                {obj.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {type == 'product'
            ? data.map((obj) =>
                obj.brandProducts.map((brand, i) => {
                  return (
                    <tr key={i}>
                      <td>{obj.article.toUpperCase()}</td>
                      <td>
                        <CustomPopup content={obj.description.toUpperCase()} />
                      </td>
                      <td>{brand.brand.name.toUpperCase()}</td>
                      <td>{`$ ${redondearADosDecimales(
                        obj.brandProducts[i].price.price
                      )}`}</td>
                      <td>{`$ ${redondearADosDecimales(
                        obj.brandProducts[i].price.price *
                          (1 + obj.brandProducts[i].price.sellPercentage)
                      )}`}</td>
                      <td>
                        {`$ ${redondearADosDecimales(
                          1.21 *
                            obj.brandProducts[i].price.price *
                            (1 + obj.brandProducts[i].price.sellPercentage)
                        )}`}
                      </td>
                      <td>{brand.stock.stock}</td>
                      <td>{obj.brandProducts[i].location}</td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            width: '130px',
                          }}
                        >
                          <ActionModalContainer
                            type="infoProduct"
                            icon="fa-regular fa-images"
                            size="lg"
                            popupText="Ver imagenes"
                          />
                          <div
                            style={{
                              margin: '0px 0px 0px 8px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {/* <ActionModalContainer
                              type="add"
                              size="lg"
                              title="Ordenes abiertas"
                              icon="fa-solid fa-arrow-right-from-bracket"
                              iconColor="iconStyleGreen"
                            /> */}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )
            : null}
          {type == 'brand'
            ? data.map((obj) =>
                obj.brandSuppliers.map((bs, i) => (
                  <tr key={i}>
                    <td>{obj.code.toUpperCase()}</td>
                    <td>{obj.name.toUpperCase()}</td>
                    <td>{bs.supplier.razonSocial.toUpperCase()}</td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        <CustomModal
                          title="Editar marca"
                          size="sm"
                          actionButton={
                            <button
                              style={{ margin: '1px 0px 0px 7px' }}
                              className={styles.iconButton}
                              type="button"
                            >
                              <i
                                className={`fa-regular fa-pen-to-square ${styles.blueIcon} ${styles.customModalIcon}`}
                              ></i>
                            </button>
                          }
                          bodyModal={(props) => (
                            <EditBrandContainer {...props} />
                          )}
                          bodyProps={{ brand: obj }}
                        />
                        <CustomModal
                          title="Editar proveedores"
                          size="lg"
                          actionButton={
                            <button
                              style={{ margin: '1px 0px 0px 7px' }}
                              className={styles.iconButton}
                              type="button"
                            >
                              <i
                                className={`fa-solid fa-user-plus ${styles.blueIcon} ${styles.customModalIcon}`}
                              ></i>
                            </button>
                          }
                          bodyModal={(props) => (
                            <AddSupplierToBrandContainer {...props} />
                          )}
                          bodyProps={{ brand: obj }}
                        />
                        {/* <ActionModalContainer
                          type="brand"
                          size="lg"
                          title="Proveedores"
                          icon="fa-solid fa-user-plus"
                          data={obj}
                          popupText="Editar proveedores"
                        /> */}
                      </div>
                    </td>
                  </tr>
                ))
              )
            : null}
          {type == 'Buy'
            ? data.map((obj, i) => (
                <tr key={i}>
                  <td>{dateConverter(obj.date)}</td>
                  <td>{obj.numero}</td>
                  <td>
                    {obj.supplier && obj.supplier.razonSocial.toUpperCase()}
                  </td>
                  <td>
                    <ProtectedComponent listAccesss={[1, 2, 5]}>{`$ ${
                      obj.status === 'Ajusted'
                        ? redondearADosDecimales(obj.orderAjust.subTotal)
                        : redondearADosDecimales(obj.subTotal)
                    }`}</ProtectedComponent>
                  </td>
                  <td>
                    <ProtectedComponent listAccesss={[1, 2, 5]}>{`$ ${
                      obj.status === 'Ajusted'
                        ? redondearADosDecimales(obj.orderAjust.subTotal * 1.21)
                        : redondearADosDecimales(obj.subTotal * 1.21)
                    }`}</ProtectedComponent>
                  </td>
                  <td style={{ padding: '2px' }}>
                    {obj.status == 'Open' ? (
                      <Label
                        color="yellow"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Abierta
                      </Label>
                    ) : null}
                    {obj.status == 'Confirm' ? (
                      <Label
                        color="green"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Confirmada
                      </Label>
                    ) : null}
                    {obj.status == 'Ajusted' ? (
                      <Label
                        color="teal"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Ajustada
                      </Label>
                    ) : null}
                    {obj.status == 'Cancel' ? (
                      <Label
                        color="red"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Cancelada
                      </Label>
                    ) : null}
                    {obj.status == 'Recived' ? (
                      <Label
                        color="blue"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Recibido
                      </Label>
                    ) : null}
                  </td>
                  {/* <td>
                    {obj.vouchers.length > 0
                      ? obj.vouchers[0].numComprobante
                      : null}
                  </td> */}
                  <td>
                    {obj.controlOrder
                      ? formatNumberWithLeadingZeros(obj.controlOrder.id, 6)
                      : null}
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <div style={{ marginTop: '2px' }}>
                        <ActionModalContainer
                          size="xl"
                          selectedId={obj.id}
                          data={buyOrderSelect.buyOrderSelected}
                          title="Información de orden"
                          type="viewOrder"
                          icon="fa-solid fa-circle-info fa-lg"
                          buyOrderSelect={buyOrderSelect}
                          popupText="Detalle de orden"
                        />
                      </div>
                      <Popup
                        trigger={
                          <button
                            style={{ margin: '1px 0px 0px 7px' }}
                            className={styles.iconButton}
                            disabled={obj.status == 'Open' ? false : true}
                            onClick={() => {
                              setBuyOrder(obj.id);
                            }}
                            type="button"
                          >
                            <i
                              className={`fa-regular fa-pen-to-square fa-lg ${
                                obj.status == 'Open'
                                  ? styles.blueIcon
                                  : styles.greyIcon
                              }`}
                            ></i>
                          </button>
                        }
                        content="Editar"
                      />
                      <Popup
                        trigger={
                          <button
                            style={{ margin: '1px 0px 0px 7px' }}
                            className={styles.iconButton}
                            disabled={
                              obj.status == 'Open' ||
                              obj.status == 'Confirm' ||
                              obj.status == 'Ajusted'
                                ? false
                                : true
                            }
                            onClick={() => {
                              if (obj.status == 'Open') {
                                deleteOrder(obj.id);
                              } else {
                                cancelOrder(obj.id);
                              }
                            }}
                            type="button"
                          >
                            <i
                              className={`fa-solid fa-xmark fa-xl ${
                                obj.status == 'Open' ||
                                obj.status == 'Confirm' ||
                                obj.status == 'Ajusted'
                                  ? styles.redIcon
                                  : styles.greyIcon
                              }`}
                            ></i>
                          </button>
                        }
                        content="Eliminar"
                      />
                      <Popup
                        trigger={
                          <button
                            style={{ margin: '1px 0px 0px 7px' }}
                            className={styles.iconButton}
                            disabled={
                              obj.status == 'Confirm' || obj.status == 'Ajusted'
                                ? false
                                : true
                            }
                            onClick={() => {
                              reception(obj.id);
                            }}
                            type="button"
                          >
                            <i
                              className={`fa-regular fa-circle-check fa-lg ${
                                obj.status == 'Confirm' ||
                                obj.status == 'Ajusted'
                                  ? styles.blueIcon
                                  : styles.greyIcon
                              }`}
                            ></i>
                          </button>
                        }
                        content="Confirmar"
                      />
                    </div>
                  </td>
                </tr>
              ))
            : null}

          {type == 'Sell'
            ? data.map((obj, i) => (
                <tr key={i}>
                  <td>{dateConverter(obj.date)}</td>
                  <td>{obj.numero}</td>
                  <td>
                    {obj.client && (
                      <CustomPopup
                        content={obj.client.razonSocial.toUpperCase()}
                      />
                    )}
                  </td>
                  <td>{`$ ${redondearADosDecimales(obj.subTotal)}`}</td>
                  <td>{`$ ${redondearADosDecimales(obj.subTotal * 1.21)}`}</td>
                  <td style={{ padding: '2px' }}>
                    {obj.status == 'Open' ? (
                      <Label
                        color="yellow"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Abierta
                      </Label>
                    ) : null}
                    {obj.status == 'Confirm' ? (
                      <Label
                        color="green"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Confirmada
                      </Label>
                    ) : null}
                    {obj.status == 'Ajusted' ? (
                      <Label
                        color="teal"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Ajustada
                      </Label>
                    ) : null}
                    {obj.status == 'Cancel' ? (
                      <Label
                        color="red"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Cancelada
                      </Label>
                    ) : null}
                    {obj.status == 'Recived' ? (
                      <Label
                        color="blue"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Recibido
                      </Label>
                    ) : null}
                    {obj.status == 'Sent' ? (
                      <Label
                        color="teal"
                        style={{
                          width: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Facturado
                      </Label>
                    ) : null}
                  </td>
                  {/* <td>OP-00014</td> */}
                  <td>
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <div style={{ marginTop: '2px' }}>
                        <ActionModalContainer
                          size="xl"
                          selectedId={obj.id}
                          data={buyOrderSelect.buyOrderSelected}
                          title="Información de orden"
                          type="viewOrder"
                          icon="fa-solid fa-circle-info fa-lg"
                          buyOrderSelect={buyOrderSelect}
                          popupText="Detalle de orden"
                          printBill={printBill}
                        />
                      </div>
                      <Popup
                        trigger={
                          <button
                            style={{ margin: '1px 0px 0px 7px' }}
                            className={styles.iconButton}
                            disabled={
                              obj.status == 'Open' || obj.status == 'Confirm'
                                ? false
                                : true
                            }
                            onClick={() => {
                              setBuyOrder(obj.id, obj.clientId);
                            }}
                            type="button"
                          >
                            <i
                              className={`fa-regular fa-pen-to-square fa-lg ${
                                obj.status == 'Open' || obj.status == 'Confirm'
                                  ? styles.blueIcon
                                  : styles.greyIcon
                              }`}
                            ></i>
                          </button>
                        }
                        content="Editar"
                      />
                      <ProtectedComponent listAccesss={[1, 2]}>
                        <Popup
                          trigger={
                            <button
                              style={{ margin: '1px 0px 0px 7px' }}
                              className={styles.iconButton}
                              disabled={obj.status == 'Open' ? false : true}
                              onClick={() => {
                                if (obj.status == 'Open') {
                                  deleteOrder(obj.id);
                                } else {
                                  cancelOrder(obj.id);
                                }
                              }}
                              type="button"
                            >
                              <i
                                className={`fa-solid fa-xmark fa-xl ${
                                  obj.status == 'Open'
                                    ? styles.redIcon
                                    : styles.greyIcon
                                }`}
                              ></i>
                            </button>
                          }
                          content="Cancelar"
                        />
                      </ProtectedComponent>
                      {/* <CustomModal
                        title={`Confirmar orden ${obj.numero}`}
                        size="lg"
                        actionButton={
                          <button
                            style={{ margin: "1px 0px 0px 7px" }}
                            className={styles.iconButton}
                            disabled={obj.status == "Confirm" ? false : true}
                            type="button"
                          >
                            <i
                              className={`fa-regular fa-circle-check fa-lg ${
                                obj.status == "Confirm"
                                  ? styles.greenIcon
                                  : styles.greyIcon
                              }`}
                            ></i>
                          </button>
                        }
                        bodyModal={(props) => (
                          <ConfirmSellOrderContainer {...props} />
                        )}
                        bodyProps={{ order: obj }}
                      /> */}
                    </div>
                  </td>
                </tr>
              ))
            : null}
          {type == 'orderItems' ? (
            list.map((obj, i) => (
              <tr key={i}>
                <td>{obj.product.brand.name.toUpperCase()}</td>
                <td>{obj.product.article.toUpperCase()}</td>
                <td>
                  <CustomPopup
                    content={obj.product.description.toUpperCase()}
                  />
                </td>
                <td>{obj.amount}</td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LongTableComponent;
