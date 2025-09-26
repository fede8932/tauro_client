import logo from '../assets/afip/logo-vector-afip.jpg';

export const billHtml = () => {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Factura</title>
    <style type="text/css">
    * {
      box-sizing: border-box;
      -webkit-user-select: none; /* Chrome, Opera, Safari */
      -moz-user-select: none; /* Firefox 2+ */
      -ms-user-select: none; /* IE 10+ */
      user-select: none; /* Standard syntax */
    }
    body{
      font-family: sans-serif;
      font-size: 13px;
    }
    .encabezado{
      font-size: 28px;
      width: 100%;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid black;
      margin-bottom: -24px;
    }
    .vendedorContainer{
      width: 100%;
      display: flex;
      margin-top: 30px;
      flex-direction: column;
    }
    .typeFactContainer{
      width: 100%;
      height: 55px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0px;
    }
    .typeFact{
      font-size: 48px;
      border: 1px solid black;
      width: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 20;
      background-color: white;
    }
    .typeText{
      font-size: 11px;
    }
    .vendedorFactContainer{
      width: 100%;
      margin-top: -55px;
      display: flex;
    }
    .vendedorFact{
      width: 50%;
      height: 190px;
      border: 1px solid black;
      margin-top: -7px;
      padding-top: 20px;
    }
    .rsTitleContainer{
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .typeCompContainer{
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .rsTitle{
      font-size: 20px;
      height: 45px;
      width: 70%;
      text-align: center;
    }
    .comprobanteType{
      font-size: 30px;
      width: 80%;
    }
    .vendedorFactLeft{
      margin: 0px 10px 10px 10px;
    }
    .vendedorFactRight{
      width: 90%;
      margin: 0px 10px 10px 10px;
    }
    .datosVendedorLeft{
      width: 95%;
      padding: 0px 0px 0px 19px;
    }
    .datosVendedorRigth{
      width: 95%;
      padding: 0px 0px 0px 49px;
    }
    .infoVend{
      font-size: 14px;
      padding: 0px;
      margin-bottom: 5px;
    }
    .infoVendedor{
      font-size: 14px;
      margin: 0px;
      padding: 0px;
      margin-bottom: 8px;
    }
    .infoFechaFact{
      font-size: 14px;
      margin: 0px;
      padding: 0px;
    }
    .ptovtaComp{
      display: flex;
      justify-content: space-between;
      margin: 0px;
      padding: 0px;
    }
    .periodoContainer{
      width: 100%;
      height: 32px;
      border: 1px solid black;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 3px 0px;
      padding: 0px 5px;
    }
    .clientDataContainer{
      width: 100%;
      border: 1px solid black;
      height: 95px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding: 0px 10px;
      margin-bottom: 3px;
    }
    .dataClient{
      display: flex;
      justify-content: space-between;
    }
    .extraP{
      width: 39%;
    }
    .referenciasContainer{
      width: 100%;
      border: 1px solid black;
      height: 56px;
    }
    .referencia{
      width: 100%;
      border-bottom: 1px solid black;
      height: 27px;
      display: flex;
      align-items: center;
      padding: 0px 10px;
    }
    .columns{
      width: 100%;
      background-color: grey;
      height: 27px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 10px;
    }
    .dataVentaContainer{
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0px 10px;
    }
    .calcTotalCont{
      width: 100%;
      height: 235px;
      border: 1px solid black;
      margin-top: 275px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .afipInfoContainer{
      width: 100%;
      height: 135px;
      margin-top: 10px;
      padding: 0px 10px;
      display: flex;
      justify-content: space-between;
    }
    .caeContainer{
      width: 30%;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .logo{
      position: absolute;
      z-index: -10;
    }
    .logoText{
      margin-top: 55px;
      margin-left: 20px;
    }
    .titleText{
      font-size: 20px;
      margin: 0;
      padding-top: 10px;
    }
    .mjeText{
      font-size: 12px;
      margin: 0px;
      padding: 0px;
    }
    .calcTotalContUp{
      width: 100%;
      display: flex;
      margin-top: 25px;
    }
    .calcTotalContUpLeft{
      width: 60%;
    }
    .calcTotalContRigth{
      width: 40%;
      display: flex;
      justify-content: space-between;
    }
    .titleTableVert{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .textTribContainer{
      margin-right: 15px;
    }
    .textTrib{
      margin: 0px;
      padding: 0px;
    }
    .calcTotalContDown{
      width: 99.2%;
      margin: 3px;
      height: 28px;
      border: 1px solid black;
    }
    .calcTotalContDown{
      display: flex;
      justify-content: space-between;
      padding: 0px 10px;
      align-items: center;
    }
    .textTotalCalc{
      margin: 0px;
      padding: 0px;
    }
    </style>
  </head>
  <body>
    <div class="encabezado" >ORIGINAL</div>
    <div class="vendedorContainer">
      <div class="typeFactContainer">
        <div class="typeFact">A
        <span class="typeText">COD. 01</span>
        </div>
      </div>
      <div class="vendedorFactContainer">
        <div class="vendedorFact">
          <div class="vendedorFactLeft">
            <div class="rsTitleContainer">
              <span class="rsTitle">BLASEVICH HERNAN OSVALDO</span></div>
            </div>
            <div class="datosVendedorLeft">
              <p class="infoVend"><strong>Razón social:</strong>BLASEVICH HERNAN OSVALDO</p>
              <p class="infoVend"><strong>Domicilio:</strong>Don Bosco 2401, Morón, Buenos
              Aires.</p>
              <p class="infoVend"><strong>Condición frente al IVA:</strong>Responsable inscripto</p>
            </div>
        </div>
        <div class="vendedorFact">
          <div class="vendedorFactRight">
            <div class="typeCompContainer">
              <span class="comprobanteType">FACTURA</span></div>
            </div>
            <div class="datosVendedorRigth">
              <div class="ptovtaComp">
                <p class="infoVendedor"><strong>Pto venta:</strong>00008</p>
                <p class="infoVendedor"><strong>Comprobante:</strong>0029042</p>
              </div>
              <p class="infoVendedor"><strong>Fecha de emisión:</strong>18-10-2024</p>
              <p class="infoVendedor"><strong>CUIT:</strong> 20164364837</p>
              <p class="infoVendedor"><strong>Ingresos Brutos:</strong> 20-16436483-7</p>
              <p class="infoVendedor"><strong>Fecha inicio de actividad:</strong> 11-2013</p>
            </div>
          </div>
        </div>
      </div>
      <div class="periodoContainer">
        <p class="infoFechaFact"><strong>Periodo Facturado</strong></p>
        <p class="infoFechaFact"><strong>Desde:</strong>18-10-2024</p>
        <p class="infoFechaFact"><strong>Hasta:</strong>18-10-2024</p>
        <p class="infoFechaFact"><strong>Fecha de Vto. para el pago:</strong>-</p>
      </div>
      <div class="clientDataContainer">
        <div class="dataClient">
          <p class="infoFechaFact extraP"><strong>CUIT:</strong>20-26939623-8</p>
          <p class="infoFechaFact"><strong>Razon social:</strong>VIRREY REPUESTOS</p>
        </div>
        <div class="dataClient">
          <p class="infoFechaFact"><strong>Condicion frente a IVA:</strong>Resp. Inscripto</p>
          <p class="infoFechaFact"><strong>Domicilio fiscal:</strong>CURUMALAL 7345, VIRREY DEL PINO</p>
        </div>
        <div class="dataClient">
          <p class="infoFechaFact"><strong>Condicion de venta:</strong>CONTADO</p>
        </div>
      </div>
      <div class="referenciasContainer">
        <div class="referencia">
          <p class="infoFechaFact"><strong>Referencia:</strong>Venta de productos en Orden</p>
        </div>
        <div class="columns">
          <strong>Código</strong>
          <strong>Producto/Servicio</strong>
          <strong>Cantidad</strong>
          <strong>Marca</strong>
          <strong>Precio</strong>
          <strong>% Bonif</strong>
          <strong>% IVA</strong>
          <strong>Subtotal</strong>
        </div>
      </div>
      <div class="dataVentaContainer">
          <p>QS18135E</p>
          <p>BOMBA DE FRENO RENAULT 19 - CLIO EXPRES...</p>
          <p>1</p>
          <p>ITALFREN BOMBAS</p>
          <p>$36373.93</p>
          <p>0</p>
          <p>21</p>
          <p>$36373.93</p>
      </div>
      <div class="dataVentaContainer">
          <p>FR-925</p>
          <p>PASTILLA FRENO FIAT FIORINO (146 UNO) (05/88-)/...</p>
          <p>2</p>
          <p>FRIMA</p>
          <p>$12008.89</p>
          <p>0</p>
          <p>21</p>
          <p>$24017.77</p>
      </div>
      <div class="dataVentaContainer">
          <p>TB-44065</p>
          <p>CAZOLETA AMORTIGUADOR DELANTERA IZQUIER...</p>
          <p>1</p>
          <p>TB</p>
          <p>$40686.25</p>
          <p>0</p>
          <p>21</p>
          <p>$40686.25</p>
      </div>
      <div class="dataVentaContainer">
          <p>TB-44066</p>
          <p>CAZOLETA AMORTIGUADOR DELANTERA DE...</p>
          <p>1</p>
          <p>TB</p>
          <p>$40686.25</p>
          <p>0</p>
          <p>21</p>
          <p>$40686.25</p>
      </div>
      <div class="calcTotalCont">
          <div class="calcTotalContUp">
            <div class="calcTotalContUpLeft">
            </div>
            <div class="calcTotalContRigth">
              <div class="titleTableVert">
                <strong>Importe Neto Gravado:</strong>
                <strong>IVA 27%:</strong>
                <strong>IVA 21%:</strong>
                <strong>IVA 10.5%:</strong>
                <strong>IVA 5%:</strong>
                <strong>IVA 2.5%</strong>
                <strong>IVA 0%</strong>
                <strong>Importe Otros Tributos:</strong>
                <strong>Importe Total:</strong>
              </div>
              <div class="textTribContainer">
                <p class="textTrib">$117160,50</p>
                <p class="textTrib">0</p>
                <p class="textTrib">$24603,70</p>
                <p class="textTrib">0</p>
                <p class="textTrib">0</p>
                <p class="textTrib">0</p>
                <p class="textTrib">0</p>
                <p class="textTrib">0</p>
                <p class="textTrib">$141764.20</p>
              </div>
            </div>
          </div>
          <div class="calcTotalContDown">
            <span class="textTotalCalc">El total de este comprobante expresado en moneda de curso legal - Pesos Argentinos - </span>
            <strong class="textTotalCalc">$141764.20</strong>
          </div>
      </div>
      <div class="afipInfoContainer">
          <div class="qrLogoContainer">
            <img src=${logo} alt="logo afip" width="150" height="90" class="logo">
            <div class="logoText">
              <h6 class="titleText">Comprobante autorizado</h6>
              <p class="mjeText">Esta Administración Federal no se responsabiliza por los datos ingresados en el detalle de la operación</p>
            </div>
          </div>
          <div class="caeContainer">
            <p class="infoFechaFact"><strong>CAE:</strong>-</p>
            <p class="infoFechaFact"><strong>Vto CAE:</strong>-</p>
          </div>
      </div>
    </div>
  </body>
</html>`;
};
