import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './melimanage.module.css';
import ErrorChip from './MeliErrorChip';
import { getMeliCatalog, publishProduct, publishBatchProducts, getPublishQueueStatus, retryFailedPublications } from '../../request/meliRequest';

/* ------------------------------------------------------------------ */
/* Constantes y helpers                                                */
/* ------------------------------------------------------------------ */

const DEFAULT_FILTERS = {
  meliStatus: 'none', // none | linked | active | paused | paused_stock | closed | error | draft | all
  stock: 'with', // with | without | all
  equivalence: 'all', // with | without | all
  image: 'all', // with | without | all
  onlyPublishable: false,
  onlyWithError: false,
  minPrice: '',
  maxPrice: '',
  minStock: '',
  sortBy: 'stock',
  sortDir: 'desc',
  pageSize: 25,
};

const STATUS_LABELS = {
  none: 'Sin publicar',
  linked: 'Publicado',
  active: 'Activa',
  paused: 'Pausada',
  paused_stock: 'Pausada por stock',
  closed: 'Cerrada',
  error: 'Con error',
  draft: 'Borrador',
  under_review: 'En revisión',
  all: 'Todos',
};

const STATUS_BADGE = {
  active: 'badgeSuccess',
  paused: 'badgeWarn',
  paused_stock: 'badgeWarn',
  error: 'badgeDanger',
  closed: 'badgeMuted',
  draft: 'badgeMuted',
  under_review: 'badgeInfo',
};

/** Traduce un estado de MELI a las clases de badge del módulo de estilos. */
const statusBadgeClass = (status) => `${styles.badge} ${styles[STATUS_BADGE[status] || 'badgeMuted']}`;

const money = (v) =>
  v === null || v === undefined || Number.isNaN(Number(v))
    ? '—'
    : Number(v).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const num = (v) => (v === null || v === undefined ? '—' : Number(v).toLocaleString('es-AR'));

const debounce = (fn, ms) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

/* ------------------------------------------------------------------ */
/* Selector de marcas (multiselección con buscador)                    */
/* ------------------------------------------------------------------ */

