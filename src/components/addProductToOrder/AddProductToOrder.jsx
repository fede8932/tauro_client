import React, { useEffect, useState } from 'react';
import styles from './addProduct.module.css';
import Button from 'react-bootstrap/esm/Button';
import CustomDrawer from '../../commonds/drawer/CustomDrawer';
import AlertSuccess from '../../commonds/alertSuccess/AlerSuccess';
import { numberToString } from '../../utils';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import SimpleInputFile from '../../commonds/simpleInputFile/SimpleInputFile';
import Swal from 'sweetalert2';
import { addOrderItemsByFile } from '../../request/orderRequest';
import { getBuyOrderRequest } from '../../redux/newOrder';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderItemsRequest } from '../../redux/addOrderItems';
import { orderStatus } from '../../enum/StatusOrderEnum';
import AddProductsTable from '../tables/addProductsTable/AddProductsTable';

function AddProductToOrder(props) {
  const {
    setView,
    fnAdd,
    fnInfo,
    fnDelete,
    fnUpdate,
    fnPrUpdate,
    listOrder,
    order,
    orderAjust,
    fnEnd,
    path,
    type,
    goPath,
    showAlert,
    recep,
  } = props;
  // console.log(productPages.data);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const actualOrder = useSelector((state) => state.newBuyOrder);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      Swal.fire({
        title: 'Estás seguro?',
        text: 'Vas a importar un archivo de productos a la lista!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          addOrderItemsByFile({
            orderId: order.data.id,
            file: file,
          })
            .then((res) => {
              if (res.error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Ocurrió un error',
                  text: `Error: ... ${res.error.message}`,
                  showConfirmButton: false, // Oculta el botón "OK"
                  timer: 2500,
                });
                return;
              }
              dispatch(getBuyOrderRequest(order.data.id)).then(() => {
                dispatch(getOrderItemsRequest(order.data.id)).then(() => {
                  Swal.fire({
                    title: 'Actualizado!',
                    text: 'Orden actualizada',
                    icon: 'success',
                    showConfirmButton: false, // Oculta el botón "OK"
                    timer: 1000,
                  });
                });
              });
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error',
                text: `Error: ... ${err.message}`,
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 2500,
              });
            })
            .finally(() => {
              setLoading(false);
              setFile(null);
            });
        }
      });
    }
  }, [file]);

  return (
    <div className={styles.addProductContainer}>
      <div className={styles.prodToOrderContainer}>
        <div className={styles.infoProvContainer}>
          <span className={styles.labelInfoProv}>
            <i className="fa-solid fa-file-signature"></i> Razon Social:
            <span className={styles.textInfoProv}>
              {order?.data?.supplier?.razonSocial.toUpperCase()}
            </span>
          </span>
          <span className={styles.labelInfoProv}>
            <i className="fa-regular fa-id-card"></i> CUIT:
            <span className={styles.textInfoProv}>
              {order?.data?.supplier?.cuit}
            </span>
          </span>
          <span className={styles.labelInfoProv}>
            <i className="fa-solid fa-store"></i> Nº de compra:
            <span className={styles.textInfoProv}>{order.data.numero}</span>
          </span>
          {type == 'ajuste' ? (
            <div className={styles.infoCostoCont}>
              <span className={styles.precioLabel}>
                <i className="fa-solid fa-file-invoice"></i> ID Ajuste:
              </span>
              <span className={styles.precioText}>{orderAjust.data.id}</span>
            </div>
          ) : null}
          <ProtectedComponent listAccesss={[1, 2]}>
            <>
              <div className={styles.infoCostoCont}>
                <span className={styles.precioLabel}>
                  <i className="fa-solid fa-money-bill"></i> Subtotal:
                </span>
                <span className={styles.precioText}>{`$ ${
                  type == 'ajuste'
                    ? numberToString(orderAjust.data.subTotal)
                    : numberToString(order.data.subTotal)
                }`}</span>
              </div>
              <div className={styles.infoCostoCont}>
                <span className={styles.precioLabel}>
                  <i className="fa-solid fa-money-bill-trend-up"></i> IVA:
                </span>
                <span className={styles.precioText}>{`$ ${
                  type == 'ajuste'
                    ? numberToString(orderAjust.data.subTotal * 0.21)
                    : numberToString(order.data.subTotal * 0.21)
                }`}</span>
              </div>
              <div className={styles.infoCostoCont}>
                <span className={styles.precioLabel}>
                  <i className="fa-solid fa-money-bill-1-wave"></i> Total:
                </span>
                <span className={styles.precioText}>{`$ ${
                  type == 'ajuste'
                    ? numberToString(orderAjust?.data?.total)
                    : numberToString(order.data.total)
                }`}</span>
              </div>
            </>
          </ProtectedComponent>
        </div>
      </div>
      <div className={styles.tableProdContainerPrinc}>
        <div className={styles.searchTableContainer}>
          <div className={styles.alertContainer}>
            {showAlert && (
              <AlertSuccess text={'Actualizado'} visible={showAlert} />
            )}
          </div>
          <div className={styles.buttonSearchCotainer}>
            <div className={styles.buttonInfoContainer}>
              <SimpleInputFile
                text="Importar"
                setFile={setFile}
                importLoading={loading}
                extStyle
              />
              <CustomDrawer
                type={type}
                orderType="OC"
                fnDelete={fnDelete}
                fnUpdate={fnUpdate}
                fnPrUpdate={fnPrUpdate}
                listOrder={listOrder}
                orderAjust={orderAjust}
              />
            </div>
          </div>
          <div className={styles.tableProdContainer}>
            <AddProductsTable
              supplierId={actualOrder?.data?.supplierId}
              fnAdd={fnAdd}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        {path == '/edit/buy' ? null : (
          <Button
            className={`${styles.buttonStyle} ${styles.buttonStyleBack}`}
            variant="danger"
            onClick={() => {
              !type == 'ajuste' ? setView('General') : goPath('/search/buy');
            }}
          >
            Atras
          </Button>
        )}
        {orderStatus[order?.data?.status] == 'Open' ? (
          <Button
            disabled={order.data.subTotal <= 0 ? true : false}
            className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
            variant="primary"
            onClick={() => {
              fnEnd();
            }}
          >
            Confirmar
          </Button>
        ) : orderStatus[order?.data?.status] == 'Confirm' ? (
          <Button
            disabled={order.data.subTotal <= 0 ? true : false}
            className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
            variant="primary"
            onClick={() => {
              recep(order.data.id);
            }}
          >
            Recibir
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default AddProductToOrder;
