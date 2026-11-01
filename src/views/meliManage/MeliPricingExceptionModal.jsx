import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './melimanage.module.css';
import {
  simulateMeliPricing,
  updateMeliBrandPricing,
  updateMeliProductPricing,
  deleteMeliBrandPricing,
  deleteMeliProductPricing,
} from '../../request/meliRequest';

const FIELDS = [
  { key: 'meliCommission', label: 'Comisión MELI', type: 'percent', hint: '0.16 = 16%' },
  { key: 'channelMargin', label: 'Margen de canal', type: 'percent', hint: '0.05 = 5%' },
  { key: 'fixedFee', label: 'Cargo fijo', type: 'money', hint: 'Se suma si el precio no supera el umbral' },
  { key: 'freeShippingThreshold', label: 'Umbral envío gratis', type: 'money', hint: '0 = siempre aplica el cargo fijo' },
  {
    key: 'priceMode',
    label: 'Modo de precio',
    type: 'select',
    options: [
      { value: 'grossUp', label: 'Gross-Up exacto' },
      { value: 'factor', label: 'Factor lineal' },
      { value: 'listPrice', label: 'Precio de lista local' },
    ],
  },
  {
    key: 'roundingMode',
    label: 'Redondeo',
    type: 'select',
    options: [
      { value: 'whole', label: 'Múltiplo de $10' },
      { value: 'end99', label: 'Terminado en .99' },
      { value: 'end90', label: 'Terminado en 90' },
      { value: 'exact', label: 'Exacto' },
    ],
  },
  { key: 'minPublishPrice', label: 'Piso mínimo', type: 'money', hint: 'Precio mínimo de publicación' },
];

