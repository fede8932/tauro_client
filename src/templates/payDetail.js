import { redondearADosDecimales } from '../utils';

export const payDetail = (client, payData, logo) => {
  const {
    bancoCH,
    bancoTR,
    comprobanteVendedor,
    fechaCH,
    fechaCobro,
    montoCH,
    montoEF,
    montoTR,
    numCheque,
    numOperation,
  } = payData;

  function formatDates(input) {
    // Divide la cadena en las dos fechas
    const dates = input.split('|');

    // Convierte cada fecha al formato "dd-MM-yyyy"
    const formattedDates = dates.map((date) => {
      const d = new Date(date); // Crea un objeto Date
      const day = String(d.getDate()).padStart(2, '0'); // Día con 2 dígitos
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos
      const year = d.getFullYear(); // Año
      return `${day}-${month}-${year}`;
    });

    // Une las fechas formateadas con "|"
    return formattedDates.join('|');
  }
  function isoToDdMmAaaa(isoString) {
    const fecha = new Date(isoString);
    const dia = fecha.getDate().toString().padStart(2, '0'); // Obtiene el día y agrega un 0 si es necesario
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript van de 0 a 11, por eso sumamos 1
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }
  function obtenerFechaHoy() {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    const anio = hoy.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Detalle_de_Pago</title>
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
          height: 610px;
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
          width: 315px;
          height: 110px;
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
          font-size: 20px;
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
          /* height: 135px; */
          border: 1px solid black;
          margin: 10px 0px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
        }
        .tableContainer {
          width: 100%;
          height: 570px;
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
          <img class="logo" src="${logo}" alt="logo" />
            <div class="infoEminContainer">
              <span class="infoEmisTex">De Hernan Blasevich</span>
              <span class="infoEmisTex">Don Bosco 2175, Morón. CP: 1708</span>
            </div>
          </div>
          <div class="factCode">
            <div class="tipeFact">DP</div>
            <span class="cod">No valido como factura</span>
          </div>
        </div>
        <div class="dataFact">
          <div class="factCont">
            <div class="hojaCont">
              <span>DETALLE DE PAGO:</span><span>${payData?.id}</span>
            </div>
            <div class="numberFact"></div>
          </div>
          <div class="fechaFact">FECHA:${obtenerFechaHoy()}</div>
        </div>
      </div>
      <div class="clientContainer">
        <div class="ivaClient">
          <span class="clientInfoText">Cliente: <span class="clientInfoTextDos">${
            client.razonSocial
          }</span></span>
          <span class="clientInfoText">CUIT: <span class="clientInfoTextDos">${
            client.cuit
          }</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Comprobante de Vdor<span class="clientInfoTextDos">${
            comprobanteVendedor
          }</span></span>
          <span class="clientInfoText">Efectivo: <span class="clientInfoTextDos">${montoEF}</span></span>
        </div>
        <div class="ivaClient">
        <span class="clientInfoText">Banco Transf:<span class="clientInfoTextDos">${bancoTR}</span></span>
          <span class="clientInfoText">Monto Transf:<span class="clientInfoTextDos">${montoTR}</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Núm de operación: <span class="clientInfoTextDos">${numOperation}</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Fecha de cheques: <span class="clientInfoTextDos">${formatDates(fechaCH)}</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Fechas de cobro: <span class="clientInfoTextDos">${formatDates(fechaCobro)}</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Núm de cheques: <span class="clientInfoTextDos">${numCheque}</span></span>
        </div>
        <div class="ivaClient">
        <span class="clientInfoText">Banco de cheque:<span class="clientInfoTextDos">${bancoCH}</span></span>
          <span class="clientInfoText">Monto cheque:<span class="clientInfoTextDos">${montoCH}</span></span>
        </div>
        <div class="ivaClient">
          <span class="clientInfoText">Total:<span class="clientInfoTextDos">$${redondearADosDecimales(
            montoEF + montoTR + montoCH
          )}</span></span>
          <span class="clientInfoText">Responsable:<span class="clientInfoTextDos">_______________________________</span></span>
        </div>
      </div>
      </div>
      <!-- <script>
        setTimeout(()=>{window.location.reload()}, 3500)
      </script> -->
    </body>
  </html>
  `;
};
