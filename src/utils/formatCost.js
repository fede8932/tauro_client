/**
 * Formatea un número a la notación monetaria argentina.
 * Ejemplos:
 *   10000   → "10,00"
 *   1500005 → "1.500,05"
 *
 * @param {number|string} value - Valor numérico o cadena numérica.
 * @returns {string} Valor formateado con separador de miles “.” y decimal “,”.
 */
export default function formatCost(value) {
  // Normalizamos la entrada a número
  const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : Number(value);
  if (Number.isNaN(num)) {
    return '';
  }
  // Convertimos a entero de centavos para evitar problemas de precisión
  const centavos = Math.round(num * 100);
  const entero = Math.trunc(centavos / 100);
  const decimales = Math.abs(centavos % 100);

  // Formateamos la parte entera con separador de miles “.”
  const enteroFormateado = entero
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Unimos ambas partes con coma decimal
  return `${enteroFormateado},${decimales.toString().padStart(2, '0')}`;
}