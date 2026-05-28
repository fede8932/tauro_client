import React, { useState, useEffect, useCallback } from 'react';
import styles from './linkEquivalenceModal.module.css';
import {
  searchEquivalencesByText,
  addProductToEquivalence,
  createEquivalence,
} from '../../request/equivalencesRequest';
import Swal from 'sweetalert2';

const generateEquivalenceCode = () => {
  const letters = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 3; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  const numbers = () => {
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += Math.floor(Math.random() * 10);
    }
    return res;
  };
  return letters() + numbers() + letters();
};

function LinkEquivalenceModal({ product, onClose, onLinked }) {
  const [searchText, setSearchText] = useState('');
  const [equivalences, setEquivalences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEquivalenceId, setSelectedEquivalenceId] = useState(null);
  const [linking, setLinking] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newCode, setNewCode] = useState('');
  const [creating, setCreating] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchText]);

  const fetchEquivalences = useCallback(async () => {
    if (!debouncedSearch) {
      setEquivalences([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchEquivalencesByText(debouncedSearch);
      setEquivalences(data || []);
    } catch {
      setEquivalences([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchEquivalences();
  }, [fetchEquivalences]);

  const handleLink = async () => {
    if (!selectedEquivalenceId) return;
    setLinking(true);
    try {
      const result = await addProductToEquivalence(selectedEquivalenceId, product.id);
      if (result?.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'El producto ya pertenece a otra equivalencia',
          showConfirmButton: false,
          timer: 2500,
        });
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Vinculado',
        text: 'Producto vinculado al grupo de equivalencias',
        showConfirmButton: false,
        timer: 1500,
      });
      onLinked?.();
      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo vincular el producto',
        showConfirmButton: false,
        timer: 2500,
      });
    } finally {
      setLinking(false);
    }
  };

  const handleCreate = async () => {
    if (!newDescription) return;
    setCreating(true);
    try {
      const result = await createEquivalence({
        description: newDescription,
        code: newCode || null,
        productIds: [product.id],
      });
      if (result?.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'No se pudo crear la equivalencia',
          showConfirmButton: false,
          timer: 2500,
        });
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'Equivalencia creada y producto vinculado',
        showConfirmButton: false,
        timer: 1500,
      });
      onLinked?.();
      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la equivalencia',
        showConfirmButton: false,
        timer: 2500,
      });
    } finally {
      setCreating(false);
    }
  };

  const handleGenerateCode = () => {
    setNewCode(generateEquivalenceCode());
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <i className="fa-solid fa-link" />
            </div>
            <div>
              <h2 className={styles.headerTitle}>Vincular a Grupo de Equivalencias</h2>
              <p className={styles.headerSubtitle}>
                {product.article} — {product.description?.slice(0, 60)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <i className="fa-solid fa-times" />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.productInfoBar}>
            <div className={styles.productTag}>
              <span className={styles.tagLabel}>Producto:</span>
              <span className={styles.tagValue}>{product.article}</span>
            </div>
            <div className={styles.productTag}>
              <span className={styles.tagLabel}>Marca:</span>
              <span className={styles.tagValue}>{product.brand}</span>
            </div>
            <div className={styles.productTag}>
              <span className={styles.tagLabel}>Descripción:</span>
              <span className={styles.tagValue}>{product.description}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <i className="fa-solid fa-search" />
              Buscar grupo existente
            </h3>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setSelectedEquivalenceId(null);
              }}
              placeholder="Escribí para buscar grupos por código o descripción..."
              className={styles.searchInput}
              autoFocus
            />
          </div>

          {loading && (
            <div className={styles.loadingState}>
              <i className="fa-solid fa-spinner fa-spin" />
              <span>Buscando grupos...</span>
            </div>
          )}

          {!loading && debouncedSearch && equivalences.length === 0 && (
            <div className={styles.emptyState}>
              <i className="fa-solid fa-box-open" />
              <p>No se encontraron grupos. Podés crear uno nuevo.</p>
            </div>
          )}

          {!loading && equivalences.length > 0 && (
            <div className={styles.equivalenceList}>
              {equivalences.map((eq) => (
                <div
                  key={eq.id}
                  className={`${styles.equivalenceCard} ${
                    selectedEquivalenceId === eq.id ? styles.equivalenceCardSelected : ''
                  }`}
                  onClick={() => setSelectedEquivalenceId(eq.id)}
                >
                  <div className={styles.equivalenceRadio}>
                    <div
                      className={`${styles.radio} ${
                        selectedEquivalenceId === eq.id ? styles.radioActive : ''
                      }`}
                    >
                      {selectedEquivalenceId === eq.id && (
                        <i className="fa-solid fa-check" />
                      )}
                    </div>
                  </div>
                  <div className={styles.equivalenceInfo}>
                    <span className={styles.equivalenceCode}>
                      {eq.code || '—'}
                    </span>
                    <span className={styles.equivalenceDesc}>
                      {eq.description}
                    </span>
                    <span className={styles.equivalenceCount}>
                      {eq.products?.length || 0} producto(s)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedEquivalenceId && (
            <button
              onClick={handleLink}
              disabled={linking}
              className={styles.primaryBtn}
            >
              {linking ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  Vinculando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-link" />
                  Vincular a este grupo
                </>
              )}
            </button>
          )}

          <div className={styles.divider}>
            <span>O</span>
          </div>

          <div className={styles.section}>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={styles.toggleCreateBtn}
            >
              <i className={`fa-solid ${showCreateForm ? 'fa-chevron-up' : 'fa-plus-circle'}`} />
              {showCreateForm ? 'Ocultar creación' : 'Crear nuevo grupo con este producto'}
            </button>

            {showCreateForm && (
              <div className={styles.createForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Descripción *</label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Ej: Alternador Ford Focus 1.6"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Código (opcional)</label>
                  <div className={styles.codeInputRow}>
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="AAA12345BBB"
                      className={styles.formInput}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className={styles.genCodeBtn}
                      title="Generar código automático"
                    >
                      <i className="fa-solid fa-dice" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newDescription}
                  className={styles.primaryBtn}
                >
                  {creating ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus" />
                      Crear grupo y vincular
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerText}>
            El producto pasará a formar parte del grupo de equivalencias
          </span>
          <button onClick={onClose} className={styles.footerCloseBtn}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinkEquivalenceModal;
