import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from './posEcommerceEquivalenceModalV2.module.css';

const getStockBadge = (stock) => {
  if (stock > 4) return { bg: '#e8f5e9', text: '#2e7d32', dot: '#4caf50', label: `${stock} en stock` };
  if (stock > 0) return { bg: '#fff8e1', text: '#f57f17', dot: '#ffc107', label: `${stock} en stock` };
  return { bg: '#ffebee', text: '#c62828', dot: '#ef5350', label: 'Sin stock' };
};

function PosEcommerceEquivalenceModalV2({ equivalence, onClose, addProduct }) {
  const products = equivalence.products ?? [];
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [zoom, setZoom] = useState(null);
  const thumbListRef = useRef(null);

  const allImages = useMemo(() => {
    const list = [];
    const seen = new Set();

    const add = (img) => {
      if (!img || !img.url || seen.has(img.url)) return;
      seen.add(img.url);
      list.push(img);
    };

    add(equivalence.image);
    if (Array.isArray(equivalence.images)) {
      equivalence.images.forEach(add);
    }
    products.forEach((p) => {
      if (Array.isArray(p.images)) {
        p.images.forEach(add);
      }
    });

    return list;
  }, [equivalence, products]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoom) {
          setZoom(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, zoom]);

  useEffect(() => {
    setSelectedProductId(products[0]?.id ?? null);
    setMainImageIndex(0);
    setQuantity(1);
  }, [equivalence.id, products]);

  const handlePrevMain = (e) => {
    if (e) e.stopPropagation();
    setMainImageIndex((prev) => (prev <= 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextMain = (e) => {
    if (e) e.stopPropagation();
    setMainImageIndex((prev) => (prev >= allImages.length - 1 ? 0 : prev + 1));
  };

  const handleQuantityChange = (value) => {
    const parsed = parseInt(value, 10);
    setQuantity(Number.isNaN(parsed) || parsed < 1 ? 1 : parsed);
  };

  const handleAdd = () => {
    if (!selectedProduct || !addProduct) return;
    const sellPrice = Number(selectedProduct.price) || 0;
    if (sellPrice <= 0) return;
    const basePrice = sellPrice / 1.21;
    addProduct(
      selectedProduct.id,
      selectedProduct.brandId || selectedProduct.id,
      selectedProduct.article,
      basePrice,
      selectedProduct.description,
      quantity
    );
  };

  const handleSelectProduct = (product) => {
    setSelectedProductId(product.id);
    setQuantity(1);
  };

  const scrollThumbnails = (direction) => {
    if (thumbListRef.current) {
      thumbListRef.current.scrollBy({ left: direction * 80, behavior: 'smooth' });
    }
  };

  const renderTabs = () => {
    const tabs = [
      { key: 'description', label: 'Descripción' },
      { key: 'stock', label: 'Stock' },
      { key: 'vehicular', label: 'Aplicación Vehicular' },
    ];
    return (
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'vehicular') {
      return (
        <div className={styles.underConstruction}>
          <div className={styles.underConstructionIcon}>
            <i className="fa-solid fa-person-digging" />
          </div>
          <span>Sitio en construcción</span>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fa-solid fa-box-open" />
          </div>
          <p>No hay productos en este grupo de equivalencias</p>
        </div>
      );
    }

    const isPriceTab = activeTab === 'description';

    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              {isPriceTab ? null : <th>Descripción</th>}
              <th>Marca</th>
              {isPriceTab ? <th>Stock</th> : null}
              <th>{isPriceTab ? 'Precio de venta' : 'Stock'}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isSelected = selectedProductId === product.id;
              const stockBadge = getStockBadge(product.stock ?? 0);
              const price = Number(product.price) || 0;
              return (
                <tr
                  key={product.id}
                  className={isSelected ? styles.selectedRow : ''}
                  onClick={() => handleSelectProduct(product)}
                >
                  <td className={styles.codeCell} title={product.description || ''}>{product.article}</td>
                  {isPriceTab ? null : (
                    <td className={styles.descCell} title={product.description}>
                      {product.description ? (product.description.length > 40 ? product.description.slice(0, 40) + '...' : product.description) : 'S/Descripción'}
                    </td>
                  )}
                  <td className={styles.brandCell}>{product.brand}</td>
                  {isPriceTab ? (
                    <td>
                      <span
                        className={styles.stockPill}
                        style={{ background: stockBadge.bg, color: stockBadge.text }}
                      >
                        <span
                          className={styles.stockDot}
                          style={{ background: stockBadge.dot }}
                        />
                        {stockBadge.label}
                      </span>
                    </td>
                  ) : null}
                  <td>
                    {isPriceTab ? (
                      <span className={`${styles.priceCell}${(product.stock ?? 0) === 0 ? ` ${styles.priceCellNoStock}` : ''}`}>${price.toFixed(2)}</span>
                    ) : (
                      <span
                        className={styles.stockPill}
                        style={{ background: stockBadge.bg, color: stockBadge.text }}
                      >
                        <span
                          className={styles.stockDot}
                          style={{ background: stockBadge.dot }}
                        />
                        {stockBadge.label}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const currentMainImage = allImages[mainImageIndex];

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.layout}>
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                {currentMainImage ? (
                  <>
                    <img src={currentMainImage.url} alt="Imagen principal" />
                    <button
                      className={styles.imgZoomBtn}
                      onClick={() => setZoom({ index: mainImageIndex, images: allImages })}
                      title="Ampliar imagen"
                    >
                      <i className="fa-solid fa-search-plus" />
                    </button>
                    {allImages.length > 1 && (
                      <>
                        <button
                          className={styles.imgArrowLeft}
                          onClick={handlePrevMain}
                          title="Imagen anterior"
                        >
                          <i className="fa-solid fa-chevron-left" />
                        </button>
                        <button
                          className={styles.imgArrowRight}
                          onClick={handleNextMain}
                          title="Siguiente imagen"
                        >
                          <i className="fa-solid fa-chevron-right" />
                        </button>
                        <span className={styles.imgCounter}>
                          {mainImageIndex + 1}/{allImages.length}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <div className={styles.imgPlaceholder}>
                    <i className="fa-solid fa-box" />
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className={styles.thumbnails}>
                  <button
                    className={styles.thumbNavBtn}
                    onClick={() => scrollThumbnails(-1)}
                    title="Anteriores"
                  >
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  <div className={styles.thumbList} ref={thumbListRef}>
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        className={`${styles.thumb} ${idx === mainImageIndex ? styles.thumbActive : ''}`}
                        onClick={() => setMainImageIndex(idx)}
                        title={`Imagen ${idx + 1}`}
                      >
                        <img src={img.url} alt={`Miniatura ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                  <button
                    className={styles.thumbNavBtn}
                    onClick={() => scrollThumbnails(1)}
                    title="Siguientes"
                  >
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.rightPanel}>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <div className={styles.headerIcon}>
                    <i className="fa-solid fa-layer-group" />
                  </div>
                  <div>
                    <h2 className={styles.headerTitle}>Grupo de Equivalencias</h2>
                    <p className={styles.headerSubtitle}>
                      {products.length} producto(s) disponible(s)
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className={styles.closeBtn}>
                  <i className="fa-solid fa-times" />
                </button>
              </div>

              <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Código</span>
                  <span
                    className={[
                      styles.infoValue,
                      !equivalence.code ? styles.infoValueEmpty : '',
                    ].join(' ')}
                  >
                    {equivalence.code || 'Equivalencia S/Cod'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Descripción</span>
                  <span
                    className={[
                      styles.infoValue,
                      !equivalence.description ? styles.infoValueEmpty : '',
                    ].join(' ')}
                  >
                    {equivalence.description || 'S/Descripción'}
                  </span>
                </div>
              </div>

              {renderTabs()}

              <div className={styles.tabContent}>{renderContent()}</div>

              <div className={styles.footerBar}>
                <div className={styles.selectedSummary}>
                  {selectedProduct ? (
                    <>
                      <span className={styles.selectedName}>
                        {selectedProduct.article} - {selectedProduct.brand}
                      </span>
                      <span className={styles.selectedPrice}>
                        ${(Number(selectedProduct.price) || 0).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className={styles.selectedEmpty}>
                      Seleccione un producto del listado
                    </span>
                  )}
                </div>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className={styles.qtyInput}
                    min="1"
                  />
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.addBtn}
                  onClick={handleAdd}
                  disabled={!selectedProduct || !(Number(selectedProduct.price) > 0)}
                >
                  <i className="fa-solid fa-cart-plus" />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {zoom && zoom.images.length > 0 && (
        <div className={styles.zoomOverlay} onClick={() => setZoom(null)}>
          <div className={styles.zoomContainer} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.zoomCloseBtn}
              onClick={() => setZoom(null)}
              title="Cerrar"
            >
              <i className="fa-solid fa-times" />
            </button>
            {zoom.images.length > 1 && (
              <>
                <button
                  className={`${styles.zoomNavBtn} ${styles.zoomPrevBtn}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom((prev) =>
                      prev
                        ? { ...prev, index: prev.index === 0 ? prev.images.length - 1 : prev.index - 1 }
                        : null
                    );
                  }}
                  title="Imagen anterior"
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>
                <button
                  className={`${styles.zoomNavBtn} ${styles.zoomNextBtn}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom((prev) =>
                      prev
                        ? { ...prev, index: prev.index === prev.images.length - 1 ? 0 : prev.index + 1 }
                        : null
                    );
                  }}
                  title="Siguiente imagen"
                >
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </>
            )}
            <img
              src={zoom.images[zoom.index]?.url}
              alt="Ampliada"
              className={styles.zoomImage}
            />
            {zoom.images.length > 1 && (
              <span className={styles.zoomCounter}>
                {zoom.index + 1}/{zoom.images.length}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PosEcommerceEquivalenceModalV2;
