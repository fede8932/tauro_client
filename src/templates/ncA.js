import {
  formatFactDate,
  formatNumberWithLeadingZeros,
  redondearADosDecimales,
} from '../utils';
import logoAfip from '../assets/afip/logo-vector-afip.jpg';
import logoBlase from '../assets/logo/logoBlase.png';

export const ncAHtml = (
  billData,
  client,
  qr,
  products,
  pageNumber,
  totalPages,
  concept
) => {
  // console.log("order --->", order);
  // console.log(qr);
  const lista = products.map((item) => {
    return `<tr>
              <td>${item?.product?.article}</td>
              <td class="descrip">${item?.amount}</td>
              <td class="descrip">${item?.product?.description.substring(
                0,
                45
              )}</td>
              <td>$${item?.sellPrice}</td>
              <td>$${redondearADosDecimales(
                item?.amount * item?.sellPrice
              )}</td>
            </tr>`;
  });

  function formatDate(value) {
    // Convertir a string en caso de ser número
    let str = value.toString();

    // Verificar que tenga 8 caracteres (YYYYMMDD)
    if (str.length !== 8) {
        throw new Error("El valor debe tener el formato AAAAMMDD");
    }

    const year = str.slice(0, 4);
    const month = str.slice(4, 6);
    const day = str.slice(6, 8);

    return `${day}-${month}-${year}`;
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
        .descrip {
          font-size: 10px;
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
          align-items: flex-start;
        }
        .dataFact {
          width: 340px;
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
          font-size: 18px;
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
            <img class="logo" src=${logoBlase} alt="logo">
            <div class="infoEminContainer">
              <span class="infoEmisTex">Tel: 11 7619-9643</span>
              <span class="infoEmisTex">ventas@tauroparts.shop</span>
            </div>
          </div>
          <div class="factCode">
            <div class="tipeFact">${billData.CbteTipo == 3 ? 'A' : 'B'}</div>
            <span class="cod">Código N°: 0${billData.CbteTipo}</span>
          </div>
        </div>
        <div class="dataFact">
          <div class="factCont">
            <div class="hojaCont">
              <span>NOTA DE CRÉDITO</span>
              <span>HOJA ${pageNumber} DE ${totalPages}</span>
            </div>
            <div class="numberFact"><span>${formatNumberWithLeadingZeros(
              billData.CbteDesde,
              8
            )}</span></div>
          </div>
          <div class="fechaFact">FECHA:${formatDate(billData.CbteFch)}</div>
          <div class="datFisc">
            <p>C.U.I.T:<span>20164364837</span></p>
            <p>IIBB:<span>20164364837</span></p>
            <p>Inicio de actividades:<span>10/01/1992</span></p>
          </div>
        </div>
      </div>
      <div class="clientContainer">
          <span class="clientInfoText">Razon Social: <span class="clientInfoTextDos">${
            client.razonSocial
          }</span></span>
          <span class="clientInfoText">Dirección<span class="clientInfoTextDos">${`${client.calle} ${client.altura}, ${client.localidad}`}</span></span>
        <div class="ivaClient">
          <span class="clientInfoText">IVA:<span class="clientInfoTextDos">${`IVA ${client.iva}`}</span></span>
          <span class="clientInfoText">CUIT:<span class="clientInfoTextDos">${
            client.cuit
          }</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Condición de venta:<span class="clientInfoTextDos">Productos</span></span>
          <span class="clientInfoText">N° Remito:<span class="clientInfoTextDos">${formatNumberWithLeadingZeros(
            billData.CbteDesde,
            8
          )}</span></span>
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
              ${!concept ? lista : null}
              ${
                concept
                  ? `<tr>
                    <td>DEV-0001</td>
                    <td class="descrip">1</td>
                    <td class="descrip">
                      ${concept?.substring(0, 55)}
                    </td>
                    <td>$${redondearADosDecimales(billData.ImpNeto * 1.21)}</td>
                    <td>
                      $${redondearADosDecimales(billData.ImpNeto * 1.21)}
                    </td>
                  </tr>`
                  : null
              }
       </table>
      </div>
      <div class="afipDataDosContainer">
        <div class="afipDataDosContainerLeft">
          <div class="imgLogQr">
            <img class="qr" src=${qr} alt="qr">
            <div>
              <img
                class="logoAfip"
                src=${logoAfip}
                alt="logo-afip"
              >
              <div class="dataCae">
                <span>Comprobante autorizado</span>
                <span>CAE: ${billData.CodAutorizacion}</span>
                <span>Vto. CAE: ${formatFactDate(billData.FchVto)}</span>
              </div>
            </div>
          </div>
          <span class="libreDeResp"
            >Esta administración Federal no se reponsabiliza por los datos
            ingesados en el detallle de la opeación.</span
          >
        </div>
        <div class="totalCont">
          <span class="pesosSpanCont"
            >SUBTOTAL<span class="pesosSpan"></span>${redondearADosDecimales(
              billData.ImpNeto
            )}</span
          >
          <span class="pesosSpanCont"
            >IVA 21%<span class="pesosSpan"></span>${redondearADosDecimales(
              billData.ImpNeto * 0.21
            )}</span
          >
          <span class="pesosSpanCont"
            >IVA 10.5%<span class="pesosSpan"></span>$0</span
          >
          <span class="pesosSpanCont"
            >TOTAL<span class="pesosSpan"></span>${redondearADosDecimales(
              billData.ImpNeto * 1.21
            )}</span
          >
        </div>
      </div>
    </body>
  </html>
  `;
};
