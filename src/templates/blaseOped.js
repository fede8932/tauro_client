import { fechaConverter } from '../utils';

export const nPedHtml = (pickingOrder, pag, pages, items, type) => {
  const itemsHtml = items
    .map(
      (item) => `
    <tr class="tBody">
      <td>${item.product.article}</td>
      <td>${item.product.location}</td>
      <td>${item.amount}</td>
      <td class="tdBody">${item.product.brand.name.substring(0, 12)}</td>
      <td class="descrip"> ${item.product.description.substring(0, 82)}</td>
    </tr>
  `
    )
    .join('');
  // Agrega un salto de página antes de cada nueva sección de contenido, excepto la última
  const pageBreak = pag < pages ? '<div class="page-break"></div>' : '';

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Pedido</title>
      <style type="text/css">
        * {
          box-sizing: border-box;
          -webkit-user-select: none; /* Chrome, Opera, Safari */
          -moz-user-select: none; /* Firefox 2+ */
          -ms-user-select: none; /* IE 10+ */
          user-select: none; /* Standard syntax */
        }
        .page-break {
          page-break-before: always; /* Salto de página antes de este elemento */
        }
        .no-page-break {
          page-break-inside: avoid; /* Evita saltos de página dentro de este elemento */
        }
        body {
          width: 800px;
          height: 1100px;
        }
        .encabezado {
          display: flex;
          width: 100%;
          justify-content: space-between;
        }
        .logo {
          width: 225px;
        }
        .infoEminContainer {
          display: flex;
          flex-direction: column;
          width: 225px;
          align-items: center;
          padding-left: 15px;
        }
        .infoEmisTex {
          width: 100%;
        }
        .tipeFact {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          font-size: 50px;
          font-weight: 600;
        }
        .cod {
          font-size: 12px;
          display: flex;
          justify-content: center;
        }
        .factCode {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dataFact {
          width: 310px;
          height: 90px;
          border: 2px solid black;
        }
        .leftCont {
          width: 50%;
          display: flex;
          justify-content: space-between;
        }
        .factCont {
          border-bottom: 2px solid black;
        }
        .hojaCont {
          font-size: 15px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
        }
        .numberFact {
          display: flex;
          justify-content: center;
          font-size: 21px;
          font-weight: 600;
        }
        .fechaFact {
          border-bottom: 2px solid black;
          font-size: 19px;
          font-weight: 500;
        }
        .dataFact p {
          margin: 0px;
          margin-bottom: 7px;
        }
        .dataFact span {
          margin: 0px;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .datFisc {
          margin-top: 2px;
        }
        .clientContainer {
          width: 100%;
          height: 75px;
          border: 1px solid black;
          margin: 10px 0px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
        }
        .tableContainer {
          width: 100%;
          height: 800px;
        }
        .afipDataDosContainer {
          width: 100%;
          padding: 10px;
          display: flex;
        }
        .qr {
          width: 160px;
          height: 160px;
        }
        .libreDeResp {
          font-size: 10px;
        }
        .afipDataDosContainerLeft {
          width: 67%;
        }
        .logoAfip {
          width: 185px;
          margin-top: -9px;
        }
        .imgLogQr {
          display: flex;
        }
        .dataCae {
          display: flex;
          flex-direction: column;
          margin-left: 15px;
          height: 80px;
          justify-content: space-between;
          margin-top: -15px;
        }
        .totalCont {
          width: 33%;
          margin-top: 35px;
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
        }
        .pesosSpanCont {
          font-size: 17px;
          font-weight: 500;
        }
        .pesosSpan {
          margin-left: 15px;
          font-weight: 600;
        }
        .ivaClient{
          width: 100%;
          display: flex;
        }
        .clientInfoText{
          width: 100%;
          font-size: 18px;
        }
        .clientInfoTextDos{
          font-weight: 600;
          margin-left: 10px;
        }
      table {
          width: 100%;
          border-collapse: collapse;
      }
      th, td {
          border: 1px solid black;
          padding: 9px;
          text-align: center;
      }
      .header{
        font-size: 9px;
      }
      .headerCode{
        width: 10%;
      }
      .headerDesc{
        width: 61%;
      }
      .headerAmount{
        width: 6%;
      }
      .headerLocat{
        width: 8%;
      }
      .headerBrand{
        width: 15%;
      }
      .tBody{
        font-size: 13px;
        height: 7px;
      }
      .tdBody{
        font-size: 9px;
      }
      .descrip{
        font-size: 9px;
      }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <div class="leftCont">
          <div class="dataEmisor">
            <img class="logo" src="../assets//logo/logoBlase.png" alt="logo" />
            <div class="infoEminContainer">
              <span class="infoEmisTex">Don Bosco 2175, Morón. CP: 1708</span>
              <span class="infoEmisTex">4460-5972</span>
            </div>
          </div>
          <div class="factCode">
            <div class="tipeFact">${type}</div>
            <span class="cod">No valido como factura</span>
          </div>
        </div>
        <div class="dataFact">
          <div class="factCont">
            <div class="hojaCont">
              <span>NOTA DE PEDIDO</span>
              <span>HOJA ${pag} DE ${pages}</span>
            </div>
            <div class="numberFact"><span>${pickingOrder.id}</span></div>
          </div>
          <div class="fechaFact">FECHA: ${fechaConverter(
            pickingOrder.createdAt
          )}</div>
        </div>
      </div>
      <div class="clientContainer">
        <div class="ivaClient">
          <span class="clientInfoText">Cliente: <span class="clientInfoTextDos">${
            pickingOrder.purchaseOrder.client.razonSocial
          }</span></span>
          <span class="clientInfoText">Vendedor: <span class="clientInfoTextDos">${
            pickingOrder.purchaseOrder.client.seller?.user?.name +
            ' ' +
            pickingOrder.purchaseOrder.client.seller?.user?.lastName
          }</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Responsable de pedido:<span class="clientInfoTextDos">________________________________</span></span>
        </div>
          <span class="clientInfoText">Orden de venta: <span class="clientInfoTextDos">${
            pickingOrder.purchaseOrder.numero
          }</span></span>
      </div>
      </div>
      <div class="tableContainer">
          <table class="table">
              <tr class="header">
                  <th class="headerCode">CODIGO</th>
                  <th class="headerLocat">LOCALIZACIÓN</th>
                  <th class="headerAmount">CANT.</th>
                  <th class="headerBrand">MARCA</th>
                  <th class="headerDesc">DESCRIPCION</th>
              </tr>
              ${itemsHtml}
       </table>
      </div>
      <div class="afipDataDosContainer">
        <div class="afipDataDosContainerLeft">
          <div class="imgLogQr">
            <div>
              <div class="dataCae">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <span class="libreDeResp"
          >
        </div>
        <div class="totalCont">
          <span class="pesosSpanCont"
            >Firma responsable:<span class="pesosSpan"></span>_________________________________________________</span
          >
        </div>
      </div>
      <script>
        // setInterval(function() {
        //   location.reload(); // Refresca la página
        // }, 2500); // 5000 milisegundos = 5 segundos
      </script>
    </body>
    ${pageBreak}
  </html>
  `;
};
