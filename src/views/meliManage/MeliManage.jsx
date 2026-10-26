import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './melimanage.module.css';
import MeliCatalogTab from './MeliCatalogTab';
import ErrorChip from './MeliErrorChip';
import {
  getMeliAuthStatus,
  getMeliAuthUrl,
  getMeliConfig,
  updateMeliConfig,
  getMeliListings,
  activateProduct,
  pauseProduct,
  removeFromMeli,
  setIncludeSync,
  setPriceOverride,
  syncNow,
  publishProduct,
  importExistingMeliItems,
  discardFailedListing,
} from '../../request/meliRequest';

function applyRoundingJs(value, roundingMode) {
  if (value <= 0) return 0;
  switch (roundingMode) {
    case 'exact':
      return Math.round(value * 100) / 100;
    case 'whole':
      return Math.ceil(value / 10) * 10;
    case 'end90':
      return Math.ceil(value / 100) * 100 - 10;
    case 'end99':
      return Math.ceil(value) - 0.01;
    default:
      return Math.round(value * 100) / 100;
  }
}

const STATUS_BADGE = {
  active: 'badgeSuccess',
  paused: 'badgeWarn',
  paused_stock: 'badgeWarn',
  error: 'badgeDanger',
  closed: 'badgeMuted',
  draft: 'badgeMuted',
};

function StatusBadge({ status }) {
  const key = STATUS_BADGE[status] || 'badgeMuted';
  return <span className={`${styles.badge} ${styles[key]}`}>{status}</span>;
}

