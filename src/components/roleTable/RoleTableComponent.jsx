import React, { useMemo, useState } from 'react';
import styles from './roleTable.module.css';
import ActionModalContainer from '../../containers/ActionModalContainer';
import { Checkbox, Label } from 'semantic-ui-react';
import IconButonUsersTable from '../../commonds/iconButtonUsersTable/IconButonUsersTable';
import Button from 'react-bootstrap/Button';
import { Table } from 'semantic-ui-react';
import CustomPagination from '../../commonds/pagination/CustomPagination';
import {
  buyOrderString,
  checkActive,
  controlOrderString,
  convertirFechaISOaDDMMYYYYHHMM,
  dateConverter,
  dateConverterWHour,
  getBillType,
  numberToString,
  pickingOrderString,
  redondearADosDecimales,
  selectStylesByDateClient,
} from '../../utils';
import CustomModal from '../../commonds/customModal/CustomModal';
import { useNavigate } from 'react-router';
import { MovTypeEnum } from '../../enum/MovEnum';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import BillViewModalContainer from '../../containers/BillViewModalContainer';
import { Spinner } from 'react-bootstrap';

function RoleTableComponent(props) {
  const {
    colum,
    type,
    statusToogle,
    viewAcount,
    result,
    printFn,
    redirectEditPercents,
    updatePicking,
    changePageFn,
    checked,
    marcToggle,
    handleChangeCantNC,
    omitPaginator,
    rePrint,
    printLoading,
    ncRePrint,
    clientsResumePrint,
    slim,
  } = props;

  const navigate = useNavigate();
  return (
    <div className={!slim ? styles.container : styles.containerSlim}>
      <Table className={`table ${styles.table}`} color="teal">
        <Table.Header>
          <Table.Row>
            {colum.map((col, i) => (
              <Table.HeaderCell
                style={{ width: `${col.width}` }}
                id={styles.title}
                key={i}
                scope="col"
              >
                {col.title}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {type == 'seller' ? (
            result.data.sellers.map((obj, i) => (
              <Table.Row key={i}>
                <Table.Cell
                  style={{ padding: '0px 10px', verticalAlign: 'middle' }}
                >
                  {obj.user.name.toUpperCase()}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '0px 10px', verticalAlign: 'middle' }}
                >
                  {obj.user.lastName.toUpperCase()}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '0px 10px', verticalAlign: 'middle' }}
                >
                  <span
                    className={styles.linkSpan}
                    onClick={() => navigate(`/seller/acount/${obj.id}`)}
                  >
                    {obj.cuil}
                  </span>
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '0px 10px', verticalAlign: 'middle' }}
                >
                  {obj.user.id}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '0px 10px', verticalAlign: 'middle' }}
                >
                  {obj.user.id != '' ? (
                    <>
                      {obj.user.status ? (
                        <Label color="green" horizontal>
                          Activo
                        </Label>
                      ) : (
                        <Label color="red" horizontal>
                          Inactivo
                        </Label>
                      )}
                    </>
                  ) : null}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.user.id != '' ? (
                    <div>
                      <ProtectedComponent listAccesss={[1, 2]}>
                        <div
                          style={{
                            display: 'flex',
                            width: '130px',
                          }}
                        >
                          <ActionModalContainer
                            size="xl"
                            data={obj}
                            title="Información de vendedor"
                            type="updateSeller"
                            icon="fa-regular fa-pen-to-square"
                            popupText="Editar"
                          />
                          <div
                            style={{
                              margin: '1px 0px 0px 8px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <IconButonUsersTable
                              popupText="Resumen de clientes"
                              fn={() => {
                                clientsResumePrint(obj.id);
                              }}
                              icon="fa-regular fa-file"
                              iconInitialStyle="iconStyleTeal"
                            />
                          </div>
                          <div
                            style={{
                              margin: '1px 0px 0px 8px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <IconButonUsersTable
                              popupText="Ver clientes"
                              fn={() => {
                                navigate(`/search/client/${obj.id}`);
                              }}
                              icon="fa-solid fa-people-group"
                              iconInitialStyle="iconStyleYellow"
                            />
                          </div>
                          <div
                            style={{
                              margin: '1px 0px 0px 8px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <IconButonUsersTable
                              popupText="Desactivar"
                              fn={() => {
                                statusToogle(obj.user.id, 'seller');
                              }}
                              icon={
                                !obj.user.status
                                  ? 'fa-solid fa-check'
                                  : 'fa-solid fa-xmark'
                              }
                              iconInitialStyle={
                                !obj.user.status
                                  ? 'iconStyleGreen'
                                  : 'iconStyleRed'
                              }
                            />
                          </div>
                        </div>
                      </ProtectedComponent>
                      <ProtectedComponent listAccesss={[5]}>
                        <IconButonUsersTable
                          popupText="Resumen de clientes"
                          fn={() => {
                            clientsResumePrint(obj.id);
                          }}
                          icon="fa-regular fa-file"
                          iconInitialStyle="iconStyleTeal"
                        />
                      </ProtectedComponent>
                    </div>
                  ) : (
                    <div style={{ height: '21px' }}></div>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <></>
          )}
          {type == 'client' ? (
            result?.data?.clients?.map((obj, i) => (
              <Table.Row key={i}>
                <Table.Cell
                  style={{
                    padding: '0px 10px',
                    verticalAlign: 'middle',
                    backgroundColor: selectStylesByDateClient(
                      obj.currentAcount.movements.find((m) => m.type == 0)
                        ?.fecha
                    ),
                  }}
                >
                  {obj.id}
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: '0px 10px',
                    verticalAlign: 'middle',
                    backgroundColor: selectStylesByDateClient(
                      obj.currentAcount.movements.find((m) => m.type == 0)
                        ?.fecha
                    ),
                  }}
                >
                  {obj.razonSocial ? obj.razonSocial.toUpperCase() : null}
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: '0px 10px',
                    verticalAlign: 'middle',
                    backgroundColor: selectStylesByDateClient(
                      obj.currentAcount.movements.find((m) => m.type == 0)
                        ?.fecha
                    ),
                  }}
                >
                  {obj.cuit ? obj.cuit.toUpperCase() : null}
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: '0px 10px',
                    verticalAlign: 'middle',
                    backgroundColor: selectStylesByDateClient(
                      obj.currentAcount.movements.find((m) => m.type == 0)
                        ?.fecha
                    ),
                  }}
                >
                  <Button
                    variant="link"
                    style={{ padding: '0', textDecoration: 'none' }}
                    onClick={() => {
                      viewAcount(obj.currentAcount.id, 'client');
                    }}
                  >
                    {obj?.currentAcount?.acountNumber &&
                      obj?.currentAcount?.acountNumber}
                  </Button>
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: '0px 10px',
                    verticalAlign: 'middle',
                    backgroundColor: selectStylesByDateClient(
                      obj.currentAcount.movements.find((m) => m.type == 0)
                        ?.fecha
                    ),
                  }}
                >
                  {obj?.currentAcount?.acountNumber != ''
                    ? `$ ${numberToString(obj?.currentAcount?.resume)}`
                    : ''}
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: '0px 10px',
                    verticalAlign: 'middle',
                    backgroundColor: selectStylesByDateClient(
                      obj.currentAcount.movements.find((m) => m.type == 0)
                        ?.fecha
                    ),
                  }}
                >
                  {obj?.currentAcount?.acountNumber != '' ? (
                    <div>
                      {obj?.user?.status ? (
                        <Label color="green" horizontal>
                          Activo
                        </Label>
                      ) : (
                        <Label color="red" horizontal>
                          Inactivo
                        </Label>
                      )}
                    </div>
                  ) : null}
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: '6px 10px',
                    verticalAlign: 'middle',
                    backgroundColor: selectStylesByDateClient(
                      obj.currentAcount.movements.find((m) => m.type == 0)
                        ?.fecha
                    ),
                  }}
                >
                  {obj?.currentAcount?.acountNumber != '' ? (
                    <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
                      <div
                        style={{
                          display: 'flex',
                          width: '130px',
                        }}
                      >
                        <ActionModalContainer
                          size="xl"
                          data={obj}
                          title="Información del cliente"
                          type="updateClient"
                          icon="fa-regular fa-pen-to-square"
                          popupText="Editar"
                        />
                        <div
                          style={{
                            margin: '1px 0px 0px 8px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <IconButonUsersTable
                            popupText="Descuentos"
                            fn={() => {
                              redirectEditPercents(obj.id);
                            }}
                            icon="fa-solid fa-tags"
                            iconInitialStyle="iconStyleYellow"
                          />
                        </div>
                        <div
                          style={{
                            margin: '1px 0px 0px 8px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ProtectedComponent listAccesss={[1, 2]}>
                            <IconButonUsersTable
                              popupText="Desactivar"
                              fn={() => {
                                statusToogle(obj.user.id, 'client');
                              }}
                              icon={
                                !obj.user.status
                                  ? 'fa-solid fa-check'
                                  : 'fa-solid fa-xmark'
                              }
                              iconInitialStyle={
                                !obj.user.status
                                  ? 'iconStyleGreen'
                                  : 'iconStyleRed'
                              }
                            />
                          </ProtectedComponent>
                        </div>
                      </div>
                    </ProtectedComponent>
                  ) : (
                    <div style={{ height: '21px' }}></div>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <></>
          )}
          {type == 'supplier' ? (
            result.data.suppliers.map((obj, i) => (
              <Table.Row key={i}>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.id}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.razonSocial.toUpperCase()}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {
                    <ProtectedComponent listAccesss={[1, 2]}>
                      {obj.cuit}
                    </ProtectedComponent>
                  }
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  <Button
                    variant="link"
                    style={{ padding: '0', textDecoration: 'none' }}
                    onClick={() => {
                      viewAcount(obj.currentAcount.id, 'supplier');
                    }}
                  >
                    {obj.currentAcount.acountNumber}
                  </Button>
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.id !== '' ? (
                    <ProtectedComponent
                      listAccesss={[1, 2]}
                    >{`$ ${obj.currentAcount.resume}`}</ProtectedComponent>
                  ) : (
                    ''
                  )}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.id !== '' ? (
                    <>
                      {obj.status ? (
                        <Label color="green" horizontal>
                          Activo
                        </Label>
                      ) : (
                        <Label color="red" horizontal>
                          Inactivo
                        </Label>
                      )}
                    </>
                  ) : null}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.id !== '' ? (
                    <ProtectedComponent listAccesss={[1, 2]}>
                      <div
                        style={{
                          display: 'flex',
                          width: '130px',
                        }}
                      >
                        <ActionModalContainer
                          title="Información del proveedor"
                          size="xl"
                          data={obj}
                          type="updateSupplier"
                          icon="fa-regular fa-pen-to-square"
                          popupText="Ver proveedor"
                        />
                        <div
                          style={{
                            margin: '0px 0px 0px 8px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ActionModalContainer
                            size="lg"
                            data={obj}
                            title="Agregar representante"
                            type="updateRepresSupplier"
                            icon="fa-regular fa-address-book"
                            popupText="Agregar representantes"
                          />
                        </div>
                        <div
                          style={{
                            margin: '1px 0px 0px 8px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <IconButonUsersTable
                            popupText="Desactivar"
                            fn={() => {
                              statusToogle(obj.id, 'supplier');
                            }}
                            icon={
                              !obj.status
                                ? 'fa-solid fa-check'
                                : 'fa-solid fa-xmark'
                            }
                            iconInitialStyle={
                              !obj.status ? 'iconStyleGreen' : 'iconStyleRed'
                            }
                          />
                        </div>
                      </div>
                    </ProtectedComponent>
                  ) : (
                    <div style={{ height: '21px' }}></div>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <></>
          )}
          {type == 'repSupplier' ? (
            result.data.list.map((rep, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  {`${rep.name.toUpperCase()} ${rep.apellido.toUpperCase()}`.slice(
                    0,
                    20
                  )}
                </Table.Cell>
                <Table.Cell>{obj.razonSocial.toUpperCase()}</Table.Cell>
                <Table.Cell>{rep.email.toUpperCase()}</Table.Cell>
                <Table.Cell>{rep.telefono}</Table.Cell>
                <Table.Cell>
                  {rep.status ? (
                    <Label color="green" horizontal>
                      Activo
                    </Label>
                  ) : (
                    <Label color="red" horizontal>
                      Inactivo
                    </Label>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      display: 'flex',
                      width: '130px',
                    }}
                  >
                    <div
                      style={{
                        margin: '0px 0px 0px 8px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ActionModalContainer
                        popupText="Editar"
                        repindex={i}
                        size="lg"
                        data={obj}
                        title="Modificar representante"
                        type="updateRepresSupplier"
                        icon="fa-regular fa-address-book"
                      />
                    </div>
                    <div
                      style={{
                        margin: '1px 0px 0px 8px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <IconButonUsersTable
                        popupText="Eliminar"
                        fn={() => {
                          statusToogle(rep.id, 'repSupplier');
                        }}
                        icon={
                          !rep.status
                            ? 'fa-solid fa-check'
                            : 'fa-solid fa-xmark'
                        }
                        iconInitialStyle={
                          !rep.status ? 'iconStyleGreen' : 'iconStyleRed'
                        }
                      />
                    </div>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <></>
          )}
          {type == 'acount' ? (
            result.data.movements.list.map((obj, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  <Checkbox
                    disabled={checkActive(obj)}
                    checked={obj.marc}
                    onChange={() => {
                      checked(obj);
                    }}
                  />
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {dateConverterWHour(obj.fecha)}
                </Table.Cell>
                {/* <Table.Cell
                  style={{ padding: "6px 10px", verticalAlign: "middle" }}
                >
                  {obj.purchaseOrder ? obj.purchaseOrder.numero : "No definido"}
                </Table.Cell> */}
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {getBillType(MovTypeEnum[obj.type], obj.billType)}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {getBillType(MovTypeEnum[obj.type], obj.billType) != 'Pago' &&
                  getBillType(MovTypeEnum[obj.type], obj.billType) !=
                    'Descuento'
                    ? obj.numComprobante
                    : '-'}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {getBillType(MovTypeEnum[obj.type], obj.billType) == 'Pago' ||
                  getBillType(MovTypeEnum[obj.type], obj.billType) ==
                    'Nota de crédito' ||
                  getBillType(MovTypeEnum[obj.type], obj.billType) ==
                    'Devolución'
                    ? obj.bills.map((b, i) => {
                        if (i > 0) {
                          return `-${b.numComprobante}`;
                        }
                        return b.numComprobante;
                      })
                    : '-'}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.payDetail?.id}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.payDetail?.comprobanteVendedor}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {
                    <span
                      style={{ color: `${obj.type ? 'green' : 'red'}` }}
                    >{`$ ${redondearADosDecimales(obj.total)}`}</span>
                  }
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj ? (
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                      }}
                    >
                      <CustomModal
                        title={`Comprobante N° ${obj.numComprobante}`}
                        size="xl"
                        actionButton={
                          <button
                            style={{ margin: '1px 0px 0px 7px' }}
                            className={styles.iconButton}
                            type="button"
                          >
                            <i
                              className={`fa-solid fa-circle-info ${styles.blueIcon}`}
                            ></i>
                          </button>
                        }
                        bodyModal={(props) => (
                          <BillViewModalContainer {...props} />
                        )}
                        bodyProps={{ movId: obj.id }}
                      />
                      <button
                        style={{ margin: '1px 0px 0px 7px' }}
                        className={styles.iconButton}
                        type="button"
                        onClick={() => {
                          // console.log(obj);
                          if (
                            obj.billType == 2 ||
                            obj.billType == 3 ||
                            obj.billType == 8
                          ) {
                            ncRePrint(obj);
                          }
                          if (
                            obj.billType == 0 ||
                            obj.billType == 1 ||
                            obj.billType == 6
                          ) {
                            rePrint(obj);
                          }
                        }}
                      >
                        {printLoading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <i
                            className={`fa-solid fa-print ${styles.greenIcon}`}
                          ></i>
                        )}
                      </button>
                    </div>
                  ) : null}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <></>
          )}
          {type == 'controlOrder' ? (
            result.data.controlOrders.map((obj, i) => (
              <Table.Row key={i}>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {dateConverter(obj.createdAt)}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {controlOrderString(obj.id)}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {/* {`N° ${obj.numRemito}`} */}-
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {buyOrderString(obj.purchaseOrderId)}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.status !== 'NoControlado' ? (
                    <Label color="green" horizontal>
                      Controlado
                    </Label>
                  ) : (
                    <Label color="orange" horizontal>
                      Controlar
                    </Label>
                  )}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.status !== 'NoControlado'
                    ? dateConverter(obj.updatedAt)
                    : ''}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: '130px',
                    }}
                  >
                    <div
                      style={{
                        margin: '1px 0px 0px 8px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <IconButonUsersTable
                        popupText="Imprimir"
                        fn={async () => {
                          await printFn(obj.id);
                        }}
                        icon={'fa-solid fa-print'}
                        iconInitialStyle={'iconStyleBlue'}
                      />
                    </div>
                    {obj.status == 'NoControlado' ? (
                      <div
                        style={{
                          margin: '1px 0px 0px 8px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <ActionModalContainer
                          popupText="Confirmar"
                          repindex={i}
                          size="lg"
                          data={{ id: obj.id }}
                          title="Alta stock"
                          type="stockValidate"
                          icon="fa-solid fa-clipboard-check"
                        />
                      </div>
                    ) : null}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <></>
          )}
          {type == 'pickingOrder' ? (
            result.data.pickingOrders.map((obj, i) => (
              <Table.Row key={i}>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {convertirFechaISOaDDMMYYYYHHMM(obj.createdAt)}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {pickingOrderString(obj.id)}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {!obj.numRemito ? '' : `N° ${obj.numRemito}`}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {buyOrderString(obj.purchaseOrderId)}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.status ? (
                    <Label color="green" horizontal>
                      Preparado
                    </Label>
                  ) : (
                    <>
                      {obj.print ? (
                        <Label color="orange" horizontal>
                          Pendiente
                        </Label>
                      ) : (
                        <Label color="red" horizontal>
                          Recibido
                        </Label>
                      )}
                    </>
                  )}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj.status ? dateConverter(obj.updatedAt) : ''}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: '130px',
                    }}
                  >
                    <div
                      style={{
                        margin: '1px 0px 0px 8px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <IconButonUsersTable
                        disabled={obj.status}
                        popupText="Imprimir"
                        fn={async () => {
                          await printFn(obj.id);
                        }}
                        icon={'fa-solid fa-print'}
                        iconInitialStyle={
                          obj.status ? 'iconStyleGrey' : 'iconStyleBlue'
                        }
                      />
                    </div>
                    {!obj.status ? (
                      <div
                        style={{
                          margin: '1px 0px 0px 8px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <IconButonUsersTable
                          popupText="Confirmar"
                          fn={() => {
                            updatePicking(obj.id);
                          }}
                          icon={'fa-solid fa-clipboard-check'}
                          iconInitialStyle={'iconStyleGreen'}
                        />
                      </div>
                    ) : null}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <></>
          )}
          {type == 'sellerAcount' ? (
            result?.registros?.map((obj, i) => (
              <Table.Row key={i}>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {dateConverter(obj?.fecha)}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj ? obj?.concepto : 'No definido'}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {obj?.cliente}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {`${
                    obj?.concepto.substring(0, 2) == 'NC' ? '-' : ''
                  }$${redondearADosDecimales(obj?.monto)}`}
                </Table.Cell>
                <Table.Cell
                  style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                >
                  {`${
                    obj?.concepto.substring(0, 2) == 'NC' ? '-' : ''
                  }$${redondearADosDecimales(obj?.comision)}`}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <></>
          )}
          {type == 'noApply' ? (
            result?.map((obj, i) => {
              return (
                <Table.Row key={i}>
                  <Table.Cell
                    style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                  >
                    <Checkbox
                      checked={obj.marc}
                      onClick={() => {
                        marcToggle(obj.id);
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell
                    style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                  >
                    {dateConverter(obj?.fecha)}
                  </Table.Cell>
                  <Table.Cell
                    style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                  >
                    {obj?.numComprobante}
                  </Table.Cell>
                  <Table.Cell
                    style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                  >
                    ${obj?.total}
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <></>
          )}
          {type == 'ncMod' ? (
            result?.map((obj, i) => {
              return (
                <Table.Row key={i}>
                  <Table.Cell
                    style={{ padding: '6px 10px', verticalAlign: 'middle' }}
                  >
                    <Checkbox
                      checked={obj.marc}
                      onClick={() => {
                        marcToggle(obj.id);
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      padding: '6px 10px',
                      verticalAlign: 'middle',
                      fontSize: '12px',
                    }}
                  >
                    {obj.product.brand.name}
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      padding: '6px 10px',
                      verticalAlign: 'middle',
                      fontSize: '12px',
                    }}
                  >
                    {obj.product.article}
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      padding: '6px 10px',
                      verticalAlign: 'middle',
                      fontSize: '10px',
                    }}
                  >
                    {obj.product.description.substring(0, 68)}
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      padding: '6px 10px',
                      verticalAlign: 'middle',
                      fontSize: '12px',
                    }}
                  >
                    ${redondearADosDecimales(obj.sellPrice)}
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      padding: '6px 10px',
                      verticalAlign: 'middle',
                      fontSize: '12px',
                    }}
                  >
                    <input
                      disabled={!obj.marc}
                      step="1"
                      min={1}
                      max={obj.max}
                      value={obj.amount}
                      type="number"
                      style={{ width: '48px' }}
                      onChange={(e) => {
                        handleChangeCantNC(e, obj.id);
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <></>
          )}
        </Table.Body>
      </Table>
      {type != 'sellerAcount' && type != 'ncMod' && type != 'noApply' ? (
        <div className={styles.pagContainer}>
          <span className={styles.resultSpan}>{`Se encontraron ${
            type != 'acount'
              ? result.data.totalRows
              : result.data.movements.totalRows
          } registros relacionados a la búsqueda.`}</span>
          {omitPaginator ? null : (
            <CustomPagination
              changeFn={
                changePageFn
                  ? changePageFn
                  : () => {
                      console.log('no llega la fn...');
                    }
              }
              initPage={1}
              pages={
                type != 'acount'
                  ? result.data.totalPages
                  : result.data.movements.totalPages
              }
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default RoleTableComponent;
