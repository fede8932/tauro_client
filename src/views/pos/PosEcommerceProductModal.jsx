import React, { useState } from 'react';
import styles from './posEcommerceProductModal.module.css';

const getStockInfo = (stock) => {
  if (stock > 4) return { bg: '#e8f5e9', text: '#2e7d32', dot: '#4caf50', label: `${stock} en stock` };
  if (stock > 0) return { bg: '#fff8e1', text: '#f57f17', dot: '#ffc107', label: `${stock} en stock` };
  return { bg: '#ffebee', text: '#c62828', dot: '#ef5350', label: 'Sin stock' };
};

function PosEcommerceProductModal({ product, onClose, addProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [showImageZoom, setShowImageZoom] = useState(false);

  const hasImage = product.images && product.images.length > 0;
  const imageUrl = hasImage ? product.images[0].url : null;

  const stockInfo = getStockInfo(product.stock ?? 0);
  const sellPrice = product.price ? Number(product.price) : 0;
  const basePrice = sellPrice / 1.21;
  const subtotal = basePrice * quantity;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Detalle del Producto</h2>
            <button onClick={onClose} className={styles.closeBtn}>
              <i className="fa-solid fa-times" />
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.grid}>
              <div className={styles.imageColumn}>
                <div className={styles.imageContainer}>
                  {hasImage ? (
                    <img src={imageUrl} alt={product.article} className={styles.image} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <i className="fa-solid fa-box" />
                    </div>
                  )}
                  {hasImage && (
                    <button
                      onClick={() => setShowImageZoom(true)}
                      className={styles.zoomBtn}
                      title="Ampliar imagen"
                    >
                      <i className="fa-solid fa-search-plus" />
                    </button>
                  )}
                </div>

                <div className={styles.stockBadge} style={{ background: stockInfo.bg, color: stockInfo.text }}>
                  <span className={styles.stockDot} style={{ background: stockInfo.dot }} />
                  {stockInfo.label}
                </div>
              </div>

              <div className={styles.detailsColumn}>
                <h3 className={styles.article}>{product.article}</h3>
                <p className={styles.brandAndDesc}>
                  {product.brand} - {product.description}
                </p>

                <div className={styles.divider} />

                <div className={styles.priceSection}>
                  <h4 className={styles.priceSectionTitle}>Información de Precios</h4>
                  <div className={styles.priceGrid}>
                    <div className={styles.priceBox}>
                      <span className={styles.priceLabel}>Ubicación</span>
                      <span className={styles.priceValue}>{product.location || 'N/A'}</span>
                    </div>
                    <div className={styles.priceBox}>
                      <span className={styles.priceLabel}>Precio lista</span>
                      <span className={styles.priceMain}>${basePrice.toFixed(2)}</span>
                    </div>
                    <div className={styles.priceBox}>
                      <span className={styles.priceLabel}>Precio con IVA</span>
                      <span className={styles.priceMain}>${sellPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className={styles.sellPriceBox}>
                    <span className={styles.priceLabel}>Subtotal</span>
                    <span className={styles.priceMain}>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.quantitySection}>
                  <label className={styles.quantityLabel}>Cantidad:</label>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className={styles.qtyBtn}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className={styles.qtyInput}
                      min="1"
                    />
                    <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}>
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (addProduct) {
                      addProduct(product.id, product.brandId || product.id, product.article, basePrice, product.description);
                      onClose();
                    }
                  }}
                  disabled={!addProduct || !sellPrice || sellPrice <= 0}
                  className={styles.addBtn}
                >
                  <i className="fa-solid fa-cart-plus" />
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageZoom && hasImage && (
        <div className={styles.zoomOverlay} onClick={() => setShowImageZoom(false)}>
          <div className={styles.zoomContainer}>
            <img src={imageUrl} alt={product.article} className={styles.zoomImage} />
            <button onClick={() => setShowImageZoom(false)} className={styles.zoomCloseBtn}>
              <i className="fa-solid fa-times" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PosEcommerceProductModal;
