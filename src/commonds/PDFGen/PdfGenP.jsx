import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import logoBlase from '../../assets/logo/logoBlase.png';
import {
  buyOrderString,
  fechaConverter,
  pickingOrderString,
  sortByBrandName,
} from '../../utils';

const PdfGenP = (props) => {
  const { pickingOrder } = props;
  const list = sortByBrandName(pickingOrder.purchaseOrder.purchaseOrderItems);

  const renderPages = () => {
    const pages = [];
    for (let i = 0; i < list.length; i += 25) {
      const pageItems = list.slice(i, i + 25);
      // console.log(pageItems);
      const page = (
        <Page
          key={i} // Usar una clave única para cada página
          size="A4"
          orientation="landscape"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <View style={{ width: '100%', height: '790px' }}>
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
                  <img
                    src={logoBlase}
                    style={{ width: '180px', margin: '8px' }}
                  />
                </div>
                <div
                  style={{
                    width: '33%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <h1
                    style={{
                      marginTop: '3px',
                      padding: '0px',
                      fontSize: '16px',
                    }}
                  >
                    Orden de pedido
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
                  <h6
                    style={{ fontSize: '16px', marginTop: '15', padding: '0' }}
                  >
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
                <div
                  style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                  <span>
                    Numero de orden:{' '}
                    {buyOrderString(pickingOrder.purchaseOrder.id)}
                  </span>
                  <span>
                    Orden de pedido: {pickingOrderString(pickingOrder.id)}
                  </span>
                  <span>
                    Cliente: {pickingOrder.purchaseOrder.client.razonSocial}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '25px',
                    padding: '0px 25px',
                  }}
                >
                  <span>
                    Responsable de armado de pedido:___________________________
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                height: '780px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <table
                style={{
                  width: '98%',
                  borderCollapse: 'collapse',
                  tableLayout: 'fixed',
                  textAlign: 'left',
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: '8px',
                        textAlign: 'left',
                        width: '15%',
                      }}
                    >
                      Código
                    </th>
                    <th
                      style={{
                        padding: '8px',
                        textAlign: 'left',
                        width: '6%',
                      }}
                    >
                      Cant
                    </th>
                    <th
                      style={{
                        padding: '8px',
                        textAlign: 'left',
                        width: '16%',
                      }}
                    >
                      Ubicación
                    </th>
                    <th
                      style={{
                        padding: '8px',
                        textAlign: 'left',
                        width: '53%',
                      }}
                    >
                      Producto
                    </th>
                    <th
                      style={{
                        padding: '8px',
                        textAlign: 'left',
                        width: '10%',
                      }}
                    >
                      Marca
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item) => (
                    <tr key={item.product.article}>
                      <td style={{ padding: '2px' }}>{item.product.article}</td>
                      <td style={{ padding: '2px' }}>{item.amount}</td>
                      <td style={{ padding: '2px' }}>
                        {item.product.location}
                      </td>
                      <td
                        style={{
                          padding: '2px',
                          fontSize: '11px',
                          wordWrap: 'break-word',
                        }}
                      >
                        {item.product.description}
                      </td>
                      <td
                        style={{
                          padding: '8px',
                          fontSize: '11px',
                          wordWrap: 'break-word',
                        }}
                      >
                        {item.product.brand?.name}
                      </td>
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
          </View>
        </Page>
      );
      pages.push(page);
    }
    return pages;
  };

  return <Document>{renderPages()}</Document>;
};

export default PdfGenP;