function MeliManage() {
  const [tab, setTab] = useState(0);
  const [auth, setAuth] = useState(null);
  const [config, setConfig] = useState(null);
  const [listings, setListings] = useState({ total: 0, unpublishedCount: 0, items: [] });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    onlyErrors: false,
    includeUnpublished: false,
    page: 1,
    pageSize: 20,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [simPrice, setSimPrice] = useState(10000);

  const loadAll = async (override) => {
    const f = { ...filters, ...(override || {}) };
    setLoading(true);
    try {
      const [authRes, configRes, listingsRes] = await Promise.allSettled([
        getMeliAuthStatus(),
        getMeliConfig(),
        getMeliListings({
          status: f.status || undefined,
          search: f.search || undefined,
          onlyErrors: f.onlyErrors || undefined,
          includeUnpublished: f.includeUnpublished || undefined,
          page: f.page,
          pageSize: f.pageSize,
        }),
      ]);
      if (authRes.status === 'fulfilled') setAuth(authRes.value);
      if (configRes.status === 'fulfilled') setConfig(configRes.value);
      if (listingsRes.status === 'fulfilled') setListings(listingsRes.value);

      const failed = [
        ['cuenta', authRes],
        ['configuración', configRes],
        ['publicaciones', listingsRes],
      ].filter(([, r]) => r.status === 'rejected');
      if (failed.length > 0) {
        const detail = failed
          .map(([name, r]) => `${name}: ${r.reason?.response?.data?.message || r.reason?.message || 'error desconocido'}`)
          .join(' · ');
        setMsg(`Error al cargar datos de MELI (${detail})`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [filters.page]);

  useEffect(() => {
    if (tab === 1) {
      // El catálogo se carga desde su propio componente.
    }
  }, [tab]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === '1') {
      setMsg('Cuenta de Mercado Libre conectada correctamente.');
      loadAll();
    }
  }, []);

  const connect = async () => {
    const { url } = await getMeliAuthUrl();
    window.location.href = url;
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const updated = await updateMeliConfig(config);
      setConfig(updated);
      setMsg('Configuración guardada. Los listados activos se marcaron para re-sincronizar.');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  const doImport = async () => {
    setLoading(true);
    try {
      const res = await importExistingMeliItems();
      setMsg(`Importación: ${res.linked} vinculados, ${res.skipped} omitidos.`);
      loadAll();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Error al importar');
    } finally {
      setLoading(false);
    }
  };

  const rowAction = async (actionFn, okMsg) => {
    setLoading(true);
    try {
      await actionFn();
      setMsg(okMsg);
      await loadAll();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSingle = async (productId, askCategory = false) => {
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
    setLoading(true);
    try {
      const res = await publishProduct(productId, categoryId);
      setMsg(`Producto #${productId} publicado en MELI (${res.meliItemId}) en estado pausado.`);
      await loadAll();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Error al publicar producto');
    } finally {
      setLoading(false);
    }
  };

  const simulatePrice = () => {
    if (!config) return null;
    const base = Number(simPrice) || 0;
    let raw = base;
    const comm = Number(config.meliCommission) || 0;
    const margin = Number(config.channelMargin) || 0;
    const fixed = Number(config.fixedFee) || 0;
    const threshold = Number(config.freeShippingThreshold) || 0;

    if (config.priceMode === 'factor') {
      const pre = base * (1 + comm + margin);
      const applyFixed = fixed > 0 && (threshold <= 0 || pre < threshold);
      raw = pre + (applyFixed ? fixed : 0);
    } else if (config.priceMode === 'grossUp') {
      const target = base * (1 + margin);
      const div = Math.max(0.1, 1 - comm);
      const pre = target / div;
      const applyFixed = fixed > 0 && (threshold <= 0 || pre < threshold);
      raw = applyFixed ? (target + fixed) / div : pre;
    }
    const rounded = applyRoundingJs(raw, config.roundingMode);
    const publish = Math.max(rounded, Number(config.minPublishPrice) || 0);
    const applyFixedOnFinal = fixed > 0 && (threshold <= 0 || publish < threshold);
    const fee = publish * comm + (applyFixedOnFinal ? fixed : 0);
    return {
      publish: publish.toFixed(2),
      fee: fee.toFixed(2),
      net: (publish - fee).toFixed(2),
    };
  };
  const sim = simulatePrice();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Mercado Libre</h2>
          <p className={styles.subtitle}>
            Publicá, sincronizá y controlá tus publicaciones desde un solo lugar.
          </p>
        </div>
        <span
          className={
            auth?.connected ? `${styles.statusChip} ${styles.statusOn}` : styles.statusChip
          }
        >
          <i className={styles.dot} />
          {auth?.connected
            ? `Conectado${auth.nickname ? ` · ${auth.nickname}` : ''}`
            : 'Sin cuenta vinculada'}
        </span>
      </div>

      {msg && (
        <div className={msg.trim().startsWith('Error') ? styles.msgError : styles.msg}>{msg}</div>
      )}

      <div className={styles.authBar}>
        <div className={styles.authInfo}>
          {auth?.connected ? (
            <span>
              Conectado como <b>{auth.nickname}</b> (ID {auth.meliUserId}){' '}
              {auth.isUserProductSeller ? '[User Products]' : ''} — token hasta {auth.expiresAt}
            </span>
          ) : (
            <span>
              Todavía no hay una cuenta vinculada. Conectá tu usuario de Mercado Libre para empezar
              a publicar.
            </span>
          )}
        </div>
        <div className={styles.authActions}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={connect}
            disabled={loading}
          >
            Conectar / Reconectar cuenta
          </button>
          <button
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={doImport}
            disabled={loading || !auth?.connected}
          >
            Importar publicaciones existentes
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 0 ? styles.activeTab : ''}`} onClick={() => setTab(0)}>
          Publicaciones ({listings.total})
        </button>
        <button className={`${styles.tab} ${tab === 1 ? styles.activeTab : ''}`} onClick={() => setTab(1)}>
          Catálogo para publicar
        </button>
        <button className={`${styles.tab} ${tab === 2 ? styles.activeTab : ''}`} onClick={() => setTab(2)}>
          Política de precios
        </button>
      </div>

      {tab === 0 && (
        <div>
          <div className={styles.filters}>
            <input
              className={styles.searchInput}
              placeholder="Buscar por artículo / descripción / ID MELI"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">Todos los estados</option>
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="paused_stock">paused_stock</option>
              <option value="error">error</option>
              <option value="closed">closed</option>
            </select>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={filters.onlyErrors}
                onChange={(e) => setFilters({ ...filters, onlyErrors: e.target.checked, page: 1 })}
              />
              Solo con errores
            </label>
            <label
              className={styles.checkLabel}
              title="Los intentos rechazados por MELI no son publicaciones reales: se guardan para reintentar"
            >
              <input
                type="checkbox"
                checked={filters.includeUnpublished}
                onChange={(e) => {
                  const next = { ...filters, includeUnpublished: e.target.checked, page: 1 };
                  setFilters(next);
                  loadAll(next);
                }}
              />
              Incluir intentos fallidos
            </label>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => loadAll()}
              disabled={loading}
            >
              Buscar
            </button>
          </div>
          <div className={styles.resultsBar}>
            <span className={styles.count}>Total: {listings.total} publicaciones</span>
            {!filters.includeUnpublished && listings.unpublishedCount > 0 && (
              <span className={styles.hintWarn}>
                <i className="fas fa-triangle-exclamation" /> {listings.unpublishedCount} intento(s)
                rechazado(s) por MELI que nunca se publicaron (no se listan acá).
              </span>
            )}
            <span className={styles.hint}>
              Los cambios de stock y precio se reflejan en MELI en la próxima sincronización.
            </span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sync</th>
                  <th>Producto</th>
                  <th>ID MELI</th>
                  <th>Estado</th>
                  <th>Stock L→M</th>
                  <th>Precio Local → MELI</th>
                  <th>Calidad</th>
                  <th>Error</th>
                  <th>Acciones</th>
                </tr>
              </thead>
            <tbody>
              {listings.items.map((it) => (
                <tr key={it.productId}>
                  <td data-label="Sync">
                    <input
                      type="checkbox"
                      checked={!!it.includeInSync}
                      title="Incluir en sincronización automática"
                      onChange={(e) =>
                        rowAction(
                          () => setIncludeSync(it.productId, e.target.checked),
                          e.target.checked ? 'Sync activado' : 'Sync desactivado'
                        )
                      }
                    />
                  </td>
                  <td data-label="Producto">
                    <b>{it.brand}</b> — {it.article}
                    <div className={styles.subText}>{it.description}</div>
                  </td>
                  <td data-label="ID MELI">
                    {it.meliItemId ? (
                      <a href={it.permalink} target="_blank" rel="noreferrer">
                        {it.meliItemId}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td data-label="Estado">
                    {it.meliItemId ? (
                      <StatusBadge status={it.status} />
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeMuted}`}>no publicado</span>
                    )}
                  </td>
                  <td data-label="Stock L→M">
                    {it.localStock} → {it.meliStock ?? '—'}
                  </td>
                  <td data-label="Precio Local → MELI">
                    ${it.localPrice ?? '—'} → <b>${it.meliPrice ?? it.desiredMeliPrice ?? '—'}</b>
                    {it.priceOverride ? ' [Override]' : ''}
                    {it.priceAutomationActive ? ' (auto)' : ''}
                  </td>
                  <td data-label="Calidad">
                    {it.performanceScore ?? '—'} {it.performanceLevel ?? ''}
                  </td>
                  <td data-label="Error">
                    <ErrorChip error={it.lastSyncError} />
                  </td>
                  <td data-label="Acciones" className={styles.actions}>
                    {(!it.meliItemId || it.status === 'error' || it.status === 'draft') && (
                      <button
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
                        onClick={() => handlePublishSingle(it.productId, it.status === 'error')}
                      >
                        Publicar
                      </button>
                    )}
                    {!it.meliItemId && (
                      <button
                        className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                        onClick={async () => {
                          const res = await Swal.fire({
                            title: '¿Descartar intento fallido?',
                            text: 'Se borra el registro del intento. El producto sigue sin publicar.',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, descartar',
                            cancelButtonText: 'Cancelar',
                          });
                          if (res.isConfirmed)
                            rowAction(() => discardFailedListing(it.productId), 'Intento descartado');
                        }}
                      >
                        Descartar
                      </button>
                    )}
                    {it.meliItemId && (
                      <>
                        <button
                          className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                          onClick={() => rowAction(() => activateProduct(it.productId), 'Activada')}
                        >
                          Activar
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                          onClick={() => rowAction(() => pauseProduct(it.productId), 'Pausada')}
                        >
                          Pausar
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                          onClick={() => rowAction(() => syncNow(it.productId), 'Sincronizada')}
                        >
                          Sync
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                          onClick={async () => {
                            const res = await Swal.fire({
                              title: 'Precio fijo para MELI',
                              input: 'text',
                              inputLabel: 'Vacío = limpiar el precio fijo',
                              inputValue: it.priceOverride ?? '',
                              showCancelButton: true,
                              confirmButtonText: 'Guardar',
                              cancelButtonText: 'Cancelar',
                              preConfirm: (v) => {
                                if (v !== '' && (Number.isNaN(Number(v)) || Number(v) < 0)) {
                                  Swal.showValidationMessage('Ingresá un número válido');
                                  return false;
                                }
                                return v;
                              },
                            });
                            if (!res.isConfirmed) return;
                            rowAction(
                              () => setPriceOverride(it.productId, res.value === '' ? null : Number(res.value)),
                              'Override actualizado'
                            );
                          }}
                        >
                          Override
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                          onClick={async () => {
                            const res = await Swal.fire({
                              title: '¿Cerrar publicación en MELI?',
                              text: 'Se eliminará el vínculo con la publicación.',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#d33',
                              confirmButtonText: 'Sí, cerrar',
                              cancelButtonText: 'Cancelar',
                            });
                            if (res.isConfirmed)
                              rowAction(() => removeFromMeli(it.productId), 'Cerrada');
                          }}
                        >
                          Cerrar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          <div className={styles.pager}>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              disabled={filters.page <= 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            >
              Anterior
            </button>
            <span>Página {filters.page}</span>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {tab === 1 && <MeliCatalogTab onPublished={loadAll} />}

      {tab === 2 && config && (
        <div className={styles.configGrid}>
          <label>
            Modo
            <select
              value={config.priceMode}
              onChange={(e) => setConfig({ ...config, priceMode: e.target.value })}
            >
              <option value="grossUp">Gross-Up exacto</option>
              <option value="factor">Factor lineal</option>
              <option value="listPrice">Precio de lista local</option>
            </select>
          </label>
          <label>
            Comisión MELI (0.16 = 16%)
            <input
              type="number"
              step="0.01"
              value={config.meliCommission}
              onChange={(e) => setConfig({ ...config, meliCommission: Number(e.target.value) })}
            />
          </label>
          <label>
            Margen canal
            <input
              type="number"
              step="0.01"
              value={config.channelMargin}
              onChange={(e) => setConfig({ ...config, channelMargin: Number(e.target.value) })}
            />
          </label>
          <label>
            Cargo fijo
            <input
              type="number"
              value={config.fixedFee}
              onChange={(e) => setConfig({ ...config, fixedFee: Number(e.target.value) })}
            />
          </label>
          <label>
            Umbral envío gratis
            <input
              type="number"
              value={config.freeShippingThreshold}
              onChange={(e) =>
                setConfig({ ...config, freeShippingThreshold: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Redondeo
            <select
              value={config.roundingMode}
              onChange={(e) => setConfig({ ...config, roundingMode: e.target.value })}
            >
              <option value="whole">Múltiplo de $10</option>
              <option value="end99">Terminado en .99</option>
              <option value="end90">Terminado en 90</option>
              <option value="exact">Exacto</option>
            </select>
          </label>
          <label>
            Piso mínimo
            <input
              type="number"
              value={config.minPublishPrice}
              onChange={(e) => setConfig({ ...config, minPublishPrice: Number(e.target.value) })}
            />
          </label>
          <label>
            Reserva de stock
            <input
              type="number"
              value={config.stockReserve}
              onChange={(e) => setConfig({ ...config, stockReserve: Number(e.target.value) })}
            />
          </label>
          <label>
            Tipo de publicación
            <select
              value={config.defaultListingType}
              onChange={(e) => setConfig({ ...config, defaultListingType: e.target.value })}
            >
              <option value="gold_special">Clásica</option>
              <option value="gold_pro">Premium</option>
            </select>
          </label>
          <label>
            Garantía
            <input
              value={config.defaultWarrantyTime}
              onChange={(e) => setConfig({ ...config, defaultWarrantyTime: e.target.value })}
            />
          </label>
          <label className={styles.checkCard}>
            <input
              type="checkbox"
              checked={config.syncEnabled}
              onChange={(e) => setConfig({ ...config, syncEnabled: e.target.checked })}
            />
            Sync automático
          </label>
          <div className={styles.saveBar}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={saveConfig}
              disabled={loading}
            >
              Guardar configuración
            </button>
          </div>

          <div className={styles.sim}>
            <h4>Simulador de precio</h4>
            <label>
              Precio local con IVA
              <input
                type="number"
                value={simPrice}
                onChange={(e) => setSimPrice(e.target.value)}
              />
            </label>
            {sim && (
              <p>
                Publicar en MELI: <b>${sim.publish}</b> — retiene MELI (comisión + cargo fijo): $
                {sim.fee} — neto Tauro Parts: <b>${sim.net}</b>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MeliManage;
