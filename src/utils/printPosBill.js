import QRCode from 'qrcode';
import logoBlase from '../assets/logo/logoBlase.png';
import logoAfip from '../assets/afip/logo-vector-afip.jpg';
import {
  convertImageToBase64,
  waitForImagesToLoad,
  redondearADosDecimales,
  billDateTostringDate,
  presDateIsoTostringDate,
} from '../utils';
import {
  getBillDataRequest,
  rePrintPresRequest,
} from '../request/orderRequest';
import { getBillByIdRequest } from '../request/billRequest';
import { billHtml } from '../templates/bill';
import { presupHtml } from '../templates/presupBlase';
import { remitHtml } from '../templates/RemBlase';

/**
 * Imprime la factura/presupuesto + remito a partir del billData
 * devuelto por GenSellOrderByPos.
 *
 * billData: { oficial, numComprobante, ptoVenta, id, billType }
 * - billType 1 = Factura A, 6 = Factura B (oficial AFIP)
 * - billType 0 / "P" = Presupuesto (Factura X)
 */
export async function printPosBill(billData) {
  const { numComprobante, ptoVenta, id, billType } = billData;

  const logoAfipBase64 = await convertImageToBase64(logoAfip);
  const logoBlaseBase64 = await convertImageToBase64(logoBlase);

  const nuevaVentana = window.open('', '', 'width=900,height=1250');
  if (!nuevaVentana) {
    throw new Error(
      'No se pudo abrir la ventana de impresión. Verifique los pop-ups del navegador.'
    );
  }

  let purchaseOrder = null;
  let numRemito = null;
  let billRemDate = { type: null, date: null };

  // FACTURA OFICIAL (A o B)
  if (billType === 1 || billType === 6) {
    const billInfoAfip = await getBillDataRequest(
      numComprobante,
      billType,
      ptoVenta
    );
    numRemito = billInfoAfip.billData.ResultGet.CbteDesde;
    billRemDate.type = 'f';
    billRemDate.date = billDateTostringDate(
      billInfoAfip.billData.ResultGet.CbteFch
    );

    const billInfo = await getBillByIdRequest(id);
    purchaseOrder = billInfo.purchaseOrder;
    const factItems = billInfo.fItems || [];

    billInfo.specialItems?.forEach((si) => {
      if (si.oficial) {
        factItems.push({
          product: {
            article: 'OP-ES01',
            description: si.concept?.toUpperCase() ?? '-',
          },
          amount: 1,
          sellPrice: 0 - redondearADosDecimales(si.amount / 1.21),
        });
      }
    });

    const codigoQR = await QRCode.toDataURL(billInfoAfip.url);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(factItems.length / itemsPerPage) || 1;

    for (let i = 0; i < factItems.length; i += itemsPerPage) {
      const pageNumber = Math.floor(i / itemsPerPage) + 1;
      const pageItems = factItems.slice(i, i + itemsPerPage);

      const render = await billHtml(
        billInfoAfip.billData.ResultGet,
        purchaseOrder,
        codigoQR,
        pageItems,
        pageNumber,
        totalPages,
        logoAfipBase64,
        logoBlaseBase64
      );
      const containerFact = nuevaVentana.document.createElement('div');
      containerFact.innerHTML = render;
      nuevaVentana.document.body.appendChild(containerFact);

      if (pageNumber < totalPages) {
        const pageBreak = nuevaVentana.document.createElement('div');
        pageBreak.style.pageBreakAfter = 'always';
        nuevaVentana.document.body.appendChild(pageBreak);
      }
    }
  } else {
    // PRESUPUESTO (Factura X)
    const presData = await rePrintPresRequest(id);
    purchaseOrder = presData.purchaseOrder;
    numRemito = purchaseOrder?.pickingOrder?.numRemito ?? purchaseOrder?.id;
    billRemDate.type = 'p';
    billRemDate.date = presDateIsoTostringDate(presData.fecha);

    const factPresItems = (purchaseOrder.purchaseOrderItems || []).filter(
      (poi) => !poi.fact
    );
    presData.specialItems?.forEach((si) => {
      if (!si.oficial) {
        factPresItems.push({
          product: {
            article: 'OP-ES01',
            description: si.concept?.toUpperCase() ?? '-',
          },
          amount: 1,
          sellPrice: 0 - si.amount,
        });
      }
    });

    const itemsPerPage = 10;
    const totalPresPages = Math.ceil(factPresItems.length / itemsPerPage) || 1;

    for (let i = 0; i < factPresItems.length; i += itemsPerPage) {
      const pagePresNumber = Math.floor(i / itemsPerPage) + 1;
      const pagePresItems = factPresItems.slice(i, i + itemsPerPage);

      const render = presupHtml(
        presData,
        purchaseOrder,
        logoBlaseBase64,
        pagePresItems,
        pagePresNumber,
        totalPresPages
      );
      const containerPres = nuevaVentana.document.createElement('div');
      containerPres.innerHTML = render;
      nuevaVentana.document.body.appendChild(containerPres);

      if (pagePresNumber < totalPresPages) {
        const pageBreak = nuevaVentana.document.createElement('div');
        pageBreak.style.pageBreakAfter = 'always';
        nuevaVentana.document.body.appendChild(pageBreak);
      }
    }
  }

  // REMITO (siempre que haya purchaseOrder con items)
  if (purchaseOrder?.purchaseOrderItems?.length) {
    // Salto de página antes del remito
    const pageBreakBefore = nuevaVentana.document.createElement('div');
    pageBreakBefore.style.pageBreakBefore = 'always';
    nuevaVentana.document.body.appendChild(pageBreakBefore);

    const itemsRemPage = 14;
    const totalRemPages = Math.ceil(
      purchaseOrder.purchaseOrderItems.length / itemsRemPage
    );

    for (
      let i = 0;
      i < purchaseOrder.purchaseOrderItems.length;
      i += itemsRemPage
    ) {
      const pageNumber = Math.floor(i / itemsRemPage) + 1;
      const pageItems = purchaseOrder.purchaseOrderItems.slice(
        i,
        i + itemsRemPage
      );

      const containerRem = nuevaVentana.document.createElement('div');
      containerRem.innerHTML = remitHtml(
        purchaseOrder,
        numRemito,
        pageItems,
        pageNumber,
        totalRemPages,
        logoBlaseBase64,
        billRemDate
      );
      nuevaVentana.document.body.appendChild(containerRem);

      if (pageNumber < totalRemPages) {
        const pageBreak = nuevaVentana.document.createElement('div');
        pageBreak.style.pageBreakAfter = 'always';
        nuevaVentana.document.body.appendChild(pageBreak);
      }
    }
  }

  await waitForImagesToLoad(nuevaVentana);
  nuevaVentana.addEventListener('afterprint', () => {
    nuevaVentana.close();
  });
  nuevaVentana.print();
}
