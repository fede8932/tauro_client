import {
  billDateTostringDate,
  fechaConverter,
  formatFactDate,
  formatNumberWithLeadingZeros,
  redondearADosDecimales,
} from '../utils';

export const ncPresupHtml = (
  movimentData,
  client,
  products,
  pageNumber,
  totalPages,
  logoBlaseBase64,
  descrip
) => {
  const des = descrip
    ? {
        product: { article: '0001', description: descrip },
        amount: '1',
        sellPrice: '-',
      }
    : {};
  const list = products.length > 0 ? products : [des];
  const lista = list.map((item) => {
    return `<tr>
              <td>${item?.product?.article}</td>
              <td class="descrip">${item?.amount}</td>
              <td class="descrip">${item?.product?.description?.substring(
                0,
                45
              )}</td>
              <td>$${redondearADosDecimales(item?.sellPrice)}</td>
              <td>$${
                item?.sellPrice != '-'
                  ? redondearADosDecimales(item?.amount * item?.sellPrice)
                  : redondearADosDecimales(movimentData.total)
              }</td>
            </tr>`;
  });

  function convertirAFechaDDMMYYYY(fechaISO) {
    const fecha = new Date(fechaISO);
    
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const año = fecha.getUTCFullYear();

    return `${dia}-${mes}-${año}`;
}

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Factura</title>
      <style type="text/css">
        * {
          box-sizing: border-box;
          -webkit-user-select: none; /* Chrome, Opera, Safari */
          -moz-user-select: none; /* Firefox 2+ */
          -ms-user-select: none; /* IE 10+ */
          user-select: none; /* Standard syntax */
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
          border: 2px solid black;
          font-size: 30px;
          letter-spacing:-1;
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
          height: 175px;
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
          font-size: 23px;
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
          height: 185px;
          border: 1px solid black;
          margin: 10px 0px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
        }
        .tableContainer {
          width: 100%;
          height: 520px;
        }
        .afipDataDosContainer {
          width: 100%;
          border-top: 2px solid black;
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
          padding: 8px;
          text-align: center;
      }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <div class="leftCont">
          <div class="dataEmisor">
            <img class="logo" src="${logoBlaseBase64}" alt="logo" />
            <div class="infoEminContainer">
              <span class="infoEmisTex">Tel: 11 7619-9643</span>
              <span class="infoEmisTex">ventas@tauroparts.shop</span>
            </div>
          </div>
          <div class="factCode">
            <div class="tipeFact">NCP</div>
            <span class="cod">No valido como factura</span>
          </div>
        </div>
        <div class="dataFact">
          <div class="factCont">
            <div class="hojaCont">
              <span>DEVOLUCIÓN</span>
              <span>HOJA ${pageNumber} DE ${totalPages}</span>
            </div>
            <div class="numberFact"><span>${formatNumberWithLeadingZeros(
              movimentData.numComprobante,
              8
            )}</span></div>
          </div>
          <div class="fechaFact">FECHA: ${convertirAFechaDDMMYYYY(
            movimentData.fecha
          )}</div>
          <div class="datFisc">
          </div>
        </div>
      </div>
      <div class="clientContainer">
        <div class="ivaClient">
          <span class="clientInfoText">Razon Social: <span class="clientInfoTextDos">${
            client.razonSocial
          }</span></span>
          <span class="clientInfoText">Teléfono: <span class="clientInfoTextDos">${
            client.telefono
          }</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Dirección<span class="clientInfoTextDos">${`${client.calle} ${client.altura}, ${client.localidad}`}</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">IVA:<span class="clientInfoTextDos">${`IVA ${client.iva}`}</span></span>
          <span class="clientInfoText">CUIT:<span class="clientInfoTextDos">${
            client.cuit
          }</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Condición de venta:<span class="clientInfoTextDos">Productos</span></span>
          <span class="clientInfoText">N° Remito:<span class="clientInfoTextDos"></span></span>
        </div>
      </div>
      </div>
      <div class="tableContainer">
          <table class="table">
              <tr class="header">
                  <th>CODIGO</th>
                  <th>CANT.</th>
                  <th>DESCRIPCION</th>
                  <th>PRECIO UNIT.</th>
                  <th>IMPORTE</th>
              </tr>
              ${lista}
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
            >SUBTOTAL<span class="pesosSpan"></span>${redondearADosDecimales(
              movimentData.total
            )}</span
          >
          <span class="pesosSpanCont"
            >IVA 21%<span class="pesosSpan"></span>0</span
          >
          <span class="pesosSpanCont"
            >IVA 10.5%<span class="pesosSpan"></span>$0</span
          >
          <span class="pesosSpanCont"
            >TOTAL<span class="pesosSpan"></span>${redondearADosDecimales(
              movimentData.total
            )}</span
          >
        </div>
      </div>
    </body>
  </html>
  `;
};
