import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getBrandsByData } from '../../request/brandRequest';
import { bulkAssignActiveSupplier } from '../../request/productRequest';
import Swal from 'sweetalert2';

function BulkAssignSupplierModal({ show, onHide, onSuccess, initialBrand }) {
  const suppliers = useSelector((state) => state.supplier.data);

  const [brandSearch, setBrandSearch] = useState('');
  const [brandResults, setBrandResults] = useState([]);
  const [brandSearching, setBrandSearching] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const brandSearchTimeout = useRef(null);

  useEffect(() => {
    if (show && initialBrand) {
      setSelectedBrand(initialBrand);
      setBrandSearch(initialBrand.name);
      setSelectedSupplierId('');
    }
    if (!show) {
      setSelectedBrand(null);
      setBrandSearch('');
      setSelectedSupplierId('');
    }
  }, [show, initialBrand]);

  const handleBrandSearchChange = useCallback((e) => {
    const value = e.target.value;
    setBrandSearch(value);
    setSelectedBrand(null);
    if (brandSearchTimeout.current) clearTimeout(brandSearchTimeout.current);
    if (!value || value.length < 2) {
      setBrandResults([]);
      setShowBrandDropdown(false);
      return;
    }
    setBrandSearching(true);
    brandSearchTimeout.current = setTimeout(async () => {
      try {
        const results = await getBrandsByData(value);
        setBrandResults(results || []);
        setShowBrandDropdown(true);
      } catch {
        setBrandResults([]);
      } finally {
        setBrandSearching(false);
      }
    }, 350);
  }, []);

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    setSelectedSupplierId('');
    setBrandSearch(brand.name);
    setShowBrandDropdown(false);
  };

  const handleSubmit = async () => {
    if (!selectedBrand || !selectedSupplierId) {
      Swal.fire({
        icon: 'warning',
        title: 'Completá los campos',
        text: 'Seleccioná una marca y un proveedor',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const supplierName = suppliers.find(s => s.value === selectedSupplierId)?.text || '';

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `Se va a asignar <strong>${supplierName}</strong> como proveedor por defecto a todos los productos de <strong>${selectedBrand.name}</strong> que tengan precio de ese proveedor.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setSubmitting(true);
    try {
      const res = await bulkAssignActiveSupplier(selectedBrand.id, selectedSupplierId);
      Swal.fire({
        icon: 'success',
        title: 'Proveedor asignado',
        html: `Se actualizaron <strong>${res.affectedCount}</strong> producto(s).<br/><br/>
               <small>Solo se actualizaron los productos que tenían precio registrado para el proveedor seleccionado.</small>`,
        timer: 4000,
        showConfirmButton: false,
      });
      onHide();
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg = error.response?.data || 'Ocurrió un error al asignar el proveedor';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" backdrop="static">
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Asignar proveedor por defecto (masivo)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Marca
          </label>
          {initialBrand ? (
            <span style={{
              display: 'inline-block', padding: '6px 12px',
              background: '#e8f5e9', borderRadius: 4, fontSize: 14, color: '#2e7d32',
              fontWeight: 500,
            }}>
              <i className="fa-solid fa-check"></i> {initialBrand.name}
            </span>
          ) : (
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar marca..."
                value={brandSearch}
                onChange={handleBrandSearchChange}
                onBlur={() => setTimeout(() => setShowBrandDropdown(false), 200)}
                onFocus={() => { if (brandResults.length > 0) setShowBrandDropdown(true); }}
              />
              {brandSearching && (
                <Spinner animation="border" size="sm" style={{ position: 'absolute', right: 8, top: 8 }} />
              )}
              {showBrandDropdown && brandResults.length > 0 && (
                <ul style={{
                  position: 'absolute', zIndex: 1000, width: '100%',
                  background: '#fff', border: '1px solid #ccc', borderRadius: 4,
                  maxHeight: 200, overflowY: 'auto', listStyle: 'none',
                  padding: 0, margin: '4px 0 0 0',
                }}>
                  {brandResults.map((b) => (
                    <li
                      key={b.id}
                      onMouseDown={() => handleSelectBrand(b)}
                      style={{
                        padding: '8px 12px', cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f0f0f0'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {b.name} <span style={{ color: '#999', fontSize: 12 }}>{b.code}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Proveedor
          </label>
          {!selectedBrand ? (
            <p style={{ color: '#999', margin: '8px 0 0 0', fontSize: 14 }}>
              Seleccioná primero una marca
            </p>
          ) : (
            <select
              className="form-control"
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
            >
              <option value="">Seleccionar proveedor...</option>
              {(() => {
                const brandSupplierIds = new Set(
                  (selectedBrand.brandSuppliers || []).map(bs => bs.supplierId)
                );
                return suppliers
                  .filter(s => brandSupplierIds.has(s.value))
                  .map((s) => (
                    <option key={s.value} value={s.value}>{s.text}</option>
                  ));
              })()}
            </select>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={submitting || !selectedBrand || !selectedSupplierId}
          style={{ backgroundColor: '#673ab7', border: '1px solid #673ab7' }}
        >
          {submitting ? (
            <><Spinner animation="border" size="sm" /> Asignando...</>
          ) : (
            'Asignar Proveedor por Defecto'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BulkAssignSupplierModal;
