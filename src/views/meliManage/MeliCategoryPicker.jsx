import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './melimanage.module.css';
import { searchMeliCategories, getMeliCategoryRoot, getMeliCategoryNode } from '../../request/meliRequest';

const debounce = (fn, ms) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

/**
 * Selector de categorías de Mercado Libre.
 * Dos modos: buscador por texto (predictor domain_discovery) y navegación por árbol.
 * Devuelve { id, name, path } vía onSelect.
 */
function MeliCategoryPicker({ open, initialQuery = '', title = 'Elegir categoría de MELI', onClose, onSelect }) {
  const [mode, setMode] = useState('search');
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [rootCategories, setRootCategories] = useState([]);
  const [browseStack, setBrowseStack] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseError, setBrowseError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [manualId, setManualId] = useState('');

  const searchSeq = useRef(0);

  // Al abrir: resetear y lanzar la búsqueda inicial con el texto del producto.
  useEffect(() => {
    if (!open) return;
    setMode('search');
    setTerm(initialQuery || '');
    setResults([]);
    setSearchError(null);
    setBrowseStack([]);
    setSelected(null);
    setManualId('');
  }, [open, initialQuery]);

  const runSearch = useCallback(async (value) => {
    const q = (value || '').trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }
    const seq = ++searchSeq.current;
    setSearching(true);
    setSearchError(null);
    try {
      const data = await searchMeliCategories(q, 8);
      if (seq !== searchSeq.current) return; // respuesta vieja: descartar
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      if (seq !== searchSeq.current) return;
      setSearchError(e.response?.data?.message || 'No se pudieron buscar categorías.');
      setResults([]);
    } finally {
      if (seq === searchSeq.current) setSearching(false);
    }
  }, []);

  const debouncedSearch = useMemo(() => debounce(runSearch, 350), [runSearch]);

  // Búsqueda inicial al abrir (sin esperar al debounce).
  useEffect(() => {
    if (!open) return;
    if ((initialQuery || '').trim()) runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Carga de categorías raíz al entrar en modo navegación.
  useEffect(() => {
    if (!open || mode !== 'browse' || rootCategories.length > 0) return;
    let alive = true;
    setBrowseLoading(true);
    setBrowseError(null);
    getMeliCategoryRoot()
      .then((data) => {
        if (alive) setRootCategories(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (alive) setBrowseError(e.response?.data?.message || 'No se pudieron cargar las categorías.');
      })
      .finally(() => {
        if (alive) setBrowseLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [open, mode, rootCategories.length]);

  if (!open) return null;

  const currentChildren = browseStack.length > 0 ? browseStack[browseStack.length - 1].children : rootCategories;

  const pickSearchResult = (r) => {
    setSelected({ id: r.categoryId, name: r.categoryName, path: [] });
  };

  const openBrowseNode = async (child) => {
    setBrowseLoading(true);
    setBrowseError(null);
    try {
      const node = await getMeliCategoryNode(child.id);
      if (node && Array.isArray(node.children) && node.children.length > 0) {
        setBrowseStack((prev) => [...prev, node]);
      } else {
        setSelected({ id: node?.id || child.id, name: node?.name || child.name, path: node?.pathFromRoot || [] });
      }
    } catch (e) {
      setBrowseError(e.response?.data?.message || 'No se pudo abrir la categoría.');
    } finally {
      setBrowseLoading(false);
    }
  };

  const goToCrumb = (index) => {
    setBrowseStack((prev) => prev.slice(0, index));
  };

  const confirm = () => {
    if (!selected) return;
    onSelect?.(selected);
  };

  const confirmManual = async () => {
    const id = manualId.trim().toUpperCase();
    if (!id) return;
    setBrowseLoading(true);
    setBrowseError(null);
    try {
      const node = await getMeliCategoryNode(id);
      setSelected({ id: node.id, name: node.name, path: node.pathFromRoot || [] });
    } catch (e) {
      setBrowseError(e.response?.data?.message || 'Categoría inválida.');
    } finally {
      setBrowseLoading(false);
    }
  };

  return (
    <div className={styles.catOverlay} onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={styles.catModal} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.catModalHead}>
          <h3 className={styles.catModalTitle}>{title}</h3>
          <button type="button" className={styles.catModalClose} onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-xmark" />
          </button>
        </div>

        <div className={styles.catTabs}>
          <button
            type="button"
            className={mode === 'search' ? styles.catTabActive : styles.catTab}
            onClick={() => setMode('search')}
          >
            <i className="fas fa-magnifying-glass" /> Buscar
          </button>
          <button
            type="button"
            className={mode === 'browse' ? styles.catTabActive : styles.catTab}
            onClick={() => setMode('browse')}
          >
            <i className="fas fa-folder-tree" /> Navegar
          </button>
        </div>

        {mode === 'search' && (
          <div className={styles.catBody}>
            <div className={styles.catSearchBox}>
              <i className="fas fa-magnifying-glass" />
              <input
                autoFocus
                placeholder="Escribí el nombre del producto (ej. filtro de aceite)…"
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                onKeyDown={(e) => e.key === 'Enter' && runSearch(term)}
              />
              {searching && <i className={`fas fa-spinner ${styles.spin}`} />}
            </div>

            {searchError && <div className={styles.catError}>{searchError}</div>}

            <div className={styles.catList}>
              {!searching && !searchError && results.length === 0 && (
                <div className={styles.catEmpty}>
                  {term.trim()
                    ? 'Sin resultados. Probá con otras palabras o usá la pestaña Navegar.'
                    : 'Escribí para buscar categorías.'}
                </div>
              )}
              {results.map((r) => (
                <button
                  key={r.categoryId}
                  type="button"
                  className={`${styles.catItem} ${selected?.id === r.categoryId ? styles.catItemActive : ''}`}
                  onClick={() => pickSearchResult(r)}
                >
                  <span className={styles.catItemName}>{r.categoryName}</span>
                  <span className={styles.catItemMeta}>
                    {r.domainName || r.domainId} · {r.categoryId}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'browse' && (
          <div className={styles.catBody}>
            <div className={styles.catBreadcrumb}>
              <button type="button" className={styles.catCrumb} onClick={() => goToCrumb(0)}>
                Raíz
              </button>
              {browseStack.map((n, i) => (
                <React.Fragment key={n.id}>
                  <span className={styles.catCrumbSep}>/</span>
                  <button type="button" className={styles.catCrumb} onClick={() => goToCrumb(i + 1)}>
                    {n.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {browseError && <div className={styles.catError}>{browseError}</div>}

            <div className={styles.catList}>
              {browseLoading && (
                <div className={styles.catEmpty}>
                  <i className={`fas fa-spinner ${styles.spin}`} /> Cargando…
                </div>
              )}
              {!browseLoading && currentChildren.length === 0 && (
                <div className={styles.catEmpty}>Esta categoría no tiene subcategorías.</div>
              )}
              {!browseLoading &&
                currentChildren.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.catItem} ${selected?.id === c.id ? styles.catItemActive : ''}`}
                    onClick={() => openBrowseNode(c)}
                  >
                    <span className={styles.catItemName}>{c.name}</span>
                    <span className={styles.catItemMeta}>
                      {c.id}
                      {c.totalItems > 0 ? ` · ${c.totalItems.toLocaleString('es-AR')} ítems` : ''}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className={styles.catManual}>
          <input
            className={styles.catManualInput}
            placeholder="O pegá un ID manual (ej. MLA373345)"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirmManual()}
          />
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
            onClick={confirmManual}
            disabled={!manualId.trim() || browseLoading}
          >
            Validar ID
          </button>
        </div>

        <div className={styles.catFooter}>
          <div className={styles.catSelected}>
            {selected ? (
              <>
                <span className={styles.catSelectedLabel}>Seleccionada</span>
                <span className={styles.catSelectedName}>{selected.name}</span>
                <span className={styles.catSelectedPath}>
                  {selected.path.length > 0 ? selected.path.join(' › ') : selected.id}
                </span>
              </>
            ) : (
              <span className={styles.catSelectedLabel}>Ninguna categoría seleccionada</span>
            )}
          </div>
          <div className={styles.catFooterActions}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={confirm}
              disabled={!selected}
            >
              Usar esta categoría
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeliCategoryPicker;
