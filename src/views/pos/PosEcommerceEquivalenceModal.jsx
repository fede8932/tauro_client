import React, { useState, useEffect } from 'react';
import styles from './posEcommerceEquivalenceModal.module.css';

const getStockBadge = (stock) => {
  if (stock > 4) return { bg: '#e8f5e9', text: '#2e7d32', dot: '#4caf50', label: `${stock} en stock` };
  if (stock > 0) return { bg: '#fff8e1', text: '#f57f17', dot: '#ffc107', label: `${stock} en stock` };
  return { bg: '#ffebee', text: '#c62828', dot: '#ef5350', label: 'Sin stock' };
};

function PosEcommerceEquivalenceModal({ equivalence, onClose, addProduct }) {
  const [selectedProductId, setSelectedProductId] = useState(
    equivalence.products?.[0]?.id ?? null
  );
  const [quantities, setQuantities] = useState({});
  const [addingProductId, setAddingProductId] = useState(null);
  const [imageIndex, setImageIndex] = useState({});

  const products = equivalence.products ?? [];

  const getQuantity = (productId) => quantities[productId] ?? 1;

  const setQuantity = (productId, value) => {
    if (value >= 1) {
      setQuantities((prev) => ({ ...prev, [productId]: value }));
    }
  };

  const getImageIndex = (productId) => imageIndex[productId] ?? 0;

  const prevImage = (productId, total) => {
    setImageIndex((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) <= 0 ? total - 1 : (prev[productId] ?? 0) - 1 }));
  };

  const nextImage = (productId, total) => {
    setImageIndex((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) >= total - 1 ? 0 : (prev[productId] ?? 0) + 1 }));
  };

  const hasEquivImage = !!equivalence.image?.url;
  const equivImageUrl = equivalence.image?.url || null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <i className="fa-solid fa-layer-group" />
            </div>
            <div>
              <h2 className={styles.headerTitle}>Grupo de Equivalencias</h2>
              <p className={styles.headerSubtitle}>{products.length} producto(s) disponible(s)</p>
              {equivalence.code && (
                <span className={styles.codeBadge}>{equivalence.code}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <i className="fa-solid fa-times" />
          </button>
        </div>

        <div className={styles.descriptionBar}>
          <i className="fa-solid fa-tag" />
          <div className={styles.descBarWrap}>
            <span>{equivalence.description}</span>
            <span className={styles.descBarTip}>{equivalence.description}</span>
          </div>
        </div>

        <div className={styles.content}>
          {products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.map((product) => {
                const pSellPrice = product.price ? Number(product.price) : 0;
                const basePrice = pSellPrice / 1.21;
                const stockBadge = getStockBadge(product.stock ?? 0);
                const hasImage = product.images && product.images.length > 0;
                const imageUrl = hasImage ? product.images[0].url : equivImageUrl;
                const qty = getQuantity(product.id);
                const isAdding = addingProductId === product.id;
                const isSelected = selectedProductId === product.id;

                return (
                  <div
                    key={product.id}
                    className={`${styles.productCard} ${isSelected ? styles.productCardSelected : ''}`}
                    onClick={() => setSelectedProductId(product.id)}
                  >
                    <div className={styles.productHeader}>
                      <div className={styles.productImage}>
                        {(() => {
                          const allImages = product.images || [];
                          const currentIdx = getImageIndex(product.id);
                          const currentUrl = allImages.length > 0
                            ? allImages[currentIdx]?.url
                            : equivImageUrl;

                          return currentUrl ? (
                            <div className={styles.productImageInner}>
                              <img src={currentUrl} alt={product.article} />
                              {allImages.length > 1 && (
                                <>
                                  <button
                                    className={styles.imgArrowLeft}
                                    onClick={(e) => { e.stopPropagation(); prevImage(product.id, allImages.length); }}
                                  >
                                    <i className="fa-solid fa-chevron-left" />
                                  </button>
                                  <button
                                    className={styles.imgArrowRight}
                                    onClick={(e) => { e.stopPropagation(); nextImage(product.id, allImages.length); }}
                                  >
                                    <i className="fa-solid fa-chevron-right" />
                                  </button>
                                  <span className={styles.imgCounter}>
                                    {currentIdx + 1}/{allImages.length}
                                  </span>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className={styles.productImagePlaceholder}>
                              <i className="fa-solid fa-box" />
                            </div>
                          );
                        })()}
                      </div>
                      <div className={styles.productInfo}>
                        <h4 className={styles.productArticle}>{product.article}</h4>
                        <p className={styles.productBrand}>{product.brand}</p>
                        <div className={styles.productDescWrap}>
                          <p className={styles.productDesc}>{product.description}</p>
                          <span className={styles.productDescTip}>{product.description}</span>
                        </div>
                        <p className={styles.productLocation}>{product.location || 'N/A'}</p>
                      </div>
                    </div>

                    <div className={styles.productBody}>
                      <div className={styles.bodyTopRow}>
                        <div className={styles.priceBlock}>
                          <p className={styles.sellPrice}>${pSellPrice.toFixed(2)}</p>
                        </div>
                        <div
                          className={styles.stockPill}
                          style={{ background: stockBadge.bg, color: stockBadge.text }}
                        >
                          <span className={styles.stockDot} style={{ background: stockBadge.dot }} />
                          {stockBadge.label}
                        </div>
                      </div>

                      <div className={styles.actionsRow}>
                        <div className={styles.quantityControl}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuantity(product.id, qty - 1);
                            }}
                            disabled={qty <= 1}
                            className={styles.qtyBtn}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                            onClick={(e) => e.stopPropagation()}
                            className={styles.qtyInput}
                            min="1"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuantity(product.id, qty + 1);
                            }}
                            className={styles.qtyBtn}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (addProduct) {
                              addProduct(product.id, product.brandId || product.id, product.article, basePrice, product.description, qty);
                            }
                          }}
                          disabled={isAdding || !pSellPrice || pSellPrice <= 0}
                          className={styles.addBtn}
                        >
                          <i className="fa-solid fa-cart-plus" />
                          Agregar
                        </button>
                      </div>
                    </div>

                    {isSelected && (
                      <div className={styles.selectedBadge}>
                        <i className="fa-solid fa-check" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <i className="fa-solid fa-box-open" />
              </div>
              <p className={styles.emptyText}>No hay productos en este grupo de equivalencias</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerText}>
            <strong>{products.length}</strong> producto(s) equivalente(s) disponible(s)
          </span>
          <button onClick={onClose} className={styles.footerCloseBtn}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PosEcommerceEquivalenceModal;
