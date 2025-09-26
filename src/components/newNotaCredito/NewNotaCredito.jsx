import React from 'react';
import styles from './newNotaCredito.module.css';
import { FormProvider } from 'react-hook-form';
import CustomSelect from '../../commonds/select/CustomSelect';
import Button from 'react-bootstrap/esm/Button';
import { filterOrders, redondearADosDecimales } from '../../utils';
import { Checkbox } from 'semantic-ui-react';
import RoleTableContainer from '../../containers/RoleTableContainer';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import CustomInput from '../../commonds/input/CustomInput';

function NewNotaCredito(props) {
  const {
    methods,
    onSubmit,
    selectState,
    selectMotivState,
    setSelectMotivState,
    checked,
    setChecked,
    itemList,
    marcToggle,
    searchFn,
    selectTypeState,
    setSelectTypeState,
    searchBillItems,
  } = props;
  // console.log(itemList);
  const loading = useSelector((state) => state.searchOrders).loading;
  const billData = useSelector((state) => state.billItems).data;

  // console.log(billData);

  return (
    <div className={styles.formContainer}>
      <FormProvider {...methods} className={styles.provider}>
        <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <span>Tipo de devolución</span>
            <CustomSelect
              text="Selecccionar tipo de devolución"
              name="type"
              validate={{ required: true }}
              arrayOptions={[
                { value: 'nc', text: 'Nota de crédito oficial' },
                { value: 'ncp', text: 'Nota de crédito X' },
              ]}
              fnSelect={(e) => {
                setSelectTypeState(e);
              }}
            />
            <span>Motivo de devolución</span>
            <CustomSelect
              text="Selecccionar tipo de movimiento"
              name="motive"
              validate={{ required: true }}
              arrayOptions={[
                { value: 'g', text: 'Garantía' },
                { value: 'd', text: 'Devolución' },
                { value: 'n', text: 'Nota' },
              ]}
              fnSelect={(e) => {
                setSelectMotivState(e);
              }}
            />
            <>
              <span>
                {selectTypeState == 'nc'
                  ? 'Número de factura'
                  : 'Numero de presupuesto'}
              </span>
              {selectMotivState == 'n' ? (
                <CustomInput
                  name="numFact"
                  type="text"
                  width="complete"
                  placeholder={`Ingrese el número ${
                    selectTypeState == 'nc'
                      ? 'de la factura asociada'
                      : 'del presupuesto asociado'
                  }`}
                  icon="fa-solid fa-file-invoice-dollar"
                  validate={{ required: true }}
                />
              ) : (
                <div className={styles.searchInpCont}>
                  <i
                    style={{ position: 'absolute' }}
                    className="fa-solid fa-magnifying-glass"
                  ></i>
                  <input
                    type="text"
                    className={styles.searchInpTwo}
                    onChange={(e) => {
                      searchBillItems(e);
                    }}
                  />
                </div>
              )}
            </>
            {selectMotivState != 'n' ? (
              <div>
                {/* <div className={styles.searchInpCont}>
                  <i
                    style={{ position: "absolute" }}
                    className="fa-solid fa-magnifying-glass"
                  ></i>
                  <input
                    type="text"
                    className={styles.searchInp}
                    onChange={(e) => {
                      searchFn(e);
                    }}
                  />
                </div> */}
                <div className={styles.tableContainer}>
                  <RoleTableContainer
                    colum={[
                      { title: 'Check', width: '7%' },
                      { title: 'Marca', width: '16%' },
                      { title: 'Artículo', width: '12%' },
                      { title: 'Description', width: '45%' },
                      { title: 'Precio', width: '12%' },
                      { title: 'Cant.', width: '8%' },
                    ]}
                    type="ncMod"
                    result={billData?.fItems}
                    marcToggle={marcToggle}
                  />
                </div>
                <div className={styles.ncTotalCont}>
                  {billData ? (
                    <div>
                      <i class="fa-solid fa-file-invoice-dollar"></i>
                      <span
                        style={{ marginLeft: '5px' }}
                      >{`Total NC:$ ${redondearADosDecimales(
                        billData?.fItems.reduce((acum, item) => {
                          if (item.marc) {
                            return acum + item.sellPrice * item.amount;
                          }
                          return acum;
                        }, 0)
                      )} ${selectTypeState == 'nc' ? '+ iva.' : ''}`}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div>
                <span>Concepto</span>
                <CustomInput
                  name="concept"
                  type="text"
                  width="complete"
                  placeholder="Ingrese el concepto de la devolución"
                  icon="fa-solid fa-spinner"
                  validate={{ required: true }}
                />
                <span>Monto sin iva</span>
                <CustomInput
                  name="montoNota"
                  type="text"
                  width="complete"
                  placeholder="Ingrese el monto sin iva a devolver"
                  icon="fa-solid fa-hand-holding-dollar"
                  validate={{ required: true }}
                />
              </div>
            )}
          </div>
          <div className={styles.buttonContainer}>
            <Button
              disabled={
                billData?.fItems.reduce((acum, item) => {
                  if (item.marc) {
                    return acum + item.sellPrice * item.amount;
                  }
                  return acum;
                }, 0) <= 0 && selectMotivState != 'n'
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
              {loading ? <Spinner /> : 'Confirmar'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
export default NewNotaCredito;
