import React from 'react';
import styles from './sidebar.module.css';
import CustomButton from '../../commonds/button/CustomButton';
import Separador from '../../commonds/separador/Separador';
import CustomAcordion from '../../commonds/acordion/CustomAcordion';
import { falseNotificStatus } from '../../redux/webSocketNotification';
import { useDispatch } from 'react-redux';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';

function SideBarComponent(props) {
  const { status, fnNavigate, notific } = props;
  const { newSell } = notific;
  const dispatch = useDispatch();

  return (
    <div
      className={`${styles.sidebarContainer} ${
        status ? '' : `${styles.close}`
      }`}
    >
      <ProtectedComponent listAccesss={[1]}>
        <div className={styles.section}>
          <h5 className={styles.sideTitle}>Dashboard</h5>
          <CustomButton
            props={{
              buttonStyle: 'sideOptionButton',
              icon: 'fas fa-tachometer-alt',
              iconStyle: 'sideIconGri',
              iconHoverStyle: 'sideIconVio',
              textButton: 'Dashboard',
              fnSidebar: () => {
                fnNavigate('/');
              },
            }}
          />
        </div>
      </ProtectedComponent>
      <Separador props={{ clase: 'sideSeparador' }} />
      <div className={styles.section}>
        <h5 className={styles.sideTitle}>Registrar</h5>
        <CustomAcordion
          props={{
            textButton: 'Usuarios',
            icon01: 'fa-solid fa-user',
            items: [
              {
                textButton: 'Registrar vendedor',
                fn: () => {
                  fnNavigate('/add/seller');
                },
              },
              {
                textButton: 'Registrar cliente',
                fn: () => {
                  fnNavigate('/add/client');
                },
              },
              {
                textButton: 'Registrar proveedor',
                fn: () => {
                  fnNavigate('/add/supplier');
                },
              },
              {
                textButton: 'Registrar usuario',
                fn: () => {
                  fnNavigate('/add/user');
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: 'Marca Producto',
            icon01: 'fa fa-box',
            items: [
              {
                textButton: 'Registrar marca',
                fn: () => {
                  fnNavigate('/add/brand');
                },
              },
              {
                textButton: 'Registrar producto',
                fn: () => {
                  fnNavigate('/add/product');
                },
              },
            ],
          }}
        />
      </div>
      <Separador props={{ clase: 'sideSeparador' }} />
      <div className={styles.section}>
        <h5 className={styles.sideTitle}>Administración</h5>
        <CustomAcordion
          props={{
            textButton: 'Usuarios',
            icon01: 'fa fa-smile',
            items: [
              {
                textButton: 'Buscar vendedor',
                fn: () => {
                  fnNavigate('search/seller');
                },
              },
              {
                textButton: 'Buscar cliente',
                fn: () => {
                  fnNavigate('search/client');
                },
              },
              {
                textButton: 'Buscar usuarios',
                fn: () => {
                  fnNavigate('search/users');
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: 'Proveedores',
            icon01: 'fa fa-dolly',
            items: [
              {
                textButton: 'Buscar proveedor',
                fn: () => {
                  fnNavigate('search/supplier');
                },
              },
              // {
              //   textButton: 'Representantes',
              //   fn: () => {
              //     fnNavigate('search/supplier/representative');
              //   },
              // },
              {
                textButton: 'Ordenes de pago',
                fn: () => {
                  fnNavigate('search/supplier/payments');
                },
              },
            ],
          }}
        />
      </div>
      <Separador props={{ clase: 'sideSeparador' }} />
      <div className={styles.section}>
        <h5 className={styles.sideTitle}>Registros</h5>
        <CustomAcordion
          props={{
            textButton: 'Marca Producto',
            icon01: 'fa-solid fa-box-open',
            items: [
              {
                textButton: 'Marcas',
                fn: () => {
                  fnNavigate('/search/brand');
                },
              },
              {
                textButton: 'Productos',
                fn: () => {
                  fnNavigate('/search/product');
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: 'Compras',
            icon01: 'fa fa-tag',
            items: [
              {
                textButton: 'Nueva orden de compra',
                fn: () => {
                  fnNavigate('/new/buy');
                },
              },
              {
                textButton: 'Buscar orden de compra',
                fn: () => {
                  fnNavigate('/search/buy');
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            notific: { notific: newSell.data, index: 1 },
            textButton: 'Ventas',
            icon01: 'fa fa-smile',
            items: [
              {
                textButton: 'Nuevo pedido',
                fn: () => {
                  fnNavigate('/new/sell');
                },
              },
              {
                textButton: 'Punto de venta',
                fn: () => {
                  fnNavigate('/pos');
                },
              },
              {
                textButton: 'Buscar pedidos',
                fn: () => {
                  fnNavigate('/search/sell');
                  dispatch(falseNotificStatus());
                },
              },
              {
                textButton: 'Reporte de ventas',
                fn: () => {
                  fnNavigate('/report/sell');
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: 'Picking',
            icon01: 'fa fa-dolly',
            items: [
              {
                textButton: 'Buscar Orden de control',
                fn: () => {
                  fnNavigate('/control/orden');
                },
              },
              {
                textButton: 'Buscar Orden de pedido',
                fn: () => {
                  fnNavigate('/picking/orden');
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: 'Pendientes',
            icon01: 'fa-solid fa-business-time',
            items: [
              {
                textButton: 'Lista de pendientes',
                fn: () => {
                  fnNavigate('/pending');
                },
              },
            ],
          }}
        />
      </div>
      <ProtectedComponent listAccesss={[1]}>
        <Separador props={{ clase: 'sideSeparador' }} />
        <div className={styles.section}>
          <h5 className={styles.sideTitle}>Configuración</h5>
          <CustomButton
            props={{
              buttonStyle: 'sideOptionButton',
              icon: 'fab fa-whatsapp',
              iconStyle: 'sideIconGri',
              iconHoverStyle: 'sideIconVio',
              textButton: 'Conexión WhatsApp',
              fnSidebar: () => {
                fnNavigate('/whatsapp/connection');
              },
            }}
          />
        </div>
      </ProtectedComponent>
    </div>
  );
}

export default SideBarComponent;
