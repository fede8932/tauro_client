import React, { useState } from 'react';
import styles from './posEcommerceManualItemModal.module.css';

function PosEcommerceManualItemModal({ onClose, onAdd, defaultOfficial = true, showOfficialOption = true }) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');
  const [oficial, setOficial] = useState(defaultOfficial);

  const parsedPrice = Number(unitPrice);
  const isValid =
    description.trim().length > 0 &&
    quantity >= 1 &&
    unitPrice !== '' &&
    !isNaN(parsedPrice) &&
    parsedPrice !== 0;

  const subtotal = isValid ? parsedPrice * quantity : 0;
  const isDiscount = isValid && parsedPrice < 0;
  const grossTotal = !isNaN(parsedPrice)
    ? parsedPrice * quantity * 1.21
    : 0;

  const handleAdd = () => {
    if (!isValid) return;
    onAdd({
      description: description.trim(),
      quantity,
      unitPrice: Number(unitPrice),
      oficial: showOfficialOption ? oficial : undefined,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Agregar ítem manual</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <i className="fa-solid fa-times" />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.helper}>
            Ítem sin stock ni catálogo. El monto va tal cual en el
            presupuesto; si la factura es oficial se le agrega el IVA (21%).
            Usá un precio en negativo para cargar un{' '}
            <strong>descuento manual</strong>.
          </p>

          <div className={styles.field}>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del servicio o artículo..."
              rows="3"
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Cantidad</label>
              <input
                type="number"
                className={styles.input}
                value={quantity}
                min="1"
                step="1"
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{showOfficialOption ? 'Precio unitario (sin IVA)' : 'Precio unitario (final)'}</label>
              <input
                type="number"
                className={styles.input}
                value={unitPrice}
                step="0.01"
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="Ej: 1500 o -500 (descuento)"
              />
            </div>
          </div>

          <div className={styles.subtotal}>
            <span>{isDiscount ? 'Descuento' : 'Subtotal'}</span>
            <span>$ {subtotal.toFixed(2)}</span>
          </div>

          <label className={styles.checkRow} style={showOfficialOption ? undefined : { display: 'none' }}>
            <input
              type="checkbox"
              className={styles.checkBox}
              checked={oficial}
              onChange={(e) => setOficial(e.target.checked)}
            />
            <span>Factura oficial</span>
          </label>

          {showOfficialOption && oficial ? (
            <>
              <p className={styles.ivaNotice}>
                A este monto se le va a agregar el IVA (21%).
              </p>
              <div className={styles.field}>
                <label className={styles.label}>Monto con IVA</label>
                <input
                  type="text"
                  className={`${styles.input} ${styles.inputDisabled}`}
                  value={`$ ${grossTotal.toFixed(2)}`}
                  disabled
                  readOnly
                />
              </div>
            </>
          ) : null}

          <button
            onClick={handleAdd}
            disabled={!isValid}
            className={styles.addBtn}
          >
            <i className="fa-solid fa-plus" />
            Agregar a la orden
          </button>
        </div>
      </div>
    </div>
  );
}

export default PosEcommerceManualItemModal;