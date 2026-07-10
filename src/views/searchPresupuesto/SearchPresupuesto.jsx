import React, { useEffect, useState } from 'react';
import styles from './searchPresupuesto.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchCotizacionRequest, resetSearchCotizacion } from '../../redux/searchCotizacion';
import { setFilterCotizacion, resetFilterCotizacion } from '../../redux/filtersCotizacion';
import CustomPagination from '../../commonds/pagination/CustomPagination';
import LoadingSpinner from '../../commonds/loading/LoadingSpinner';
import { getCotizacionById } from '../../request/cotizacionRequest';
import { getProductId } from '../../request/productRequest';
import { numberToString } from '../../utils';
import Swal from 'sweetalert2';


const DAYS_TO_EXPIRE = 10;

function getStatusInfo(fechaCreacion) {
  const now = new Date();
  const creation = new Date(fechaCreacion);
  const diffDays = Math.floor((now - creation) / (1000 * 60 * 60 * 24));
  if (diffDays > DAYS_TO_EXPIRE) {
    return { label: 'Vencido', variant: 'danger', daysOverdue: diffDays - DAYS_TO_EXPIRE };
  }
  const remaining = DAYS_TO_EXPIRE - diffDays;
  return { label: `Vigente (${remaining} día${remaining !== 1 ? 's' : ''})`, variant: 'success', remaining };
}

