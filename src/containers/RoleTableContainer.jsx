import React, { useState } from 'react';
import RoleTableComponent from '../components/roleTable/RoleTableComponent';
import { UpdateStatusSellerRequest } from '../redux/searchSeller';
import { useDispatch } from 'react-redux';
import { UpdateStatusClientRequest } from '../redux/searchClient';
import QRCode from 'qrcode';
import {
  DeleteRepSupplierRequest,
  UpdateStatusSupplierRequest,
} from '../redux/searchSupplier';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { changeAmountBillItem } from '../redux/billItems';
import {
  getBillDataRequest,
  printNCByNumRequest,
  printNCPresByNumRequest,
  rePrintPresRequest,
} from '../request/orderRequest';
import { getBillByIdRequest } from '../request/billRequest';
import { billHtml } from '../templates/bill';
import { convertImageToBase64 } from '../utils';
import logoAfip from '../assets/afip/logo-vector-afip.jpg';
import logoBlase from '../assets/logo/logoBlase.png';
import { remitHtml } from '../templates/RemBlase';
import { presupHtml } from '../templates/presupBlase';
import { ncAHtml } from '../templates/ncA';
import { ncPresupHtml } from '../templates/ncPresupBlase';

function RoleTableContainer(props) {
  const [printLoading, setPrintLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = (id, type) => {
    const text =
      type !== 'repSupplier'
        ? 'Vas a cambiar el estado de un usuario'
        : 'Vas a cambiar el estado de un representante';
    const confirmButtonText =
      type !== 'repSupplier' ? 'Si, actualizar' : 'Si, actualizar';
    Swal.fire({
      title: 'Estas seguro?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        switch (type) {
          case 'seller':
            dispatch(UpdateStatusSellerRequest(id)).then(() => {
              Swal.fire({
                title: 'Actualizado!',
                text: 'Has cambiado el estado exitosamente',
                icon: 'success',
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 1000,
              });
            });
            break;
          case 'client':
            dispatch(UpdateStatusClientRequest(id)).then(() => {
              Swal.fire({
                title: 'Actualizado!',
                text: 'Has cambiado el estado exitosamente',
                icon: 'success',
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 1000,
              });
            });
            break;
          case 'supplier':
            dispatch(UpdateStatusSupplierRequest(id)).then(() => {
              Swal.fire({
                title: 'Actualizado!',
                text: 'Has cambiado el estado exitosamente',
                icon: 'success',
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 1000,
              });
            });
            break;
          case 'repSupplier':
            dispatch(DeleteRepSupplierRequest(id)).then(() => {
              Swal.fire({
                title: 'Actualizado!',
                text: 'Has cambiado el estado exitosamente',
                icon: 'success',
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 1000,
              });
            });
            break;
          default:
            console.log('El valor no coincide con ningún caso');
        }
      }
    });
  };
  const viewAcount = (acountId, type) => {
    navigate(`/search/acount/${type}/${acountId}`);
  };

  const handleChangeCantNC = (event, id) => {
    const newValue = event.target.value;
    dispatch(changeAmountBillItem({ amount: newValue, itemId: id }));
  };

  const ncRePrint = async (nc) => {
    setPrintLoading(true);
    const { currentAcountId, numComprobante, billType } = nc;
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);
    if (billType == 1 || billType == 8 || billType == 3) {
      const ncData = await printNCByNumRequest(numComprobante, currentAcountId);
      const ncDetail = await getBillByIdRequest(nc.id);
      const items = ncDetail.ncOrderItems;
      const client = ncDetail.currentAcount.client;

      const codigoQR = await QRCode.toDataURL(ncData.url);

      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(items.length / itemsPerPage);
      let nuevaVentana = window.open('', '', 'width=900,height=1250');

      for (
        let i = 0;
        i < (items.length == 0 ? 1 : items.length);
        i += itemsPerPage
      ) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems =
          items?.length > 0 ? items.slice(i, i + itemsPerPage) : [];

        const render = ncAHtml(
          ncData.billData.ResultGet,
          client,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          nc.concept
        );

        const containerFact = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerFact);

        containerFact.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    if (billType == 2) {
      const presData = await printNCPresByNumRequest(numComprobante);
      const client = presData.currentAcount?.client;

      const items = presData.ncOrderItems;
      const itemsPerPage = 10; // Número de ítems por página
      const totalPages =
        Math.ceil(items?.length / itemsPerPage) > 0
          ? Math.ceil(items?.length / itemsPerPage)
          : 1;

      for (
        let i = 0;
        i < (items.length > 0 ? items.length : 1);
        i += itemsPerPage
      ) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = items?.slice(i, i + itemsPerPage);

        const render = ncPresupHtml(
          presData,
          client,
          pageItems,
          pageNumber,
          totalPages,
          logoBlaseBase64,
          presData.concept
        );

        const nuevaVentana = window.open('', '', 'width=900,height=1250');
        const containerPres = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    setPrintLoading(false);
  };

  const rePrint = async (bill) => {
    console.log(bill);
    setPrintLoading(true);
    let purchaseOrder;
    let numRemito;
    const logoAfipBase64 = await convertImageToBase64(logoAfip);
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);
    const { billType, numComprobante, id } = bill;

    let nuevaVentana;
    //FACTURA A
    if (billType == 1 || billType == 6) {
      const billData = await getBillDataRequest(numComprobante, billType);
      numRemito = billData.billData.ResultGet.CbteDesde;
      const billInfo = await getBillByIdRequest(id);
      const { fItems } = billInfo;
      purchaseOrder = billInfo.purchaseOrder;
      const codigoQR = await QRCode.toDataURL(billData.url);

      const factItems = fItems;
      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(factItems.length / itemsPerPage);
      nuevaVentana = window.open('', '', 'width=900,height=1250');

      // Primero imprimimos las facturas
      for (let i = 0; i < factItems.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = factItems.slice(i, i + itemsPerPage);

        const render = await billHtml(
          billData.billData.ResultGet,
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

        // Agregar el contenido generado a la ventana
        nuevaVentana.document.body.appendChild(containerFact);

        // Si no es la última página, agregar un salto de página
        if (pageNumber < totalPages) {
          const pageBreak = nuevaVentana.document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always'; // Salto de página después del contenido
          nuevaVentana.document.body.appendChild(pageBreak);
        }
      }
    }
    //PRESUPUESTO
    if (billType == 0) {
      const presData = await rePrintPresRequest(bill.id);
      purchaseOrder = presData.purchaseOrder;
      // console.log(presData);

      numRemito = purchaseOrder.pickingOrder.numRemito;

      const factPresItems = purchaseOrder.purchaseOrderItems.filter(
        (poi) => !poi.fact
      );

      const itemsPerPage = 10; // Número de ítems por página
      const totalPresPages = Math.ceil(factPresItems.length / itemsPerPage);

      nuevaVentana = window.open('', '', 'width=900,height=1250');

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
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
      // nuevaVentana.document.body.appendChild(
      //   nuevaVentana.document.createElement("div")
      // ).style.pageBreakBefore = "always";
    }

    // Después imprimimos los remitos
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
        logoBlaseBase64
      );

      nuevaVentana.document.body.appendChild(containerRem);

      // Si no es la última página, agregar un salto de página
      if (pageNumber < totalRemPages) {
        const pageBreak = nuevaVentana.document.createElement('div');
        pageBreak.style.pageBreakAfter = 'always'; // Salto de página después del contenido
        nuevaVentana.document.body.appendChild(pageBreak);
      }
    }
    setPrintLoading(false);
  };

  return (
    <RoleTableComponent
      {...props}
      rePrint={rePrint}
      statusToogle={alert}
      viewAcount={viewAcount}
      handleChangeCantNC={handleChangeCantNC}
      printLoading={printLoading}
      ncRePrint={ncRePrint}
    />
  );
}

export default RoleTableContainer;
