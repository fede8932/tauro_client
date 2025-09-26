import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import styles from './pdfGenR.module.css';
import { fechaConverter } from '../../utils';

const PdfGenR = (props) => {
  const { order, numRemito } = props;
  const list = order.purchaseOrderItems;
  const totalPages = Math.ceil(list.length / itemsPerPage);

  // console.log(controlOrder, list);
  const renderPages = () => {
    const pages = [];
    for (let i = 0; i < list.length; i += 14) {
      const pageNumber = Math.floor(i / itemsPerPage) + 1;
      const pageItems = list.slice(i, i + 14);
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
          <View style={{ width: '800px', height: '1100px' }}>
            <div className={styles.encabezado}>
              <div className={styles.leftCont}>
                <div className={styles.dataEmisor}>
                  <img
                    className={styles.logo}
                    src="../assets/logo/logoBlase.png"
                    alt="logo"
                  />
                  <div className={styles.infoEminContainer}>
                    <span className={styles.infoEmisTex}>
                      De Hernan Blasevich
                    </span>
                    <span className={styles.infoEmisTex}>
                      Don Bosco 2175, Morón. CP: 1708
                    </span>
                    <span className={styles.infoEmisTex}>4460-5972</span>
                    <span className={styles.infoEmisTex}>
                      ventas@blasedistribuidora.com
                    </span>
                    <span className={styles.infoEmisTex}>
                      IVA: Responsable Inscripto
                    </span>
                  </div>
                </div>
                <div className={styles.factCode}>
                  <div className={styles.tipeFact}>R</div>
                  <span className={styles.cod}>No valido como factura</span>
                </div>
              </div>
              <div className={styles.dataFact}>
                <div className={styles.factCont}>
                  <div className={styles.hojaCont}>
                    <span>REMITO</span>
                    <span>{`Pag ${pageNumber} de ${totalPages}`}</span>
                  </div>
                  <div className={styles.numberFact}>
                    <span>{numRemito}</span>
                  </div>
                </div>
                <div className={styles.fechaFact}>
                  FECHA: {fechaConverter()}
                </div>
                <div className={styles.datFisc}></div>
              </div>
            </div>
            <div className={styles.clientContainer}>
              <div className={styles.ivaClient}>
                <span className={styles.clientInfoText}>
                  Razon Social:{' '}
                  <span className={styles.clientInfoTextDos}>
                    {order.client.razonSocial}
                  </span>
                </span>
                <span className={styles.clientInfoText}>
                  Teléfono:{' '}
                  <span className={styles.clientInfoTextDos}>
                    {order.client.telefono}
                  </span>
                </span>
              </div>
              <div className={styles.ivaClient}>
                <span className={styles.clientInfoText}>
                  Dirección:{' '}
                  <span className={styles.clientInfoTextDos}>
                    {`${order.client.calle} ${order.client.altura}, ${order.client.localidad}`}
                  </span>
                </span>
                <span className={styles.clientInfoText}>
                  Condición de venta:
                  <span className={styles.clientInfoTextDos}>Productos</span>
                </span>
              </div>
              <div className={styles.ivaClient}>
                <span className={styles.clientInfoText}>
                  IVA:
                  <span className={styles.clientInfoTextDos}>
                    {order.client.iva}
                  </span>
                </span>
                <span className={styles.clientInfoText}>
                  CUIT:
                  <span className={styles.clientInfoTextDos}>
                    {order.client.cuit}
                  </span>
                </span>
              </div>
            </div>
            <div className={styles.tableContainer}>
              <tr className={styles.header}>
                <th>CODIGO</th>
                <th>DESCRIPCION</th>
                <th>CANT.</th>
              </tr>
              <table className={styles.table}>
                {pageItems.map((item) => (
                  <tr className={styles.header}>
                    <td>{item.product.article}</td>
                    <td>{item.product.description}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </table>
            </div>
            <div className={styles.afipDataDosContainer}>
              <div className={styles.afipDataDosContainerLeft}>
                <div className={styles.imgLogQr}>
                  <div>
                    <div className={styles.dataCae}>
                      <span>
                        Recibí conforme la cantidad de ______ bultos sin
                        anomalías en envoltorio
                      </span>
                      <span>
                        Firma:
                        _________________________________________________________________
                      </span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.totalCont}>
                <span className={styles.pesosSpanCont}>
                  TOTAL ITEMS<span className={styles.pesosSpan}></span>5
                </span>
                <span className={styles.pesosSpanCont}>
                  TOTAL UNIDADES<span className={styles.pesosSpan}></span>15
                </span>
              </div>
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

export default PdfGenR;