function SearchPresupuesto() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filtersCotizacion);
  const { loading, data, error } = useSelector((state) => state.searchCotizacion);
  const [textClient, setTextClient] = useState('');

  useEffect(() => {
    return () => {
      dispatch(resetSearchCotizacion());
    };
  }, []);

  const doSearch = (page = filters.page) => {
    const body = {
      page,
      pageSize: filters.pageSize,
    };
    if (filters.client) body.client = filters.client;
    if (filters.initDate) body.initDate = filters.initDate;
    if (filters.endDate) body.endDate = filters.endDate;
    if (filters.status) body.estado = filters.status;
    dispatch(searchCotizacionRequest(body));
  };

  useEffect(() => {
    doSearch(1);
  }, [filters.status, filters.initDate, filters.endDate]);

  const onClientSearch = (e) => {
    const value = e.target.value;
    setTextClient(value);
  };

  const handleClientKeyDown = (e) => {
    if (e.key === 'Enter') {
      dispatch(setFilterCotizacion({ name: 'client', value: textClient || null }));
      dispatch(setFilterCotizacion({ name: 'page', value: 1 }));
    }
  };

  const clearClientFilter = () => {
    setTextClient('');
    dispatch(setFilterCotizacion({ name: 'client', value: null }));
    dispatch(setFilterCotizacion({ name: 'page', value: 1 }));
  };

  const handlePageChange = (page) => {
    dispatch(setFilterCotizacion({ name: 'page', value: page }));
    doSearch(page);
  };

  const handleStatusFilter = (status) => {
    dispatch(setFilterCotizacion({ name: 'status', value: status || null }));
    dispatch(setFilterCotizacion({ name: 'page', value: 1 }));
  };

  const loadIntoPos = async (item) => {
    let hasExistingItems = false;
    const existingOrder = localStorage.getItem('pos-order');
    if (existingOrder) {
      try {
        const parsed = JSON.parse(existingOrder);
        hasExistingItems = !!(parsed.items && parsed.items.length > 0);
      } catch {
        hasExistingItems = false;
      }
    }

    const confirmResult = await Swal.fire({
      title: hasExistingItems ? '¿Desea descartar la venta actual?' : '¿Cargar presupuesto en POS?',
      text: hasExistingItems
        ? 'Ya hay una venta en curso en el POS. Si carga este presupuesto, se perderán los datos de la venta actual. El POS se abrirá en una nueva pestaña.'
        : 'El presupuesto se cargará en el POS en una nueva pestaña.',
      icon: hasExistingItems ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: hasExistingItems ? 'Descartar y cargar presupuesto' : 'Cargar en POS',
      cancelButtonText: 'Cancelar',
    });
    if (!confirmResult.isConfirmed) return;

    try {
      const cotizacion = await getCotizacionById(item.id);
      const rawItems = JSON.parse(cotizacion.itemsJson || '[]');

      const now = new Date();
      const creationDate = new Date(cotizacion.fechaCreacion);
      const diffDays = Math.floor((now - creationDate) / (1000 * 60 * 60 * 24));
      const isExpired = diffDays > DAYS_TO_EXPIRE;

      const productDetails = await Promise.all(
        rawItems.map(async (ci) => {
          try {
            const detail = await getProductId(ci.productId);
            return { ...detail, productId: ci.productId, brandId: ci.brandId };
          } catch {
            return null;
          }
        })
      );
      const detailMap = {};
      productDetails.forEach((d) => {
        if (d) detailMap[`${d.productId}-${d.brandId}`] = d;
      });

      let items = rawItems.map((ci) => {
        const detail = detailMap[`${ci.productId}-${ci.brandId}`];
        const currentPrice = Number(detail?.price?.price || 0);
        const rentabilidad = detail?.brand?.rentabilidad || detail?.rentabilidad || 0;
        const currentSellPrice = currentPrice * (1 + Number(rentabilidad));
        // If we couldn't fetch product detail, treat stock as unknown (use requested amount) so we
        // don't accidentally wipe items in the stock-insufficient flow below.
        const currentStock = detail?.stock?.stock ?? ci.amount;
        return {
          productId: ci.productId,
          brandId: ci.brandId,
          article: ci.article || '',
          sellPrice: isExpired ? (currentSellPrice || Number(ci.sellPrice)) : Number(ci.sellPrice),
          description: ci.description || '',
          amount: ci.amount,
          availableStock: currentStock,
        };
      });

      if (isExpired) {
        await Swal.fire({
          icon: 'info',
          title: 'Presupuesto vencido',
          text: 'El presupuesto ha expirado. Se han actualizado los precios de los productos al valor actual.',
          confirmButtonText: 'Continuar',
        });
      }

      const lowStockItems = items.filter((item) => item.availableStock < item.amount);
      if (lowStockItems.length > 0) {
        const lowStockMsg = lowStockItems
          .map((item) => `${item.article}: solicitado ${item.amount}, disponible ${item.availableStock}`)
          .join('<br>');
        await Swal.fire({
          icon: 'warning',
          title: 'Stock insuficiente',
          html: `Los siguientes productos no tienen stock suficiente:<br><br>${lowStockMsg}<br><br>Se cargarán igualmente con la cantidad solicitada.`,
          confirmButtonText: 'Continuar',
        });
      }
      // Validación de stock deshabilitada temporalmente: el stock real aún no está
      // completamente cargado al sistema. Por ahora solo se avisa al usuario y se
      // cargan los items con la cantidad solicitada del presupuesto.
      // const lowStockItems = items.filter((item) => item.availableStock < item.amount);
      // if (lowStockItems.length > 0) {
      //   const lowStockMsg = lowStockItems
      //     .map((item) => `${item.article}: solicitado ${item.amount}, disponible ${item.availableStock}`)
      //     .join('<br>');
      //   const result = await Swal.fire({
      //     icon: 'warning',
      //     title: 'Stock insuficiente',
      //     html: `Los siguientes productos no tienen stock suficiente:<br><br>${lowStockMsg}<br><br>¿Desea cargar el stock disponible?`,
      //     showCancelButton: true,
      //     confirmButtonColor: '#3085d6',
      //     cancelButtonColor: '#d33',
      //     confirmButtonText: 'Cargar stock disponible',
      //     cancelButtonText: 'Cancelar',
      //   });
      //   if (!result.isConfirmed) return;
      //   items = items.map((item) => {
      //     if (item.availableStock < item.amount) {
      //       return { ...item, amount: Math.max(item.availableStock, 0) };
      //     }
      //     return item;
      //   });
      //   items = items.filter((item) => item.amount > 0);
      // }
      // if (items.length === 0) {
      //   await Swal.fire({
      //     icon: 'error',
      //     title: 'No se puede cargar el presupuesto',
      //     text: 'Ningún producto tiene stock disponible para cargar en el POS.',
      //   });
      //   return;
      // }

      const subTotal = items.reduce((sum, item) => sum + item.sellPrice * item.amount, 0);

      const orderData = {
        subTotal,
        clientId: cotizacion.clienteId,
        razonSocial: cotizacion.razonSocial,
        items,
      };
      localStorage.setItem('pos-order', JSON.stringify(orderData));

      window.open('/pos/ecommerce?pos=true', 'pos_window', 'width=1400,height=900,scrollbars=yes,resizable=yes');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo cargar el presupuesto: ${err.message}`,
      });
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <h6 className={styles.formTitle}>Buscador de presupuestos</h6>

      <div className={styles.filterCard}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Buscar por cliente</label>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Nombre, DNI o CUIT..."
                value={textClient}
                onChange={onClientSearch}
                onKeyDown={handleClientKeyDown}
              />
              {filters.client && (
                <button className={styles.clearBtn} onClick={clearClientFilter} title="Limpiar filtro">
                  <i className="fa-solid fa-times" />
                </button>
              )}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Desde</label>
            <input
              type="date"
              className={styles.filterInput}
              value={filters.initDate || ''}
              onChange={(e) => {
                dispatch(setFilterCotizacion({ name: 'initDate', value: e.target.value || null }));
                dispatch(setFilterCotizacion({ name: 'page', value: 1 }));
              }}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Hasta</label>
            <input
              type="date"
              className={styles.filterInput}
              value={filters.endDate || ''}
              onChange={(e) => {
                dispatch(setFilterCotizacion({ name: 'endDate', value: e.target.value || null }));
                dispatch(setFilterCotizacion({ name: 'page', value: 1 }));
              }}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Estado</label>
            <select
              className={styles.filterSelect}
              value={filters.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Vigente">Vigente</option>
              <option value="Vencido">Vencido</option>
              <option value="Convertido en venta">Convertido en venta</option>
            </select>
          </div>
          <div className={styles.filterActions}>
            <button
              className={styles.searchBtn}
              onClick={() => doSearch(1)}
              disabled={loading}
            >
              <i className="fa-solid fa-search" />
              <span>Buscar</span>
            </button>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setTextClient('');
                dispatch(resetFilterCotizacion());
                dispatch(resetSearchCotizacion());
              }}
            >
              <i className="fa-solid fa-undo" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner loading={loading} />}

      {error && (
        <div className={styles.errorBanner}>
          <i className="fa-solid fa-exclamation-circle" />
          <span>{error}</span>
        </div>
      )}

      {!loading && data && data.list && (
        <>
          <div className={styles.resultInfo}>
            <span>Se encontraron <strong>{data.totalRows}</strong> presupuestos</span>
          </div>

          {data.list.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fa-solid fa-file-invoice" />
              <p>No se encontraron presupuestos</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>CUIT</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {data.list.map((item) => {
                    const statusInfo = getStatusInfo(item.fechaCreacion);
                    const isConverted = item.estado === 'Convertido en venta';
                    const isExpired = statusInfo.variant === 'danger';

                    return (
                      <tr key={item.id} className={styles.tableRow}>
                        <td>{`#${item.id}`}</td>
                        <td>{formatDate(item.fechaCreacion)}</td>
                        <td>{item.razonSocial || '-'}</td>
                        <td>{item.cuit || '-'}</td>
                        <td>$ {numberToString(item.total)}</td>
                        <td>
                          {isConverted ? (
                            <span className={`${styles.badge} ${styles.badgeSecondary}`}>
                              Convertido en venta
                            </span>
                          ) : isExpired ? (
                            <span className={`${styles.badge} ${styles.badgeDanger}`}>
                              {statusInfo.label}
                            </span>
                          ) : (
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                              {statusInfo.label}
                            </span>
                          )}
                        </td>
                        <td>
                          {!isConverted && (
                            <button
                              className={styles.loadBtn}
                              onClick={() => loadIntoPos(item)}
                              title="Cargar en POS"
                            >
                              <i className="fa-solid fa-cart-plus" />
                              <span>Cargar en POS</span>
                            </button>
                          )}
                          {isConverted && (
                            <span className={styles.convertedLabel}>Venta realizada</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {data.totalPages > 1 && (
            <div className={styles.paginationWrapper}>
              <CustomPagination
                pages={data.totalPages}
                initPage={filters.page}
                changeFn={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchPresupuesto;
