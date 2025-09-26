import logo from '../assets/logo/logoBlase.png';
import { fechaConverter } from '../utils';

export const clientReport = (data, items, page, pages) => {
  function convertirFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }
  function formatoNumero(valor) {
    // Convertimos el valor a un número de punto flotante con dos decimales
    const numero = parseFloat(valor).toFixed(2);

    // Separamos la parte entera de la parte decimal
    let [entero, decimales] = numero.split('.');

    // Agregamos puntos de miles (millones, miles, cientos)
    entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retornamos el número en el formato solicitado
    return `${entero},${decimales}`;
  }
  const { saldo, client } = data;
  const lista = items.map((item) => {
    // console.log(item);
    let concep = '';
    if (item.type == 0) {
      //type = 0 es factura o presupuesto
      if (item.billType == 0) {
        //billType = 0 es presupuesto
        concep = 'Presupuesto';
      }
    }
    if (item.type == 0) {
      //type = 0 es factura o presupuesto
      if (item.billType != 0) {
        //billType = 0 es presupuesto
        concep = 'Factura';
      }
    }
    if (item.type == 1) {
      //type = 1 es nc oficial
      concep = 'Nota de crédito';
    }
    if (item.type == 3) {
      //type = 1 es nc oficial
      concep = 'Nota de crédito X';
    }
    return `<tr>
              <td>${convertirFecha(item?.fecha)}</td>
              <td class="descrip">${item?.numComprobante}</td>
              <td class="descrip">${concep}</td>
              <td class="descrip">${formatoNumero(item?.total)}</td>
              <td>$${item?.saldoPend? `${formatoNumero(item?.saldoPend)} ${item?.saldoPend == item?.total ? "" : "(P)"}` : formatoNumero(item?.total)}</td>
            </tr>`;
  });
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Resumen</title>
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
          align-items: center;
        }
        .dataFact {
          width: 310px;
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
          height: 45px;
          border-bottom: 1px solid black;
          margin: 10px 0px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
        }
        .tableContainer {
          width: 100%;
          height: 810px;
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
          margin-top: 55px;
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
            <img class="logo" src=${logo} alt="logo" />
            <div class="infoEminContainer">
              <span class="infoEmisTex">De Hernan Blasevich</span>
              <span class="infoEmisTex">Don Bosco 2175, Morón. CP: 1708</span>
            </div>
          </div>
          <div class="factCode">
          </div>
        </div>
        <div class="dataFact">
          <div class="factCont">
            <div class="hojaCont">
              <span>RESUMEN DE CLIENTE</span>
            </div>
            <div class="numberFact"></div>
          </div>FECHA: ${fechaConverter(new Date())}
        </div>
      </div>
      <div class="clientContainer">
        <div class="ivaClient">
          <span class="clientInfoText">Razon Social: <span class="clientInfoTextDos">${
            client?.razonSocial
          }</span></span>
          <span class="clientInfoText">CUIT:<span class="clientInfoTextDos">${
            client?.cuit
          }</span></span>
          <span class="clientInfoText">IVA:<span class="clientInfoTextDos">${
            client?.iva
          }</span></span>
        </div>
      </div>
      </div>
      <div class="tableContainer">
          <table class="table">
              <tr class="header">
                  <th>FECHA</th>
                  <th>COMPROBANTE</th>
                  <th>CONCEPTO</th>
                  <th>IMPORTE</th>
                  <th>PENDIENTE</th>
              </tr>
              ${lista}
       </table>
      </div>
      <div class="afipDataDosContainer">
        <div class="afipDataDosContainerLeft">
          <span class="libreDeResp"
          >Página ${page} de ${pages}</span>
        </div>
        <div class="totalCont">
          <span class="pesosSpanCont"
            >TOTAL ADEUDADO:<span class="pesosSpan"></span>$${formatoNumero(
              saldo
            )}</span
          >
        </div>
      </div>
    </body>
  </html>
  `;
};
