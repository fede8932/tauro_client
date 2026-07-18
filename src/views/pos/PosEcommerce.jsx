import React, { useState, useEffect, useCallback } from 'react';
import styles from './posEcommerce.module.css';
import CustomPagination from '../../commonds/pagination/CustomPagination';
import LoadingSpinner from '../../commonds/loading/LoadingSpinner';
import { searchProductsAndEquivalences, getBrands } from '../../request/productRequest';
import PosEcommerceProductModal from './PosEcommerceProductModal';
// import PosEcommerceEquivalenceModal from './PosEcommerceEquivalenceModal';
import PosEcommerceEquivalenceModalV2 from './PosEcommerceEquivalenceModalV2';
import PosEcommerceOrderSidebar from './PosEcommerceOrderSidebar';
import LinkEquivalenceModal from '../../components/posComponent/LinkEquivalenceModal';
import { useDispatch, useSelector } from 'react-redux';
import { addLocalOrderItem } from '../../redux/sellPosOrder';

const VEHICLE_BRANDS = [
  'ALFA ROMEO', 'AUDI', 'BMW', 'CHEVROLET', 'CITROEN', 'FIAT', 'FORD',
  'HONDA', 'HYUNDAI', 'JEEP', 'KIA', 'LAND ROVER', 'LEXUS', 'MAZDA',
  'MERCEDES-BENZ', 'MITSUBISHI', 'NISSAN', 'PEUGEOT', 'PORSCHE',
  'RENAULT', 'SUBARU', 'SUZUKI', 'TOYOTA', 'VOLKSWAGEN', 'VOLVO',
];

