import {
  convertirFechaISOaDDMMYYYY,
  formatearFecha,
  redondearADosDecimales,
} from '../utils';
import logoBlase from '../assets/logo/logoBlase.png';

export const comitionResume = (resume, items, page, pages) => {
  // console.log(resume);
  const lista = items.map((item) => {
    return `<tr>
              <td>${convertirFechaISOaDDMMYYYY(item?.fecha)}</td>
              <td class="descrip">${item?.cliente}</td>
              <td>${item?.concepto}</td>
              <td>$ ${redondearADosDecimales(item?.monto)}</td>
              <td>$ ${redondearADosDecimales(item?.comision)}</td>
            </tr>`;
  });
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
          width: 310px;
          height: 135px;
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
          height: 100px;
          border: 1px solid black;
          margin: 10px 0px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
        }
        .tableContainer {
          width: 100%;
          height: 795px;
        }
        .afipDataDosContainer {
          width: 100%;
          border-top: 2px solid black;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: end;
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
              <span class="infoEmisTex">De Blase Distribuidora</span>
              <span class="infoEmisTex">Don Bosco 2175, Morón. CP: 1708</span>
              <span class="infoEmisTex">4460-5972</span>
              <span class="infoEmisTex">ventas@blasedistribuidora.com</span>
            </div>
          </div>
          <div class="factCode">
          </div>
        </div>
        <div class="dataFact">
          <div class="factCont">
            <div class="hojaCont">
              <span>COMISIONES</span>
              <span>${`${page} De ${pages}`}</span>
            </div>
          </div>
          <div class="fechaFact">FECHA:${formatearFecha(new Date())}</div>
          <div class="datFisc">
          <p>C.U.I.T:<span>20164364837</span></p>
          </div>
        </div>
      </div>
      <div class="clientContainer">
          <span class="clientInfoText">Vendedor: <span class="clientInfoTextDos">${`${resume.seller.user.name} ${resume.seller.user.lastName}`}</span></span>
          <span class="clientInfoText">Dirección<span class="clientInfoTextDos">${`${resume.seller.calle} ${resume.seller.altura}, ${resume.seller.localidad}`}</span></span>
        <div class="ivaClient">
          <span class="clientInfoText">CUIL:<span class="clientInfoTextDos">${
            resume.seller.cuil
          }</span></span>
        </div>
      </div>
      </div>
      <div class="tableContainer">
          <table class="table">
              <tr class="header">
                  <th>FECHA</th>
                  <th>CLIENTE</th>
                  <th>CONCEPTO</th>
                  <th>SUBTOTAL</th>
                  <th>COMISION</th>
              </tr>
              ${lista}
              
       </table>
      </div>
      <div class="afipDataDosContainer">
        <div><span>Total vendido: <span>$ ${redondearADosDecimales(
          resume.subTotal
        )}</span></span></div><div><span>Total comision: <span>$ ${redondearADosDecimales(
          resume.comision
        )}</span></span></div>
      </div>
    </body>
  </html>
  `;
};
