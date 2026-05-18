import React, { useState } from 'react';
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

  const products = equivalence.products ?? [];

  const getQuantity = (productId) => quantities[productId] ?? 1;

  const setQuantity = (productId, value) => {
    if (value >= 1) {
      setQuantities((prev) => ({ ...prev, [productId]: value }));
    }
  };

  const hasEquivImage = !!equivalence.image?.url;
  const equivImageUrl = equivalence.image?.url || null;

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
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <i className="fa-solid fa-times" />
          </button>
        </div>

        <div className={styles.descriptionBar}>
          <i className="fa-solid fa-tag" />
          <span>{equivalence.description}</span>
        </div>

        <div className={styles.content}>
          {products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.map((product) => {
                const pSellPrice = product.price ? Number(product.price) : 0;
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
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.article} />
                        ) : (
                          <div className={styles.productImagePlaceholder}>
                            <i className="fa-solid fa-box" />
                          </div>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <h4 className={styles.productArticle}>{product.article}</h4>
                        <p className={styles.productBrand}>{product.brand}</p>
                        <p className={styles.productDesc}>{product.description}</p>
                      </div>
                    </div>

                    <div className={styles.productBody}>
                      <div className={styles.priceRow}>
                        <div>
                          <p className={styles.priceLabel}>Precio lista</p>
                          <p className={styles.listPrice}>${pSellPrice.toFixed(2)}</p>
                        </div>
                        <div className={styles.priceRight}>
                          <p className={styles.priceLabel}>Tu precio</p>
                          <p className={styles.sellPrice}>${pSellPrice.toFixed(2)}</p>
                        </div>
                      </div>

                      <div
                        className={styles.stockPill}
                        style={{ background: stockBadge.bg, color: stockBadge.text }}
                      >
                        <span className={styles.stockDot} style={{ background: stockBadge.dot }} />
                        {stockBadge.label}
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
                              addProduct(product.id, product.brandId || product.id, product.article, pSellPrice, product.description);
                            }
                          }}
                          disabled={isAdding || product.stock === 0}
                          className={`${styles.addBtn} ${product.stock === 0 ? styles.addBtnDisabled : ''}`}
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
