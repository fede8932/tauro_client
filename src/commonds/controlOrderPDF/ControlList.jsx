import React from 'react';
import logoBlase from '../../assets/logo/logoBlase.png';
import {
  ajustOrderString,
  buyOrderString,
  controlOrderString,
  fechaConverter,
} from '../../utils';

const ControlList = (props) => {
  const { controlOrder } = props;
  const list = controlOrder.purchaseOrder.orderAjust
    ? controlOrder.purchaseOrder.orderAjust.ajustOrderItems
    : controlOrder.purchaseOrder.purchaseOrderItems;
  console.log(list);
  return (
    <div style={{ width: '100%', height: '850px' }}>
      <div
        style={{
          width: '100%',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '95%',
            height: '70px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '33%' }}>
            <img src={logoBlase} style={{ width: '180px', margin: '8px' }} />
          </div>
          <div
            style={{ width: '33%', display: 'flex', justifyContent: 'center' }}
          >
            <h1 style={{ marginTop: '3px', padding: '0px' }}>
              Orden de control
            </h1>
          </div>
          <div
            style={{
              width: '33%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <h6 style={{ fontSize: '16px', marginTop: '15', padding: '0' }}>
              Fecha:{' '}
              <span style={{ fontWeight: '200' }}>
                {fechaConverter(new Date())}
              </span>
            </h6>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid grey',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span>
              Numero de orden: {buyOrderString(controlOrder.purchaseOrder.id)}
            </span>
            <span>Orden de control: {controlOrderString(controlOrder.id)}</span>
            <span>
              Ajuste N°:{' '}
              {controlOrder.purchaseOrder.orderAjust
                ? ajustOrderString(controlOrder.purchaseOrder.orderAjust.id)
                : '-'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginTop: '25px',
            }}
          >
            <span>Proveedor: Corven S.R.L.</span>
            <span>N° Remito: R-000598</span>
            <span>Responsable de control:___________________________</span>
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <table
          style={{
            width: '98%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Producto</th>
              <th>Marca</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr>
                <td>{item.product.article}</td>
                <td>{item.amount}</td>
                <td>{item.product.description}</td>
                <td>{item.brand.name}</td>
                <td>{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          width: '97%',
          height: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          marginTop: '5px',
        }}
      >
        <span>
          Firma responsable:__________________________________________
        </span>
      </div>
    </div>
  );
};

export default ControlList;
