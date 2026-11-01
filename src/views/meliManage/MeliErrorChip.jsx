import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import styles from './melimanage.module.css';

const ERROR_LABELS = {
  'item.attribute.missing_conditional_required': 'Faltan atributos obligatorios',
  'item.attribute.invalid': 'Atributo inválido',
  'item.price.invalid': 'Precio inválido para la categoría',
  'item.title.invalid': 'Título inválido',
  'item.pictures.invalid': 'Imágenes inválidas',
  'item.category_id.invalid': 'Categoría inválida',
  'item.condition.invalid': 'Condición inválida',
};

/** Resume el error crudo de MELI en una etiqueta corta. */
export function summarizeError(raw) {
  const text = String(raw).replace(/\s+/g, ' ').trim();
  const code = text.match(/\(([a-z0-9_.]+):/i)?.[1] || text.match(/^([a-z0-9_.]+):/i)?.[1];
  if (code && ERROR_LABELS[code]) return ERROR_LABELS[code];
  if (code) return code;
  return text.length > 46 ? `${text.slice(0, 46)}…` : text;
}

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

/**
 * Chip de error: etiqueta corta + tooltip con el detalle completo al pasar el mouse
 * (clic para verlo en grande y poder copiarlo).
 */
export default function ErrorChip({ error, placeholder = '—' }) {
  const [tip, setTip] = useState(null);
  if (!error) return <span className={styles.errNone}>{placeholder}</span>;

  const show = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = Math.min(420, window.innerWidth - 24);
    const below = rect.bottom + 8;
    setTip({
      left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      ...(below + 260 > window.innerHeight
        ? { bottom: window.innerHeight - rect.top + 8 }
        : { top: below }),
      width,
    });
  };

  const openDetail = () =>
    Swal.fire({
      title: 'Detalle del error',
      html: `<pre style="margin:0;text-align:left;white-space:pre-wrap;word-break:break-word;font-size:12.5px;line-height:1.55;max-height:50vh;overflow:auto;background:#f7f7f9;border-radius:10px;padding:12px">${escapeHtml(
        error
      )}</pre>`,
      width: 640,
      confirmButtonText: 'Cerrar',
    });

  return (
    <>
      <button
        type="button"
        className={styles.errChip}
        onMouseEnter={show}
        onMouseLeave={() => setTip(null)}
        onFocus={show}
        onBlur={() => setTip(null)}
        onClick={openDetail}
      >
        <i className="fas fa-circle-exclamation" />
        <span>{summarizeError(error)}</span>
      </button>
      {tip &&
        createPortal(
          <div className={styles.errTooltip} style={tip} role="tooltip">
            <div className={styles.errTooltipHead}>Detalle del error</div>
            <pre className={styles.errTooltipBody}>{error}</pre>
            <div className={styles.errTooltipHint}>Clic para verlo completo</div>
          </div>,
          document.body
        )}
    </>
  );
}
