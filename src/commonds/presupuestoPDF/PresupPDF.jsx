import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import logo from '../../assets/logo/logoSanJorge.png';
import './presup.css';
import { fechaConverter } from '../../utils';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    flexGrow: 1,
  },
});

// Create Document Component
const PresupPDF = (props) => {
  const { list, order } = props;
  return (
    <Document>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '200px',
          justifyContent: 'space-between',
          border: '1px solid grey',
          borderRadius: '10px 10px 0 0',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '33%' }}>
            <img src={logo} style={{ width: '300px' }} />
            <div style={{ width: '100%', height: '25px', marginLeft: '20px' }}>
              <p style={{ width: '85%', fontSize: '12px' }}>
                Repuestos San jorge - Av. Don bosco 2401, Morón - TEL: 60823778
              </p>
            </div>
          </div>
          <div
            style={{
              width: '33%',
              height: '45px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <span
              style={{
                fontSize: '55px',
                fontWeight: '800',
                height: '55px',
              }}
            >
              X
            </span>
          </div>
          <div
            style={{
              width: '33%',
              height: '25px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span
              style={{
                marginTop: '20px',
                marginRight: '30px',
                fontSize: '35px',
              }}
            >
              PRESUPUESTO
            </span>
            <div style={{ margin: '20px 40px 0 0' }}>
              <span style={{ fontWeight: '600', fontSize: '18px' }}>
                Fecha:{' '}
                <span style={{ fontWeight: '400' }}>{fechaConverter()}</span>
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          NO VÁLIDO COMO FACTURA
        </div>
      </div>
      <Page size="A4" style={styles.page}>
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '580px',
            justifyContent: 'space-between',
            border: '1px solid grey',
          }}
        >
          <View style={styles.section}>
            <table
              style={{
                width: '100%',
                height: '93%',
                // display: "flex",
                // flexDirection: "column"
              }}
            >
              <tr
                style={{
                  height: '30px',
                  borderBottom: '1px solid grey',
                  backgroundColor: '#EDEDED',
                }}
              >
                <th style={{ width: '15%', paddingLeft: '10px' }}>CANTIDAD</th>
                <th style={{ width: '47%' }}>DESCRIPCIÓN</th>
                <th style={{ width: '18%' }}>PRECIO</th>
                <th style={{ width: '20%' }}>IMPORTE</th>
              </tr>
              {list.map((item) => (
                <tr style={{ height: '30px', borderBottom: '1px solid grey' }}>
                  <td style={{ paddingLeft: '10px' }}>{item.amount}</td>
                  <td>{item.product.description}</td>
                  <td>{`$ ${item.sellPrice * 1.21}`}</td>
                  <td>{`$ ${item.sellPrice * 1.21 * item.amount}`}</td>
                </tr>
              ))}
              <tr></tr>
            </table>
            <div
              style={{
                height: '35px',
                borderTop: '1px solid grey',
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '700' }}>TOTAL</span>
              <span style={{ fontSize: '18px', fontWeight: '700' }}>
                {`$ ${order.data.total}`}
              </span>
            </div>
          </View>
        </div>
      </Page>
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '150px',
          justifyContent: 'space-between',
          border: '1px solid grey',
          borderRadius: '0 0 10px 10px',
        }}
      >
        <span style={{ margin: '10px', fontSize: '20px', fontWeight: '700' }}>
          OBSERVACIONES:
        </span>
      </div>
    </Document>
  );
};

export default PresupPDF;
