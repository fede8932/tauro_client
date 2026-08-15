import React, { useState } from 'react';
import styles from './posEcommerceManualItemModal.module.css';

function PosEcommerceManualItemModal({ onClose, onAdd }) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');

  const isValid =
    description.trim().length > 0 &&
    quantity >= 1 &&
    unitPrice !== '' &&
    Number(unitPrice) > 0;

  const subtotal = isValid ? Number(unitPrice) * quantity : 0;

  const handleAdd = () => {
    if (!isValid) return;
    onAdd({
      description: description.trim(),
      quantity,
      unitPrice: Number(unitPrice),
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
            Ítem sin stock ni catálogo. El precio unitario se ingresa{' '}
            <strong>sin IVA</strong>.
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
              <label className={styles.label}>Precio unitario (sin IVA)</label>
              <input
                type="number"
                className={styles.input}
                value={unitPrice}
                min="0"
                step="0.01"
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className={styles.subtotal}>
            <span>Subtotal</span>
            <span>$ {subtotal.toFixed(2)}</span>
          </div>

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