function PosEcommerce() {
  const dispatch = useDispatch();
  const customerDiscounts = useSelector((state) => state.client)?.selectClient?.customerDiscounts;
  const [searchText, setSearchText] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [paginatorInfo, setPaginatorInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToLink, setProductToLink] = useState(null);
  const [productBrands, setProductBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [cardImageIndexes, setCardImageIndexes] = useState({});

  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText, vehicleBrand, productBrand, showSaleOnly]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const body = {
        page: currentPage,
        pageSize: viewMode === 'grid' ? 36 : 50,
      };
      if (debouncedSearchText) body.article = debouncedSearchText;
      if (vehicleBrand) body.description = vehicleBrand;
      if (productBrand) body.brand = productBrand;
      if (showSaleOnly) body.esOferta = true;

      const data = await searchProductsAndEquivalences(body);
      const allItems = [
        ...(data.list || []).map((eq) => ({
          id: eq.id,
          isEquivalence: true,
          article: eq.article,
          code: eq.code,
          description: eq.description,
          brand: eq.brand,
          stock: eq.totalStock,
          location: eq.location,
          price: eq.price,
          image: eq.image,
          images: eq.images,
          products: eq.products,
        })),
        ...(data.standaloneProducts || []).map((p) => ({
          id: p.id,
          isEquivalence: false,
          article: p.article,
          description: p.description,
          brand: p.brand,
          brandId: p.brandId,
          stock: p.stock,
          location: p.location,
          price: p.price,
          cost: p.cost,
          images: p.images,
        })),
      ];
      setProducts(allItems);
      setPaginatorInfo({
        totalPages: data.totalPages,
        totalRows: data.totalRows,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchText, vehicleBrand, productBrand, showSaleOnly, viewMode]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setBrandsLoading(true);
    getBrands()
      .then((brands) => {
        const filtered = (brands || [])
          .filter((b) => b.ecommerce === true && b.name && b.name.trim())
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((b) => b.name);
        setProductBrands(filtered);
      })
      .catch(() => {})
      .finally(() => setBrandsLoading(false));
  }, []);

  const addProduct = (productId, brandId, article, sellPrice, description, amount = 1) => {
    if (!sellPrice || sellPrice <= 0) return;
    const discount = customerDiscounts?.find((cd) => cd.brandId == brandId);
    const sellWithDiscount = discount ? sellPrice * (1 + discount.porcentaje) : sellPrice;
    dispatch(addLocalOrderItem({ productId, brandId, article, sellPrice: sellWithDiscount, description, amount }));
  };

  const handleLinked = () => {
    fetchProducts();
  };

  const handleReset = () => {
    setSearchText('');
    setVehicleBrand('');
    setProductBrand('');
    setShowSaleOnly(false);
  };

  const getProductImages = (product) => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.image?.url) return [product.image];
    return [];
  };

  const getCardImageIndex = (productId) => cardImageIndexes[productId] || 0;

  const prevCardImage = (e, productId, total) => {
    e.stopPropagation();
    setCardImageIndexes((prev) => ({
      ...prev,
      [productId]: prev[productId] <= 0 ? total - 1 : prev[productId] - 1,
    }));
  };

  const nextCardImage = (e, productId, total) => {
    e.stopPropagation();
    setCardImageIndexes((prev) => ({
      ...prev,
      [productId]: prev[productId] >= total - 1 ? 0 : (prev[productId] || 0) + 1,
    }));
  };

  return (
    <div className={styles.layout}>
      <div className={styles.mainContent}>
      <div className={styles.container}>
        <div className={styles.filterCard}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Buscar producto</label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por código o descripción..."
              className={styles.input}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Marca del vehículo</label>
            <select
              value={vehicleBrand}
              onChange={(e) => setVehicleBrand(e.target.value)}
              className={styles.select}
            >
              <option value="">Todas las marcas</option>
              {VEHICLE_BRANDS.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Marca del producto</label>
            <select
              value={productBrand}
              onChange={(e) => setProductBrand(e.target.value)}
              className={styles.select}
              disabled={brandsLoading}
            >
              <option value="">{brandsLoading ? 'Cargando...' : 'Todas las marcas'}</option>
              {productBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterActions}>
            <div className={styles.filterGroup}>
              <label className={styles.label}>Ofertas</label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={showSaleOnly}
                  onChange={(e) => setShowSaleOnly(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Solo ofertas</span>
              </label>
            </div>
            <div className={styles.viewToggle}>
              <button
                onClick={() => setViewMode('grid')}
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                title="Vista de cuadrícula"
              >
                <i className="fa-solid fa-th" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                title="Vista de lista"
              >
                <i className="fa-solid fa-list" />
              </button>
            </div>
            <button onClick={handleReset} className={styles.resetButton}>
              <i className="fa-solid fa-times" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        </div>

      {loading && <LoadingSpinner loading={loading} />}

      {!loading && products.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className={styles.productGrid}>
              {products.map((product) => {
                const cardImages = getProductImages(product);
                const cardIdx = getCardImageIndex(product.id);
                return (
                  <div key={`${product.isEquivalence ? 'eq' : 'prod'}-${product.id}`} className={styles.productCard}>
                    <div
                      className={styles.cardImage}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {cardImages.length > 0 ? (
                        <div className={styles.cardImageCarousel}>
                          <img
                            src={cardImages[cardIdx]?.url}
                            alt={product.article}
                          />
                          {cardImages.length > 1 && (
                            <>
                              <button
                                className={styles.cardImageArrow}
                                onClick={(e) => prevCardImage(e, product.id, cardImages.length)}
                                title="Imagen anterior"
                              >
                                <i className="fa-solid fa-chevron-left" />
                              </button>
                              <button
                                className={`${styles.cardImageArrow} ${styles.cardImageArrowRight}`}
                                onClick={(e) => nextCardImage(e, product.id, cardImages.length)}
                                title="Siguiente imagen"
                              >
                                <i className="fa-solid fa-chevron-right" />
                              </button>
                              <span className={styles.cardImageCounter}>
                                {cardIdx + 1}/{cardImages.length}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className={styles.cardImagePlaceholder}>
                          <i className="fa-solid fa-box" />
                        </div>
                      )}
                    </div>
                  <div className={styles.cardBody}>
                    <span
                      className={styles.cardArticle}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.isEquivalence ? (product.code || 'GRUPO S/C') : product.article}
                    </span>
                    <div className={styles.cardDescriptionWrap}>
                      <p
                        className={styles.cardDescription}
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.description}
                      </p>
                      <span className={styles.cardDescriptionTip}>{product.description}</span>
                    </div>
                    <span className={styles.cardBrand}>{product.brand}</span>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardStock}>
                        Stock: {product.stock ?? 0}
                      </span>
                      <div className={styles.cardActions}>
                        {!product.isEquivalence && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductToLink(product);
                            }}
                            className={styles.linkEquivBtn}
                            title="Vincular a grupo de equivalencias"
                          >
                            <i className="fa-solid fa-layer-group" />
                          </button>
                        )}
                        {product.price && (
                          <span className={styles.cardPrice}>
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          ) : (
            <div className={styles.productList}>
              {products.map((product) => {
                const rowImages = getProductImages(product);
                const rowIdx = getCardImageIndex(product.id);
                return (
                  <div key={`${product.isEquivalence ? 'eq' : 'prod'}-${product.id}`} className={styles.productRow}>
                    <div
                      className={styles.rowImage}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {rowImages.length > 0 ? (
                        <div className={styles.rowImageCarousel}>
                          <img
                            src={rowImages[rowIdx]?.url}
                            alt={product.article}
                          />
                          {rowImages.length > 1 && (
                            <>
                              <button
                                className={styles.rowImageArrow}
                                onClick={(e) => prevCardImage(e, product.id, rowImages.length)}
                                title="Imagen anterior"
                              >
                                <i className="fa-solid fa-chevron-left" />
                              </button>
                              <button
                                className={`${styles.rowImageArrow} ${styles.rowImageArrowRight}`}
                                onClick={(e) => nextCardImage(e, product.id, rowImages.length)}
                                title="Siguiente imagen"
                              >
                                <i className="fa-solid fa-chevron-right" />
                              </button>
                              <span className={styles.rowImageCounter}>
                                {rowIdx + 1}/{rowImages.length}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className={styles.rowImagePlaceholder}>
                          <i className="fa-solid fa-box" />
                        </div>
                      )}
                    </div>
                  <div className={styles.rowInfo}>
                    <span
                      className={styles.rowArticle}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.isEquivalence ? (product.code || 'GRUPO S/C') : product.article}
                    </span>
                    <p
                      className={styles.rowDescription}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.description}
                    </p>
                    <span className={styles.rowBrand}>{product.brand}</span>
                  </div>
                  <div className={styles.rowMeta}>
                    {!product.isEquivalence && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToLink(product);
                        }}
                        className={styles.linkEquivRowBtn}
                        title="Vincular a grupo de equivalencias"
                      >
                        <i className="fa-solid fa-layer-group" />
                      </button>
                    )}
                    <span className={styles.rowStock}>Stock: {product.stock ?? 0}</span>
                    {product.price && (
                      <span className={styles.rowPrice}>${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          )}

          {paginatorInfo && paginatorInfo.totalPages > 1 && (
            <div className={styles.paginationWrapper}>
              <CustomPagination
                pages={paginatorInfo.totalPages}
                initPage={currentPage}
                changeFn={(page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          )}
        </>
      )}

      {paginatorInfo && (
        <div className={styles.resultInfo}>
          <span className={styles.resultText}>
            Se encontraron <strong>{paginatorInfo.totalRows}</strong> resultados en{' '}
            <strong>{paginatorInfo.totalPages}</strong> páginas
          </span>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-search" />
          <p>No se encontraron productos</p>
        </div>
      )}

      {selectedProduct && (
        selectedProduct.isEquivalence ? (
          <>
            {/* Componente anterior conservado como referencia */}
            {/*
            <PosEcommerceEquivalenceModal
              equivalence={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              addProduct={addProduct}
            />
            */}
            <PosEcommerceEquivalenceModalV2
              equivalence={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              addProduct={addProduct}
            />
          </>
        ) : (
          <PosEcommerceProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            addProduct={addProduct}
          />
        )
      )}

      {productToLink && (
        <LinkEquivalenceModal
          product={productToLink}
          onClose={() => setProductToLink(null)}
          onLinked={handleLinked}
        />
      )}
        </div>
      </div>
    </div>
      <PosEcommerceOrderSidebar addProduct={addProduct} />
    </div>
  );
}

export default PosEcommerce;
