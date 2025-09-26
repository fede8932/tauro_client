import { fechaConverter } from '../utils';

export const clienteReportBySeller = async (cuil, name, lastName, clients) => {
  function convertirFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }
  function formatoNumero(valor) {
    const numero = parseFloat(valor).toFixed(2);
    let [entero, decimales] = numero.split('.');
    entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${entero},${decimales}`;
  }
  function formatoMonedaConSigno(valor) {
    const v = Number(valor) || 0;
    const sign = v < 0 ? '-' : '';
    return `${sign}$${formatoNumero(Math.abs(v))}`;
  }

  const lista = clients
    .map((c) => {
      if (c?.currentAcount?.resume < -0.5) {
        let sumFactura = 0; // negativos
        let sumNC = 0; // positivos

        const items = c.currentAcount.movements
          ?.map((i) => {
            const amountBase = i?.saldoPend ? i.saldoPend : i?.total || 0;
            const parcial = i?.saldoPend && i?.saldoPend !== i?.total ? ' (P)' : '';

            let facturaVal = 0;
            let ncVal = 0;

            if (i.type == 0) {
              // Factura o Presupuesto => mostrar en columna Factura como negativo
              facturaVal = -Math.abs(amountBase);
            }
            if (i.type == 1 || i.type == 3) {
              // Notas de crédito => mostrar en columna NC como positivo
              ncVal = Math.abs(amountBase);
            }

            sumFactura += facturaVal;
            sumNC += ncVal;

            // Mostrar vacío si no aplica la columna
            const facturaTxt =
              facturaVal !== 0 ? `${formatoMonedaConSigno(facturaVal)}${parcial}` : '';
            const ncTxt = ncVal !== 0 ? `${formatoMonedaConSigno(ncVal)}${parcial}` : '';

            return `
      <tr>
        <td>${convertirFecha(i?.fecha)}</td>
        <td>${i?.numComprobante || ''}</td>
        <td style="text-align:right;">${facturaTxt}</td>
        <td style="text-align:right;">${ncTxt}</td>
      </tr>`;
          })
          .join('');

        const totalCliente = sumFactura + sumNC; // sumFactura es negativo, sumNC positivo

        return `<div>
          <h3>Cliente: ${c?.razonSocial}</h3>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Comprobante</th>
                <th>Factura</th>
                <th>Nota de crédito</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="total">Totales</td>
                <td class="total" style="text-align:right;">${formatoMonedaConSigno(sumFactura)}</td>
                <td class="total" style="text-align:right;">${formatoMonedaConSigno(sumNC)}</td>
              </tr>
              <tr>
                <td colspan="3" class="total">Total general</td>
                <td class="total" style="text-align:right;">${formatoMonedaConSigno(totalCliente)}</td>
              </tr>
            </tfoot>
          </table>
        </div>`;
      }
      return undefined;
    })
    .filter(Boolean)
    .join('');

  return `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reporte de Cuentas</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        h5,
        h6 {
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        .total {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h5>REPORTE DE CTAS. CTES.</h5>
      <h6>${cuil}  ${name} ${lastName}</h6>
      <h6>${fechaConverter(new Date())}</h6>
  
      <!-- Estructura de tabla para un cliente -->
      ${lista}
    </body>
  </html>
  `;
};
