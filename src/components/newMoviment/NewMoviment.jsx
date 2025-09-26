import React, { useCallback, useState } from 'react';
import styles from './newMoviment.module.css';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../commonds/input/CustomInput';
import { default as EditInput } from '../../commonds/putInput/CustomInput';
import CustomSelect from '../../commonds/select/CustomSelect';
import Button from 'react-bootstrap/esm/Button';
import {
  compareNCListFactList,
  filterOrders,
  numberToString,
} from '../../utils';
import { Checkbox, Divider } from 'semantic-ui-react';
import RoleTableContainer from '../../containers/RoleTableContainer';
import { Spinner } from 'react-bootstrap';
import { DatePicker } from 'antd';

function NewMoviment(props) {
  const {
    methods,
    onSubmit,
    listMov,
    checked,
    setChecked,
    listNcNoApply,
    payMethod,
    marcToggle,
    cancelFactFn,
    inactive,
    changePayMethod,
    payChDate,
    setPayChDate,
    cantTransf,
    setCantTransf,
    parcial,
    setParcial,
    max,
  } = props;

  // const loading = useSelector((state) => state.searchOrders).loading;
  const [applyNc, setApplyNc] = useState(false);
  const [movType, setMovType] = useState(null);
  const handleMovSelect = (e) => {
    setMovType(e);
    if (e == 2) {
      setApplyNc(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.infoContainer}>
        <i class="fa-regular fa-folder-open"></i>
        <span style={{ marginLeft: '5px' }}>Facturas afectadas:</span>
        <div style={{ display: 'inline-block' }}>
          {listMov.map((m, i) => (
            <span className={styles.label} key={i}>
              {m.numComprobante}
            </span>
          ))}
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <i class="fa-solid fa-file-invoice"></i>
            <span style={{ marginLeft: '5px' }}>Saldo máximo: ${max()}</span>
          </div>
        </div>
      </div>
      <FormProvider {...methods} className={styles.provider}>
        <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
          <span>Tipo de movimiento</span>
          <CustomSelect
            text="Seleccionar tipo de movimiento"
            name="mov"
            validate={{ required: true }}
            arrayOptions={[
              { value: 1, text: 'Pago' },
              { value: 2, text: 'Cancelación' },
            ]}
            fnSelect={handleMovSelect}
          />
          {movType == 1 ? (
            <>
              <span>Medio de pago</span>
              <div className={styles.checkCont}>
                {parcial ? (
                  <Checkbox
                    label="Efectivo"
                    checked={payMethod.efectivo}
                    onChange={() => {
                      changePayMethod('efectivo');
                    }}
                  />
                ) : null}
                <Checkbox
                  label="Cheque"
                  checked={payMethod.cheque}
                  onChange={() => {
                    changePayMethod('cheque');
                  }}
                />
                <Checkbox
                  label="Transferencia"
                  checked={payMethod.transferencia}
                  onChange={() => {
                    changePayMethod('transferencia');
                  }}
                />
                <div className={styles.seisCont}>
                  <Checkbox
                    label="Aplicar -6% por pago en término"
                    onClick={() => setChecked(!checked)}
                    checked={checked}
                  />
                </div>
                <div>
                  <Checkbox
                    style={{ marginBottom: '10px' }}
                    label="Aplicar NC"
                    onClick={() => setApplyNc(!applyNc)}
                    checked={applyNc}
                  />
                  <br />
                </div>
                <div>
                  <Checkbox
                    style={{ marginBottom: '10px' }}
                    label="Pago parcial"
                    onClick={() => setParcial(!parcial)}
                    checked={parcial}
                  />
                  <br />
                </div>
              </div>
              <div className={styles.divInputCont2}>
                <CustomInput
                  name="comprobanteVendedor"
                  type="text"
                  width="xsmall"
                  placeholder="Ingrese el comprobante de vendedor"
                  icon="fa-solid fa-arrow-up-9-1"
                  validate={{ required: true }}
                />
              </div>
              <Divider />
              {applyNc ? (
                <div style={{ position: 'relative' }}>
                  <span className={styles.pLabel}>Nota de crédito</span>
                  <div className={styles.ncTableCont}>
                    <RoleTableContainer
                      slim
                      colum={[
                        { title: 'Marcar', width: '20%' },
                        { title: 'Fecha', width: '25%' },
                        { title: 'Comprobante', width: '30%' },
                        { title: 'Monto', width: '25%' },
                      ]}
                      marcToggle={marcToggle}
                      result={listNcNoApply.data}
                      type="noApply"
                      checked={checked}
                      omitPaginator={true}
                    />
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    <Divider />
                  </div>
                </div>
              ) : null}
              {payMethod.transferencia ? (
                <div style={{ position: 'relative' }}>
                  <span className={styles.pLabel}>Transferencia</span>
                  {Array(cantTransf)
                    .fill(null)
                    .map((_, i) => (
                      <>
                        <div className={styles.divInputCont2}>
                          <CustomInput
                            name={`numOperation-${i}`}
                            type="text"
                            width="small"
                            placeholder="Ingrese el número de operación"
                            icon="fa-solid fa-arrow-down-up-across-line"
                            validate={{ required: true }}
                          />
                          <CustomInput
                            name={`trBanco-${i}`}
                            type="text"
                            width="xsmall"
                            placeholder="Ingrese el nombre del banco"
                            icon="fa-solid fa-building-columns"
                            validate={{ required: true }}
                          />
                        </div>
                        <div>
                          <EditInput
                            formatNum
                            name={`trImporte-${i}`}
                            type="text"
                            width="complete"
                            placeholder={`Ingrese el monto de la transferencia`}
                            icon="fa-solid fa-hand-holding-dollar"
                            validate={{ required: true }}
                          />
                        </div>
                      </>
                    ))}
                  <div className={styles.addButtonCont}>
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => setCantTransf(cantTransf + 1)}
                    >
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <Divider />
                </div>
              ) : null}
              {payMethod.cheque ? (
                <div style={{ position: 'relative' }}>
                  <span className={styles.pLabel}>Cheque</span>
                  {payChDate.map((_, i) => (
                    <>
                      <div className={styles.divInputCont2}>
                        <DatePicker
                          placeholder="Fecha de cobro"
                          className={styles.pickStyle}
                          onChange={(date) => {
                            if (date) {
                              let newpayChDate = [...payChDate];
                              newpayChDate[i].fechaCobro = date.toISOString(); // Convierte la fecha al formato ISO
                              setPayChDate(newpayChDate);
                            }
                          }}
                          getPopupContainer={(trigger) => trigger.parentNode}
                        />
                        <CustomInput
                          name={`numCheque-${i}`}
                          type="text"
                          width="xsmall"
                          placeholder="Ingrese el número de cheque"
                          icon="fa-solid fa-money-check"
                          validate={{ required: true }}
                        />
                      </div>
                      <div className={styles.divInputCont2}>
                        <CustomInput
                          name={`chBanco-${i}`}
                          type="text"
                          width="small"
                          placeholder="Ingrese el nombre del banco"
                          icon="fa-solid fa-building-columns"
                          validate={{ required: true }}
                        />
                        <EditInput
                          formatNum
                          name={`chImporte-${i}`}
                          type="text"
                          width="xsmall"
                          placeholder={`Ingrese el monto del cheque`}
                          icon="fa-solid fa-hand-holding-dollar"
                          validate={{ required: true }}
                        />
                      </div>
                    </>
                  ))}

                  <div className={styles.addButtonCont}>
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => {
                        let newChequeState = [...payChDate];
                        newChequeState.push({
                          fecha: new Date().toISOString(),
                          fechaCobro: null,
                        });
                        setPayChDate(newChequeState);
                      }}
                    >
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <Divider />
                </div>
              ) : null}
            </>
          ) : movType == 2 ? (
            <div style={{ position: 'relative' }}>
              <div className={styles.ncTableCont}>
                <RoleTableContainer
                  slim
                  colum={[
                    { title: 'Marcar', width: '20%' },
                    { title: 'Fecha', width: '25%' },
                    { title: 'Comprobante', width: '30%' },
                    { title: 'Monto', width: '25%' },
                  ]}
                  marcToggle={marcToggle}
                  result={listNcNoApply.data}
                  type="noApply"
                  checked={checked}
                  omitPaginator={true}
                />
              </div>
              <div style={{ marginTop: '25px' }}>
                <Divider />
              </div>
            </div>
          ) : null}
          {payMethod.efectivo && movType == 1 && parcial ? (
            <div style={{ position: 'relative' }}>
              <span className={styles.pLabel}>Efectivo</span>
              <div style={{ paddingTop: '15px' }}>
                <EditInput
                  formatNum
                  name="efImporte"
                  type="text"
                  width="complete"
                  placeholder="Ingrese el monto en efectivo"
                  icon="fa-solid fa-hand-holding-dollar"
                  validate={{ required: true }}
                />
              </div>
            </div>
          ) : null}
          <div className={styles.buttonContainer}>
            {movType == 1 ? (
              <Button
                disabled={
                  inactive ||
                  filterOrders(listMov)?.reduce(
                    (acum, order) => acum + order.outstandingBalance,
                    0
                  ) < 1 ||
                  filterOrders(listMov)?.reduce(
                    (acum, order) => acum + order.outstandingBalance,
                    0
                  ) -
                    listNcNoApply.montoTotal <
                    0
                }
                type="submit"
                style={{
                  backgroundColor: '#673ab7',
                  border: '1px solid #673ab7',
                  height: '48px',
                  width: '100px',
                  marginLeft: '10px',
                }}
              >
                {inactive ? <Spinner /> : 'Confirmar'}
              </Button>
            ) : (
              <Button
                disabled={
                  inactive || compareNCListFactList(listMov, listNcNoApply.data)
                }
                onClick={cancelFactFn}
                style={{
                  backgroundColor: '#673ab7',
                  border: '1px solid #673ab7',
                  height: '48px',
                  width: '100px',
                  marginLeft: '10px',
                }}
              >
                {inactive ? <Spinner /> : 'Confirmar'}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
export default NewMoviment;
