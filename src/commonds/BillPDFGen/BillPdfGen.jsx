import React from 'react';
import styles from './billPdfGen.module.css';

const BillPdfGen = ({
  numeroComprobante,
  fechaEmision,
  tipoComprobante,
  cuitEmisor,
  razonSocialEmisor,
  direccionEmisor,
  cuitReceptor,
  razonSocialReceptor,
  direccionReceptor,
  iva21,
  iva105,
  iva0,
  neto,
  total,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.encabezado}>
        <div className={styles.logoAfip}>
          <img
            src="https://ar.pinterest.com/pin/afip-logo-argentina--846817536204860862/"
            alt="Logo AFIP"
          />
        </div>
        <div className={styles.informacionComprobante}>
          <p>
            <b>Número de Comprobante:</b> {numeroComprobante}
          </p>
          <p>
            <b>Fecha de Emisión:</b> {fechaEmision}
          </p>
          <p>
            <b>Tipo de Comprobante:</b> {tipoComprobante}
          </p>
        </div>
      </div>
      <div className={styles.datosEmisor}>
        <p>
          <b>CUIT Emisor:</b> {cuitEmisor}
        </p>
        <p>
          <b>Razón Social Emisor:</b> {razonSocialEmisor}
        </p>
        <p>
          <b>Dirección Emisor:</b> {direccionEmisor}
        </p>
      </div>
      <div className={styles.datosReceptor}>
        <p>
          <b>CUIT Receptor:</b> {cuitReceptor}
        </p>
        <p>
          <b>Razón Social Receptor:</b> {razonSocialReceptor}
        </p>
        <p>
          <b>Dirección Receptor:</b> {direccionReceptor}
        </p>
      </div>
      <div className={styles.detalleItems}>
        {/* Tabla para items de la factura */}
      </div>
      <div className={styles.totales}>
        <p>
          <b>IVA 21%:</b> ${iva21}
        </p>
        <p>
          <b>IVA 10.5%:</b> ${iva105}
        </p>
        <p>
          <b>IVA 0%:</b> ${iva0}
        </p>
        <p>
          <b>Neto:</b> ${neto}
        </p>
        <p>
          <b>Total:</b> ${total}
        </p>
      </div>
      <div className={styles.leyenda}>
        <p>Esta factura ha sido autorizada por la AFIP.</p>
      </div>
    </div>
  );
};

export default BillPdfGen;