function BrandPicker({ brands, selected, onChange, open, onToggle }) {
  const [term, setTerm] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onToggle(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onToggle]);

  const list = useMemo(() => {
    const t = term.trim().toLowerCase();
    const rows = t ? brands.filter((b) => b.name.toLowerCase().includes(t)) : brands;
    return [...rows].sort((a, b) => b.total - a.total);
  }, [brands, term]);

  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <div className={styles.brandPicker} ref={ref}>
      <button type="button" className={styles.brandTrigger} onClick={() => onToggle(!open)}>
        <span>
          {selected.length === 0
            ? 'Todas las marcas'
            : selected.length === 1
              ? brands.find((b) => b.brandId === selected[0])?.name || '1 marca'
              : `${selected.length} marcas`}
        </span>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'}`} />
      </button>

      {open && (
        <div className={styles.brandPanel}>
          <input
            className={styles.brandSearch}
            placeholder="Filtrar marca…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
          />
          {selected.length > 0 && (
            <button type="button" className={styles.brandClear} onClick={() => onChange([])}>
              Limpiar selección ({selected.length})
            </button>
          )}
          <div className={styles.brandList}>
            {list.length === 0 && <div className={styles.brandEmpty}>Sin marcas</div>}
            {list.map((b) => (
              <label key={b.brandId} className={styles.brandOption}>
                <input
                  type="checkbox"
                  checked={selected.includes(b.brandId)}
                  onChange={() => toggle(b.brandId)}
                />
                <span className={styles.brandName}>{b.name}</span>
                <span className={styles.brandCount}>{num(b.total)}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tarjeta de producto                                                 */
/* ------------------------------------------------------------------ */

function ProductCard({ p, selected, onToggle, onPublish, onPublishCategory, busy }) {
  return (
    <article className={`${styles.card} ${selected ? styles.cardSelected : ''}`}>
      <div className={styles.cardHead}>
        <input
          type="checkbox"
          disabled={!p.canPublish}
          checked={selected}
          onChange={onToggle}
          title={p.canPublish ? 'Seleccionar para publicar en lote' : `No se puede publicar: ${p.blockReason}`}
        />
        {p.isLinked ? (
          <span className={statusBadgeClass(p.meliStatus)}>
            {p.meliStatus}
          </span>
        ) : p.canPublish ? (
          <span className={`${styles.badge} ${styles.badgeInfo}`}>Listo para publicar</span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeMuted}`}>{p.blockReason}</span>
        )}
      </div>

      <div className={styles.cardThumb}>
        {p.firstImage ? (
          <img src={p.firstImage} alt={p.article} loading="lazy" />
        ) : (
          <div className={styles.thumbEmpty}>
            <i className="fas fa-image" />
            <span>Sin imagen</span>
          </div>
        )}
        {p.totalImageCount > 1 && <span className={styles.photoCount}>+{p.totalImageCount - 1}</span>}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>
          <b>{p.brand}</b> · {p.article}
        </div>
        <p className={styles.cardDesc} title={p.description}>
          {p.description}
        </p>

        <div className={styles.cardChips}>
          <span className={`${styles.chip} ${p.localStock > 0 ? styles.chipOk : styles.chipOff}`}>
            <i className="fas fa-box" /> {num(p.localStock)} en stock
          </span>
          {p.equivalenceCode && (
            <span className={styles.chip} title={p.equivalenceDescription || undefined}>
              <i className="fas fa-link" /> {p.equivalenceCode}
            </span>
          )}
          {p.location && (
            <span className={styles.chip}>
              <i className="fas fa-location-dot" /> {p.location}
            </span>
          )}
        </div>

        <div className={styles.cardPrices}>
          <div>
            <span className={styles.priceLabel}>Local</span>
            <b>${money(p.localPrice)}</b>
          </div>
          <i className={`fas fa-arrow-right ${styles.priceArrow}`} />
          <div>
            <span className={styles.priceLabel}>Estimado MELI</span>
            <b className={styles.priceMeli}>${money(p.estimatedMeliPrice)}</b>
          </div>
          {p.priceOverride > 0 && <span className={styles.overrideTag}>precio fijo</span>}
        </div>

        {p.lastSyncError && (
          <div className={styles.cellErr}>
            <ErrorChip error={p.lastSyncError} />
          </div>
        )}
      </div>

      <div className={styles.cardActions}>
        <button
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
          disabled={busy || !p.canPublish}
          onClick={onPublish}
        >
          Publicar
        </button>
        <button
          className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
          disabled={busy || !p.canPublish}
          onClick={onPublishCategory}
          title="Especificar categoría de MELI manualmente"
        >
          Categoría…
        </button>
        {p.permalink && (
          <a
            className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
            href={p.permalink}
            target="_blank"
            rel="noreferrer"
          >
            Ver en MELI
          </a>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Tab de catálogo                                                     */
/* ------------------------------------------------------------------ */

function MeliCatalogTab({ onPublished }) {
  const [data, setData] = useState({ total: 0, page: 1, pageSize: 25, totalPages: 0, items: [], summary: null, brands: [] });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [brandIds, setBrandIds] = useState([]);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  // La vista (tarjetas / tabla) se persiste en localStorage para que al volver
  // al tab quede la que el usuario eligió.
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem('meliCatalogView') === 'list' ? 'list' : 'grid';
    } catch {
      return 'grid';
    }
  });
  const changeView = (v) => {
    setView(v);
    try {
      localStorage.setItem('meliCatalogView', v);
    } catch {
      /* almacenamiento no disponible (modo privado): se usa sólo en memoria */
    }
  };
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const runSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const debouncedSearch = useMemo(() => debounce(runSearch, 400), [runSearch]);

  const load = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMeliCatalog({
          search: search || undefined,
          brandIds: brandIds.length ? brandIds.join(',') : undefined,
          meliStatus: filters.meliStatus,
          stock: filters.stock,
          equivalence: filters.equivalence,
          image: filters.image,
          onlyPublishable: filters.onlyPublishable || undefined,
          onlyWithError: filters.onlyWithError || undefined,
          minPrice: filters.minPrice === '' ? undefined : filters.minPrice,
          maxPrice: filters.maxPrice === '' ? undefined : filters.maxPrice,
          minStock: filters.minStock === '' ? undefined : filters.minStock,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
          page,
          pageSize: filters.pageSize,
          includeFacets: opts.withFacets !== false,
        });
        setData(res);
      } catch (e) {
        setError(e.response?.data?.message || 'No se pudo cargar el catálogo. Revisá la conexión e intentá de nuevo.');
      } finally {
        setLoading(false);
      }
    },
    [search, brandIds, filters, page]
  );

  // Una sola carga por render: se piden los facets por marca sólo cuando cambian los filtros
  // (al cambiar de página no hace falta recalcular los contadores).
  const lastRequestRef = useRef({ page: null, filtersKey: null });
  useEffect(() => {
    const filtersKey = JSON.stringify({ search, brandIds, filters });
    const withFacets = lastRequestRef.current.filtersKey !== filtersKey;
    lastRequestRef.current = { page, filtersKey };
    load({ withFacets });
  }, [load]);

  const setFilter = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
    setSelected([]);
  };

  const summary = data.summary || {};
  const totalSelected = selected.length;

  const publishablesOnPage = useMemo(() => data.items.filter((i) => i.canPublish), [data.items]);
  const allVisibleSelected =
    publishablesOnPage.length > 0 && publishablesOnPage.every((i) => selected.includes(i.productId));

  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () => {
    const publishables = publishablesOnPage.map((i) => i.productId);
    setSelected(allVisibleSelected ? [] : [...new Set([...selected, ...publishables])]);
  };

  const publishOne = async (p, askCategory = false) => {
    let categoryId = null;
    if (askCategory) {
      const res = await Swal.fire({
        title: 'Categoría de MELI',
        input: 'text',
        inputLabel: 'ID de categoría (ej. MLA373345)',
        inputPlaceholder: 'Dejá vacío para predicción automática',
        showCancelButton: true,
        confirmButtonText: 'Publicar',
        cancelButtonText: 'Cancelar',
      });
      if (!res.isConfirmed) return;
      categoryId = (res.value || '').trim() || null;
    }
    setBusyId(p.productId);
    try {
      const res = await publishProduct(p.productId, categoryId);
      setSelected((prev) => prev.filter((x) => x !== p.productId));
      await load();
      onPublished?.();
      Swal.fire({
        icon: 'success',
        title: 'Publicado en MELI',
        text: `Se creó la publicación ${res.meliItemId} en estado pausado. Revisá el aviso y activá la publicación.`,
      });
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: e.response?.data?.message || 'No se pudo publicar el producto',
      });
    } finally {
      setBusyId(null);
    }
  };

  const publishSelected = async () => {
    if (totalSelected === 0) return;
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se publicarán ${totalSelected} producto(s) en MELI en estado pausado. Las imágenes se formatean y suben automáticamente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, publicar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;
    setBusyId('batch');
    try {
      const res = await publishBatchProducts(selected);
      setSelected([]);
      const skipped = res.skippedAlreadyPublished?.length || 0;
      const toastMsg = `${res.enqueued} publicación(es) encoladas.${skipped ? ` ${skipped} ya estaban publicadas y se omitieron.` : ''}`;
      Swal.fire({ icon: 'success', title: 'Publicaciones encoladas', text: toastMsg });
      // Seguimiento en vivo de la cola hasta que termine.
      await trackPublishQueue();
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: e.response?.data?.message || 'Error en la publicación por lote',
      });
    } finally {
      setBusyId(null);
    }
  };

  // Reencola todos los intentos que quedaron en estado error y sigue la cola igual que
  // la publicación masiva.
  const retryFailed = async () => {
    const confirm = await Swal.fire({
      title: '¿Reintentar publicaciones fallidas?',
      text: 'Se reencolarán todos los intentos que quedaron en estado error.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reintentar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;
    setBusyId('batch');
    try {
      const res = await retryFailedPublications();
      if (!res?.enqueued) {
        Swal.fire({ icon: 'info', title: 'Sin fallos pendientes', text: 'No hay publicaciones fallidas para reintentar.' });
        return;
      }
      await trackPublishQueue();
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: e.response?.data?.message || 'Error al reintentar publicaciones',
      });
    } finally {
      setBusyId(null);
    }
  };

  // Consulta el estado de la cola de publicación cada pocos segundos y refresca la
  // lista; cierra el seguimiento cuando no queda nada pendiente ni procesando.
  const trackPublishQueue = async () => {
    const maxMs = 10 * 60 * 1000; // techo de seguimiento
    const started = Date.now();
    while (Date.now() - started < maxMs) {
      await new Promise((r) => setTimeout(r, 4000));
      let st;
      try {
        st = await getPublishQueueStatus();
      } catch {
        continue;
      }
      if (st.pending === 0 && !st.isProcessing) {
        await load();
        onPublished?.();
        if (st.failed > 0) {
          const errs = (st.recentErrors || [])
            .slice(0, 5)
            .map((e) => `Producto ${e.key ?? e.Key}: ${e.value ?? e.Value}`)
            .join('\n');
          Swal.fire({
            icon: 'warning',
            title: 'Publicación masiva finalizada',
            text: `${st.succeeded} exitosas, ${st.failed} con error.\n\n${errs}`,
          });
        } else if (st.succeeded > 0) {
          Swal.fire({ icon: 'success', title: 'Publicación masiva finalizada', text: `${st.succeeded} publicaciones creadas en estado pausado.` });
        }
        return;
      }
      await load();
    }
  };

  const activeChips = [];
  if (search) activeChips.push({ key: 'search', label: `Búsqueda: “${search}”`, clear: () => { setSearchInput(''); runSearch(''); } });
  if (filters.meliStatus !== 'all')
    activeChips.push({ key: 'status', label: STATUS_LABELS[filters.meliStatus] || filters.meliStatus, clear: () => setFilter({ meliStatus: 'all' }) });
  if (filters.stock !== 'all')
    activeChips.push({ key: 'stock', label: filters.stock === 'with' ? 'Con stock' : 'Sin stock', clear: () => setFilter({ stock: 'all' }) });
  if (filters.equivalence !== 'all')
    activeChips.push({ key: 'eq', label: filters.equivalence === 'with' ? 'Con equivalencia' : 'Sin equivalencia', clear: () => setFilter({ equivalence: 'all' }) });
  if (filters.image !== 'all')
    activeChips.push({ key: 'img', label: filters.image === 'with' ? 'Con imagen' : 'Sin imagen', clear: () => setFilter({ image: 'all' }) });
  if (filters.onlyPublishable) activeChips.push({ key: 'pub', label: 'Sólo publicables', clear: () => setFilter({ onlyPublishable: false }) });
  if (filters.onlyWithError) activeChips.push({ key: 'err', label: 'Sólo con error', clear: () => setFilter({ onlyWithError: false }) });
  brandIds.forEach((id) => {
    const b = data.brands.find((x) => x.brandId === id);
    activeChips.push({ key: `b${id}`, label: b?.name || `Marca ${id}`, clear: () => setBrandIds(brandIds.filter((x) => x !== id)) });
  });
  if (filters.minPrice !== '' || filters.maxPrice !== '')
    activeChips.push({ key: 'price', label: `Precio $${filters.minPrice || 0} – $${filters.maxPrice || '∞'}`, clear: () => setFilter({ minPrice: '', maxPrice: '' }) });
  if (filters.minStock !== '')
    activeChips.push({ key: 'minstock', label: `Stock ≥ ${filters.minStock}`, clear: () => setFilter({ minStock: '' }) });

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setBrandIds([]);
    setSearchInput('');
    runSearch('');
    setPage(1);
    setSelected([]);
  };

  const goToPage = (p) => {
    const target = Math.min(Math.max(1, p), data.totalPages || 1);
    if (target !== page) setPage(target);
  };

  return (
    <div className={styles.catalog}>
      {/* ---------- Barra de búsqueda ---------- */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <i className="fas fa-magnifying-glass" />
          <input
            placeholder="Buscar por artículo, descripción, marca, código de equivalencia o ID de MELI…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSearch(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(searchInput)}
          />
          {searchInput && (
            <button type="button" className={styles.searchClear} onClick={() => { setSearchInput(''); runSearch(''); }}>
              <i className="fas fa-xmark" />
            </button>
          )}
        </div>

        <BrandPicker
          brands={data.brands}
          selected={brandIds}
          onChange={(ids) => { setBrandIds(ids); setPage(1); setSelected([]); }}
          open={brandsOpen}
          onToggle={setBrandsOpen}
        />

        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setAdvanced(!advanced)}>
          <i className="fas fa-sliders" /> Filtros
          {activeChips.length > 0 && <span className={styles.filterDot} />}
        </button>

        <div className={styles.viewToggle}>
          <button type="button" className={view === 'grid' ? styles.viewBtnActive : styles.viewBtn} onClick={() => changeView('grid')} title="Vista de tarjetas">
            <i className="fas fa-grip" />
          </button>
          <button type="button" className={view === 'list' ? styles.viewBtnActive : styles.viewBtn} onClick={() => changeView('list')} title="Vista de tabla">
            <i className="fas fa-list" />
          </button>
        </div>

        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => load()} disabled={loading} title="Recargar">
          <i className={`fas fa-rotate ${loading ? styles.spin : ''}`} />
        </button>
      </div>

      {/* ---------- Filtros rápidos ---------- */}
      <div className={styles.chipRow}>
        {[
          { label: 'Sin publicar', patch: { meliStatus: 'none' } },
          { label: 'Publicados', patch: { meliStatus: 'linked' } },
          { label: 'Con stock', patch: { stock: 'with' } },
          { label: 'Sin stock', patch: { stock: 'without' } },
          { label: 'Con imagen', patch: { image: 'with' } },
          { label: 'Sin imagen', patch: { image: 'without' } },
          { label: 'Con equivalencia', patch: { equivalence: 'with' } },
          { label: 'Listos para publicar', patch: { onlyPublishable: true } },
          { label: 'Con errores', patch: { onlyWithError: true } },
        ].map((c) => {
          const active = Object.entries(c.patch).every(([k, v]) => filters[k] === v);
          return (
            <button
              key={c.label}
              type="button"
              className={active ? styles.filterChipActive : styles.filterChip}
              onClick={() => setFilter(active ? Object.fromEntries(Object.keys(c.patch).map((k) => [k, k.startsWith('only') ? false : 'all'])) : c.patch)}
            >
              {c.label}
            </button>
          );
        })}
        <button
          type="button"
          className={styles.filterChip}
          onClick={retryFailed}
          disabled={busyId === 'batch'}
          title="Reencola los intentos de publicación que quedaron en estado error"
        >
          <i className="fas fa-rotate-right" /> Reintentar fallidos
        </button>
      </div>

      {/* ---------- Panel de filtros avanzados ---------- */}
      {advanced && (
        <div className={styles.advanced}>
          <label>
            Estado en MELI
            <select value={filters.meliStatus} onChange={(e) => setFilter({ meliStatus: e.target.value })}>
              {['all', 'none', 'linked', 'active', 'paused', 'paused_stock', 'closed', 'error', 'draft', 'under_review'].map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
              ))}
            </select>
          </label>
          <label>
            Stock
            <select value={filters.stock} onChange={(e) => setFilter({ stock: e.target.value })}>
              <option value="all">Todos</option>
              <option value="with">Con stock &gt; 0</option>
              <option value="without">Sin stock</option>
            </select>
          </label>
          <label>
            Stock mínimo
            <input type="number" min="0" value={filters.minStock} placeholder="0"
              onChange={(e) => setFilter({ minStock: e.target.value })} />
          </label>
          <label>
            Equivalencia
            <select value={filters.equivalence} onChange={(e) => setFilter({ equivalence: e.target.value })}>
              <option value="all">Todas</option>
              <option value="with">Con equivalencia</option>
              <option value="without">Sin equivalencia</option>
            </select>
          </label>
          <label>
            Imagen
            <select value={filters.image} onChange={(e) => setFilter({ image: e.target.value })}>
              <option value="all">Todas</option>
              <option value="with">Con imagen</option>
              <option value="without">Sin imagen</option>
            </select>
          </label>
          <label>
            Precio mínimo
            <input type="number" min="0" value={filters.minPrice} placeholder="0"
              onChange={(e) => setFilter({ minPrice: e.target.value })} />
          </label>
          <label>
            Precio máximo
            <input type="number" min="0" value={filters.maxPrice} placeholder="Sin límite"
              onChange={(e) => setFilter({ maxPrice: e.target.value })} />
          </label>
          <label>
            Ordenar por
            <select value={filters.sortBy} onChange={(e) => setFilter({ sortBy: e.target.value })}>
              <option value="stock">Stock</option>
              <option value="price">Precio</option>
              <option value="article">Artículo</option>
              <option value="brand">Marca</option>
              <option value="updated">Última actualización</option>
            </select>
          </label>
          <label>
            Dirección
            <select value={filters.sortDir} onChange={(e) => setFilter({ sortDir: e.target.value })}>
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </label>
          <label>
            Por página
            <select value={filters.pageSize} onChange={(e) => setFilter({ pageSize: Number(e.target.value) })}>
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className={styles.checkCard}>
            <input type="checkbox" checked={filters.onlyPublishable}
              onChange={(e) => setFilter({ onlyPublishable: e.target.checked })} />
            Sólo listos para publicar
          </label>
          <label className={styles.checkCard}>
            <input type="checkbox" checked={filters.onlyWithError}
              onChange={(e) => setFilter({ onlyWithError: e.target.checked })} />
            Sólo con error de sincronización
          </label>
        </div>
      )}

      {/* ---------- Chips de filtros activos ---------- */}
      {activeChips.length > 0 && (
        <div className={styles.activeFilters}>
          {activeChips.map((c) => (
            <button key={c.key} type="button" className={styles.activeChip} onClick={c.clear}>
              {c.label} <i className="fas fa-xmark" />
            </button>
          ))}
          <button type="button" className={styles.clearAll} onClick={resetAll}>
            Limpiar todo
          </button>
        </div>
      )}

      {/* ---------- Resumen ---------- */}
      <div className={styles.statRow}>
        {[
          { label: 'Resultados', value: summary.total ?? data.total, onClick: null },
          { label: 'Con stock', value: summary.withStock, onClick: () => setFilter({ stock: 'with' }) },
          { label: 'Publicados', value: summary.published, onClick: () => setFilter({ meliStatus: 'linked' }) },
          { label: 'Sin publicar', value: summary.unpublished, onClick: () => setFilter({ meliStatus: 'none' }) },
          { label: 'Con imagen', value: summary.withImage, onClick: () => setFilter({ image: 'with' }) },
          { label: 'Listos para publicar', value: summary.publishable, onClick: () => setFilter({ onlyPublishable: true }) },
        ].map((s) => (
          <button key={s.label} type="button" className={styles.statCard} onClick={s.onClick || undefined} disabled={!s.onClick || loading}>
            <span className={styles.statValue}>{loading ? '…' : num(s.value ?? 0)}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* ---------- Barra de selección ---------- */}
      {totalSelected > 0 && (
        <div className={styles.selectionBar}>
          <span>
            <b>{num(totalSelected)}</b> producto(s) seleccionado(s)
          </span>
          <div className={styles.selectionActions}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`} onClick={() => setSelected([])}>
              Limpiar selección
            </button>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={publishSelected} disabled={busyId === 'batch'}>
              <i className="fas fa-upload" /> Publicar seleccionados
            </button>
          </div>
        </div>
      )}

      {/* ---------- Estados ---------- */}
      {error && (
        <div className={styles.msgError}>
          <i className="fas fa-triangle-exclamation" />
          <div>
            {error}
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`} onClick={() => load()} style={{ marginLeft: 12 }}>
              Reintentar
            </button>
          </div>
        </div>
      )}

      {loading && data.items.length === 0 && (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonThumb} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && data.items.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fas fa-box-open" />
          <h4>Sin resultados</h4>
          <p>No hay productos que coincidan con los filtros aplicados.</p>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={resetAll}>
            Limpiar filtros
          </button>
        </div>
      )}

      {/* ---------- Resultados ---------- */}
      {!error && data.items.length > 0 && (
        <>
          <div className={styles.resultsBar}>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} />
              Seleccionar todo lo publicable de esta página
            </label>
            <span className={styles.hint}>
              Se publican en estado <b>pausado</b> para que revises el aviso antes de activarlas.
            </span>
          </div>

          {view === 'grid' ? (
            <div className={styles.cardGrid}>
              {data.items.map((p) => (
                <ProductCard
                  key={p.productId}
                  p={p}
                  selected={selected.includes(p.productId)}
                  onToggle={() => toggleSelect(p.productId)}
                  onPublish={() => publishOne(p, false)}
                  onPublishCategory={() => publishOne(p, true)}
                  busy={busyId === p.productId || busyId === 'batch'}
                />
              ))}
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Sel</th>
                    <th>Producto</th>
                    <th>Equivalencia</th>
                    <th>Stock</th>
                    <th>Precio local → MELI</th>
                    <th>Imágenes</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((p) => (
                    <tr key={p.productId} className={selected.includes(p.productId) ? styles.rowSelected : ''}>
                      <td data-label="Sel">
                        <input type="checkbox" disabled={!p.canPublish} checked={selected.includes(p.productId)} onChange={() => toggleSelect(p.productId)} />
                      </td>
                      <td data-label="Producto">
                        <b>{p.brand}</b> — {p.article}
                        <div className={styles.subText}>{p.description}</div>
                      </td>
                      <td data-label="Equivalencia">{p.equivalenceCode || '—'}</td>
                      <td data-label="Stock">{num(p.localStock)}</td>
                      <td data-label="Precio local → MELI">
                        ${money(p.localPrice)} → <b>${money(p.estimatedMeliPrice)}</b>
                        {p.priceOverride > 0 && ' [fijo]'}
                      </td>
                      <td data-label="Imágenes">
                        {p.totalImageCount > 0 ? `${p.totalImageCount} foto(s)` : '—'}
                      </td>
                      <td data-label="Estado">
                        {p.isLinked ? (
                          <span className={statusBadgeClass(p.meliStatus)}>{p.meliStatus}</span>
                        ) : p.canPublish ? (
                          <span className={`${styles.badge} ${styles.badgeInfo}`}>Listo</span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeMuted}`}>{p.blockReason}</span>
                        )}
                        {p.lastSyncError && (
                          <div className={styles.cellErr}>
                            <ErrorChip error={p.lastSyncError} />
                          </div>
                        )}
                      </td>
                      <td data-label="Acciones" className={styles.actions}>
                        <button
                          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnIcon}`}
                          disabled={!p.canPublish || busyId === p.productId}
                          onClick={() => publishOne(p, false)}
                          title="Publicar en MELI (queda pausado para revisión)"
                        >
                          <i className="fas fa-upload" />
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnGhost} ${styles.btnIcon}`}
                          disabled={!p.canPublish || busyId === p.productId}
                          onClick={() => publishOne(p, true)}
                          title="Publicar eligiendo la categoría de MELI a mano"
                        >
                          <i className="fas fa-folder-tree" />
                        </button>
                        {p.permalink && (
                          <a
                            className={`${styles.btn} ${styles.btnGhost} ${styles.btnIcon}`}
                            href={p.permalink}
                            target="_blank"
                            rel="noreferrer"
                            title="Ver publicación en MELI"
                          >
                            <i className="fas fa-up-right-from-square" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---------- Paginación ---------- */}
          <div className={styles.pager}>
            <span className={styles.pagerInfo}>
              {num(data.total)} producto(s) · página {num(data.page)} de {num(data.totalPages || 1)}
            </span>
            <button className={`${styles.btn} ${styles.btnGhost}`} disabled={data.page <= 1 || loading} onClick={() => goToPage(data.page - 1)}>
              <i className="fas fa-chevron-left" /> Anterior
            </button>
            <input
              className={styles.pageInput}
              type="number"
              min={1}
              max={data.totalPages || 1}
              value={data.page}
              onChange={(e) => goToPage(Number(e.target.value))}
            />
            <button className={`${styles.btn} ${styles.btnGhost}`} disabled={data.page >= (data.totalPages || 1) || loading} onClick={() => goToPage(data.page + 1)}>
              Siguiente <i className="fas fa-chevron-right" />
            </button>
            <select value={filters.pageSize} onChange={(e) => setFilter({ pageSize: Number(e.target.value) })}>
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n} por página</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}

export default MeliCatalogTab;
