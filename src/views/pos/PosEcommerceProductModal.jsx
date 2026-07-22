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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images || [];
  const hasImage = images.length > 0;
  const imageCount = images.length;

  const stockInfo = getStockInfo(product.stock ?? 0);
  const sellPrice = product.price ? Number(product.price) : 0;
  const subtotal = sellPrice * quantity;

  const goToPrev = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

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
                    <img src={images[currentImageIndex].url} alt={product.article} className={styles.image} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <i className="fa-solid fa-box" />
                    </div>
                  )}
                  {imageCount > 1 && (
                    <>
                      <button onClick={goToPrev} className={styles.galleryPrev}>
                        <i className="fa-solid fa-chevron-left" />
                      </button>
                      <button onClick={goToNext} className={styles.galleryNext}>
                        <i className="fa-solid fa-chevron-right" />
                      </button>
                    </>
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

                {imageCount > 1 && (
                  <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        className={`${styles.thumb} ${idx === currentImageIndex ? styles.thumbActive : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img src={img.url} alt={`${product.article} ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}

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
                      <span className={styles.priceLabel}>Precio de venta</span>
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
                      addProduct(product.id, product.brandId || product.id, product.article, sellPrice / 1.21, product.description, quantity);
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
          <div className={styles.zoomContainer} onClick={(e) => e.stopPropagation()}>
            {imageCount > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className={`${styles.zoomNavBtn} ${styles.zoomNavPrev}`}
                  title="Imagen anterior"
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>
                <button
                  onClick={goToNext}
                  className={`${styles.zoomNavBtn} ${styles.zoomNavNext}`}
                  title="Siguiente imagen"
                >
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </>
            )}
            <img src={images[currentImageIndex].url} alt={product.article} className={styles.zoomImage} />
            <button onClick={() => setShowImageZoom(false)} className={styles.zoomCloseBtn}>
              <i className="fa-solid fa-times" />
            </button>
            {imageCount > 1 && (
              <span className={styles.zoomCounter}>
                {currentImageIndex + 1}/{imageCount}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PosEcommerceProductModal;