function formatValue(field, value) {
  if (value === null || value === undefined || value === '') return '—';
  if (field.type === 'percent') return `${(Number(value) * 100).toFixed(2)}%`;
  if (field.type === 'money') {
    return `$${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  const option = field.options?.find((o) => o.value === value);
  return option?.label ?? value;
}

function sourceLabel(source) {
  if (source === 'brand') return 'marca';
  if (source === 'product') return 'producto';
  return 'general';
}

function money(value) {
  return Number(value || 0).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function initialValues(target) {
  const next = {};
  FIELDS.forEach((field) => {
    const current = target?.overrideValues?.[field.key];
    next[field.key] = current === null || current === undefined ? '' : current;
  });
  return next;
}

function initialInherit(target) {
  const next = {};
  FIELDS.forEach((field) => {
    const current = target?.overrideValues?.[field.key];
    next[field.key] = current === null || current === undefined || current === '';
  });
  return next;
}

export default function MeliPricingExceptionModal({ scope, target, onClose, onSaved, onMessage }) {
  const [values, setValues] = useState(() => initialValues(target));
  const [inherit, setInherit] = useState(() => initialInherit(target));
  const [localPrice, setLocalPrice] = useState(10000);
  const [sim, setSim] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isBrand = scope === 'brand';
  const inherited = target?.inherited || {};
  const titleTarget = isBrand
    ? target?.brandName
    : `${target?.brandName || ''} — ${target?.article || ''}`;

  useEffect(() => {
    setValues(initialValues(target));
    setInherit(initialInherit(target));
    setSim(null);
    setError('');
  }, [target]);

  const buildDraft = useCallback(() => {
    const draft = {};
    FIELDS.forEach((field) => {
      if (inherit[field.key]) {
        draft[field.key] = null;
        return;
      }
      const raw = values[field.key];
      if (raw === '' || raw === null || raw === undefined) {
        draft[field.key] = null;
      } else if (field.type === 'select') {
        draft[field.key] = raw;
      } else {
        draft[field.key] = Number(raw);
      }
    });
    return draft;
  }, [inherit, values]);

  useEffect(() => {
    if (!target) return undefined;
    const timer = setTimeout(async () => {
      try {
        const res = await simulateMeliPricing({
          localPrice: Number(localPrice) || 0,
          scope,
          brandId: target.brandId,
          productId: isBrand ? undefined : target.productId,
          draft: buildDraft(),
        });
        setSim(res);
      } catch {
        setSim(null);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localPrice, buildDraft, scope, target, isBrand]);

  if (!target) return null;

  const toggleInherit = (field, shouldInherit) => {
    setInherit((prev) => ({ ...prev, [field.key]: shouldInherit }));
    if (!shouldInherit) {
      setValues((prev) => ({
        ...prev,
        [field.key]:
          prev[field.key] === '' || prev[field.key] === null || prev[field.key] === undefined
            ? inherited[field.key] ?? ''
            : prev[field.key],
      }));
    }
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = buildDraft();
      const saved = isBrand
        ? await updateMeliBrandPricing(target.brandId, payload)
        : await updateMeliProductPricing(target.productId, payload);
      onMessage?.(
        saved?.hasOverride
          ? 'Excepción guardada. Se aplicará en la próxima sincronización.'
          : 'Excepción eliminada: el producto/marca vuelve a heredar la política general.'
      );
      onSaved?.(saved);
    } catch (e) {
      setError(e.response?.data?.message || 'No se pudo guardar la excepción.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const res = await Swal.fire({
      title: '¿Eliminar la excepción?',
      text: 'La marca/producto volverá a usar la política que hereda.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#c62828',
    });
    if (!res.isConfirmed) return;

    setSaving(true);
    setError('');
    try {
      if (isBrand) await deleteMeliBrandPricing(target.brandId);
      else await deleteMeliProductPricing(target.productId);
      onMessage?.('Excepción eliminada. Se aplicará en la próxima sincronización.');
      onSaved?.(null);
    } catch (e) {
      setError(e.response?.data?.message || 'No se pudo eliminar la excepción.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <div>
            <h3>Excepción de política {isBrand ? 'por marca' : 'por producto'}</h3>
            <p className={styles.subText}>{titleTarget}</p>
          </div>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-xmark" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.pricingNote}>
            Destildá <b>Heredar</b> solo en los campos que quieras pisar. Los campos heredados
            muestran el valor que usarían hoy.
          </p>

          <div className={styles.fieldList}>
            {FIELDS.map((field) => {
              const isInherited = inherit[field.key];
              return (
                <div className={styles.fieldRow} key={field.key}>
                  <div className={styles.fieldLabel}>
                    <span>{field.label}</span>
                    {field.hint && <small>{field.hint}</small>}
                  </div>
                  <div className={styles.fieldControl}>
                    {field.type === 'select' ? (
                      <select
                        value={isInherited ? '' : values[field.key] ?? ''}
                        disabled={isInherited}
                        onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      >
                        <option value="">
                          {formatValue(field, inherited[field.key])} · {sourceLabel(inherited.source?.[field.key])}
                        </option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        step="0.01"
                        disabled={isInherited}
                        value={isInherited ? '' : values[field.key] ?? ''}
                        placeholder={`${formatValue(field, inherited[field.key])} · ${sourceLabel(
                          inherited.source?.[field.key]
                        )}`}
                        onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    )}
                    <label className={styles.inheritToggle}>
                      <input
                        type="checkbox"
                        checked={isInherited}
                        onChange={(e) => toggleInherit(field, e.target.checked)}
                      />
                      Heredar
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.previewBox}>
            <h4>Vista previa</h4>
            <label className={styles.previewPrice}>
              Precio local con IVA
              <input
                type="number"
                value={localPrice}
                onChange={(e) => setLocalPrice(e.target.value)}
              />
            </label>
            {sim ? (
              <p>
                Publicar en MELI: <b>${money(sim.publishPrice)}</b> — retiene MELI: $
                {money(sim.meliFee)} — neto Tauro Parts: <b>${money(sim.net)}</b>
              </p>
            ) : (
              <p className={styles.hint}>Completá los campos para ver la simulación.</p>
            )}
          </div>

          {error && <p className={styles.modalError}>{error}</p>}
        </div>

        <div className={styles.modalFoot}>
          {target.hasOverride && (
            <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={remove} disabled={saving}>
              Quitar excepción
            </button>
          )}
          <div className={styles.modalFootRight}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={save} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar excepción'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
