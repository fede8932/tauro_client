import React, { useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './melimanage.module.css';
import MeliPricingExceptionModal from './MeliPricingExceptionModal';
import {
  getMeliBrandPricing,
  getMeliProductPricing,
  deleteMeliBrandPricing,
  deleteMeliProductPricing,
} from '../../request/meliRequest';

const FIELD_LABELS = {
  meliCommission: 'comisión',
  channelMargin: 'margen',
  fixedFee: 'cargo fijo',
  freeShippingThreshold: 'umbral envío',
  priceMode: 'modo',
  roundingMode: 'redondeo',
  minPublishPrice: 'piso',
};

function overrideFields(overrideValues) {
  if (!overrideValues) return [];
  return Object.entries(FIELD_LABELS)
    .filter(([key]) => overrideValues[key] !== null && overrideValues[key] !== undefined && overrideValues[key] !== '')
    .map(([key, label]) => label);
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Normaliza texto para comparar sin acentos ni mayúsculas. */
function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Resalta la coincidencia dentro de un texto (devuelve nodos React). */
function Highlight({ text, term }) {
  const value = String(text || '');
  const needle = normalizeText(term);
  if (!needle) return value;

  const haystack = normalizeText(value);
  const parts = [];
  let idx = 0;
  let found = haystack.indexOf(needle);
  while (found !== -1) {
    if (found > idx) parts.push(value.slice(idx, found));
    parts.push(
      <mark key={found} className={styles.searchMark}>
        {value.slice(found, found + needle.length)}
      </mark>
    );
    idx = found + needle.length;
    found = haystack.indexOf(needle, idx);
  }
  parts.push(value.slice(idx));
  return parts;
}

function FieldChips({ overrideValues }) {
  const fields = overrideFields(overrideValues);
  if (fields.length === 0) return <span className={styles.hint}>Hereda todo</span>;
  return (
    <div className={styles.chipRow}>
      {fields.map((f) => (
        <span key={f} className={`${styles.chip} ${styles.chipOk}`}>
          {f}
        </span>
      ))}
    </div>
  );
}

export default function MeliPricingExceptions({ onMessage }) {
  const [mode, setMode] = useState('brand');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [brandItems, setBrandItems] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [brandQuery, setBrandQuery] = useState('');
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandActive, setBrandActive] = useState(0);

  const [productItems, setProductItems] = useState([]);
  const [productTotal, setProductTotal] = useState(0);
  const [productQuery, setProductQuery] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [productActive, setProductActive] = useState(0);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const brandWrapRef = useRef(null);
  const productWrapRef = useRef(null);
  const brandItemRefs = useRef([]);
  const productItemRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    getMeliBrandPricing({ onlyOverrides: false })
      .then((res) => setAllBrands(res.items || []))
      .catch(() => setAllBrands([]));
  }, []);

  // Marcas que coinciden con lo escrito (filtro local, sin acentos ni mayúsculas).
  const brandMatches = useMemo(() => {
    const needle = normalizeText(brandQuery);
    if (!needle) return [];
    return allBrands
      .filter((b) => normalizeText(b.brandName).includes(needle))
      .slice(0, 40);
  }, [allBrands, brandQuery]);

  const brandResultsOpen = mode === 'brand' && brandOpen && brandQuery.trim().length > 0;

  // Cierra los dropdowns al hacer clic afuera.
  useEffect(() => {
    const onDocClick = (e) => {
      if (brandWrapRef.current && !brandWrapRef.current.contains(e.target)) setBrandOpen(false);
      if (productWrapRef.current && !productWrapRef.current.contains(e.target)) setProductOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'brand') {
        const res = await getMeliBrandPricing({
          onlyOverrides: true,
          search: debouncedSearch || undefined,
        });
        setBrandItems(res.items || []);
      } else {
        const res = await getMeliProductPricing({
          onlyOverrides: true,
          search: debouncedSearch || undefined,
          page,
          pageSize,
        });
        const items = res.items || [];
        const total = res.total || 0;
        setProductItems(items);
        setProductTotal(total);
        if (items.length === 0 && page > 1 && total > 0) {
          setPage(Math.max(1, Math.ceil(total / pageSize)));
        }
      }
    } catch (e) {
      setError(e.response?.data?.message || 'No se pudieron cargar las excepciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, debouncedSearch, page]);

  useEffect(() => {
    if (mode !== 'product' || productQuery.trim().length < 1) {
      setProductResults([]);
      return undefined;
    }
    let active = true;
    const timer = setTimeout(async () => {
      setSearchingProducts(true);
      try {
        const res = await getMeliProductPricing({
          onlyOverrides: false,
          search: productQuery.trim(),
          pageSize: 10,
        });
        if (active) setProductResults(res.items || []);
      } catch {
        if (active) setProductResults([]);
      } finally {
        if (active) setSearchingProducts(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [mode, productQuery]);

  const productResultsOpen =
    mode === 'product' && productOpen && productQuery.trim().length >= 1;

  const switchMode = (next) => {
    setMode(next);
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
    setError('');
    setBrandQuery('');
    setBrandOpen(false);
    setProductQuery('');
    setProductResults([]);
    setProductOpen(false);
  };

  const pickBrand = (brand) => {
    setModal({ scope: 'brand', target: brand });
    setBrandQuery('');
    setBrandOpen(false);
  };

  const openProduct = (item) => {
    setModal({ scope: 'product', target: item });
    setProductQuery('');
    setProductResults([]);
    setProductOpen(false);
  };

  // Flechas/Enter/Escape para el combobox de marcas.
  const onBrandKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!brandResultsOpen) {
        setBrandOpen(true);
        return;
      }
      setBrandActive((prev) => {
        const max = Math.max(0, brandMatches.length - 1);
        if (e.key === 'ArrowDown') return Math.min(prev + 1, max);
        return Math.max(prev - 1, 0);
      });
    } else if (e.key === 'Enter') {
      const pick = brandMatches[brandActive];
      if (brandResultsOpen && pick) {
        e.preventDefault();
        pickBrand(pick);
      }
    } else if (e.key === 'Escape') {
      setBrandOpen(false);
    }
  };

  // Flechas/Enter/Escape para el buscador de productos.
  const onProductKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!productResultsOpen) {
        setProductOpen(true);
        return;
      }
      setProductActive((prev) => {
        const max = Math.max(0, productResults.length - 1);
        if (e.key === 'ArrowDown') return Math.min(prev + 1, max);
        return Math.max(prev - 1, 0);
      });
    } else if (e.key === 'Enter') {
      const pick = productResults[productActive];
      if (productResultsOpen && pick) {
        e.preventDefault();
        openProduct(pick);
      }
    } else if (e.key === 'Escape') {
      setProductOpen(false);
    }
  };

  // Mantiene visible el ítem activo dentro del dropdown.
  useEffect(() => {
    if (brandResultsOpen) brandItemRefs.current[brandActive]?.scrollIntoView({ block: 'nearest' });
  }, [brandActive, brandResultsOpen]);
  useEffect(() => {
    if (productResultsOpen) productItemRefs.current[productActive]?.scrollIntoView({ block: 'nearest' });
  }, [productActive, productResultsOpen]);

  const removeBrand = async (item) => {
    const res = await Swal.fire({
      title: '¿Eliminar la excepción de marca?',
      text: `${item.brandName} volverá a heredar la política general.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#c62828',
    });
    if (!res.isConfirmed) return;
    try {
      await deleteMeliBrandPricing(item.brandId);
      onMessage?.('Excepción de marca eliminada.');
      await load();
      getMeliBrandPricing({ onlyOverrides: false })
        .then((r) => setAllBrands(r.items || []))
        .catch(() => {});
    } catch (e) {
      setError(e.response?.data?.message || 'No se pudo eliminar la excepción.');
    }
  };

  const removeProduct = async (item) => {
    const res = await Swal.fire({
      title: '¿Eliminar la excepción de producto?',
      text: `${item.brandName} — ${item.article} volverá a heredar la política de su marca.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#c62828',
    });
    if (!res.isConfirmed) return;
    try {
      await deleteMeliProductPricing(item.productId);
      onMessage?.('Excepción de producto eliminada.');
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'No se pudo eliminar la excepción.');
    }
  };

  const onSaved = async () => {
    setModal(null);
    await load();
    getMeliBrandPricing({ onlyOverrides: false })
      .then((res) => setAllBrands(res.items || []))
      .catch(() => {});
  };

  const totalPages = Math.max(1, Math.ceil(productTotal / pageSize));

  return (
    <div className={styles.exceptions}>
      <div className={styles.exceptionsHead}>
        <div>
          <h4>Excepciones por marca o producto</h4>
          <p className={styles.hint}>
            Se aplican campo por campo sobre la política general. El precio fijo de una publicación
            sigue teniendo prioridad sobre cualquier excepción.
          </p>
        </div>
        <div className={styles.segmented}>
          <button
            type="button"
            className={mode === 'brand' ? styles.segmentActive : styles.segment}
            onClick={() => switchMode('brand')}
          >
            <i className="fas fa-tags" /> Marcas
          </button>
          <button
            type="button"
            className={mode === 'product' ? styles.segmentActive : styles.segment}
            onClick={() => switchMode('product')}
          >
            <i className="fas fa-box" /> Productos
          </button>
        </div>
      </div>

      <div className={styles.exceptionsToolbar}>
        <input
          className={styles.exceptionsSearch}
          placeholder={
            mode === 'brand'
              ? 'Buscar marca…'
              : 'Buscar excepciones por código o descripción…'
          }
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {mode === 'brand' ? (
          <div className={styles.productSearchWrap} ref={brandWrapRef}>
            <input
              className={styles.exceptionsSearch}
              placeholder="+ Nueva excepción de marca…"
              value={brandQuery}
              onChange={(e) => {
                setBrandQuery(e.target.value);
                setBrandActive(0);
                setBrandOpen(true);
              }}
              onFocus={() => setBrandOpen(true)}
              onKeyDown={onBrandKeyDown}
            />
            {brandResultsOpen && (
              <div className={styles.productSearchResults}>
                {brandMatches.length === 0 && (
                  <p className={styles.hint}>Ninguna marca coincide con “{brandQuery}”.</p>
                )}
                {brandMatches.map((b, idx) => (
                  <button
                    type="button"
                    key={b.brandId}
                    ref={(el) => {
                      brandItemRefs.current[idx] = el;
                    }}
                    className={`${styles.productSearchItem} ${
                      idx === brandActive ? styles.productSearchItemActive : ''
                    }`}
                    onMouseEnter={() => setBrandActive(idx)}
                    onClick={() => pickBrand(b)}
                  >
                    <div className={styles.searchItemTop}>
                      <b>
                        <Highlight text={b.brandName} term={brandQuery} />
                      </b>
                      {b.hasOverride && <em>Ya tiene excepción</em>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.productSearchWrap} ref={productWrapRef}>
            <input
              className={styles.exceptionsSearch}
              placeholder="+ Buscar producto por código o descripción…"
              value={productQuery}
              onChange={(e) => {
                setProductQuery(e.target.value);
                setProductActive(0);
                setProductOpen(true);
              }}
              onFocus={() => setProductOpen(true)}
              onKeyDown={onProductKeyDown}
            />
            {productResultsOpen && (
              <div className={styles.productSearchResults}>
                {searchingProducts && <p className={styles.hint}>Buscando…</p>}
                {!searchingProducts && productResults.length === 0 && (
                  <p className={styles.hint}>Ningún producto coincide con “{productQuery}”.</p>
                )}
                {productResults.map((p, idx) => (
                  <button
                    type="button"
                    key={p.productId}
                    ref={(el) => {
                      productItemRefs.current[idx] = el;
                    }}
                    className={`${styles.productSearchItem} ${
                      idx === productActive ? styles.productSearchItemActive : ''
                    }`}
                    onMouseEnter={() => setProductActive(idx)}
                    onClick={() => openProduct(p)}
                  >
                    <div className={styles.searchItemTop}>
                      <b className={styles.searchItemCode}>
                        <Highlight text={p.article} term={productQuery} />
                      </b>
                      <span className={styles.searchItemBrand}>
                        <Highlight text={p.brandName} term={productQuery} />
                      </span>
                      {p.hasOverride && <em>Ya tiene excepción</em>}
                    </div>
                    <span className={styles.searchItemDesc}>
                      <Highlight text={p.description} term={productQuery} />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className={styles.modalError}>{error}</p>}

      {loading ? (
        <p className={styles.hint}>Cargando excepciones…</p>
      ) : mode === 'brand' ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Marca</th>
                <th>Campos personalizados</th>
                <th>Actualizado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {brandItems.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.hint}>
                    No hay excepciones de marca configuradas.
                  </td>
                </tr>
              )}
              {brandItems.map((item) => (
                <tr key={item.brandId}>
                  <td data-label="Marca">
                    <b>
                      <Highlight text={item.brandName} term={search} />
                    </b>
                  </td>
                  <td data-label="Campos personalizados">
                    <FieldChips overrideValues={item.overrideValues} />
                  </td>
                  <td data-label="Actualizado">{formatDate(item.updatedAt)}</td>
                  <td data-label="Acciones">
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                        onClick={() => setModal({ scope: 'brand', target: item })}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                        onClick={() => removeBrand(item)}
                      >
                        Quitar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Marca</th>
                  <th>Campos personalizados</th>
                  <th>Actualizado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className={styles.hint}>
                      No hay excepciones de producto configuradas.
                    </td>
                  </tr>
                )}
                {productItems.map((item) => (
                  <tr key={item.productId}>
                    <td data-label="Producto">
                      <b>
                        <Highlight text={item.article} term={search} />
                      </b>
                      <div className={styles.subText}>
                        <Highlight text={item.description} term={search} />
                      </div>
                    </td>
                    <td data-label="Marca">{item.brandName}</td>
                    <td data-label="Campos personalizados">
                      <FieldChips overrideValues={item.overrideValues} />
                    </td>
                    <td data-label="Actualizado">{formatDate(item.updatedAt)}</td>
                    <td data-label="Acciones">
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                          onClick={() => setModal({ scope: 'product', target: item })}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                          onClick={() => removeProduct(item)}
                        >
                          Quitar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pager}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnGhost}`}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages} · {productTotal} excepción(es)
            </span>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnGhost}`}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {modal && (
        <MeliPricingExceptionModal
          scope={modal.scope}
          target={modal.target}
          onClose={() => setModal(null)}
          onSaved={onSaved}
          onMessage={onMessage}
        />
      )}
    </div>
  );
}
