import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { bulkUpdateBrandRentabilidad } from '../../request/brandRequest';
import Swal from 'sweetalert2';

function BulkUpdateRentabilidadModal({ show, onHide, onSuccess, brands = [], supplierId = null, supplierName = '', affectedCount = null }) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (show) setValue('');
  }, [show]);

  const parsed = Number(String(value).replace(',', '.'));
  const valid = value !== '' && !Number.isNaN(parsed) && parsed >= 0 && parsed <= 200;
  const totalCount = supplierId ? (affectedCount ?? 0) : brands.length;
  const canSubmit = valid && (supplierId ? affectedCount > 0 : brands.length > 0);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const result = await Swal.fire({
      title: '¿Aplicar rentabilidad?',
      html: supplierId
        ? `Se va a fijar <strong>${parsed} %</strong> a <strong>${totalCount}</strong> marca(s) del proveedor <strong>${supplierName}</strong>.<br/><br/><small>Los productos con rentabilidad personalizada no se modificarán.</small>`
        : `Se va a fijar <strong>${parsed} %</strong> a <strong>${totalCount}</strong> marca(s).<br/><br/><small>Los productos con rentabilidad personalizada no se modificarán.</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#673ab7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aplicar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    setSubmitting(true);
    try {
      const payload = supplierId
        ? { supplierId, rentabilidad: parsed / 100 }
        : { brandIds: brands.map((b) => b.id), rentabilidad: parsed / 100 };
      const res = await bulkUpdateBrandRentabilidad(payload);
      Swal.fire({
        icon: 'success',
        title: 'Rentabilidad actualizada',
        text: `Se actualizaron ${res.updatedCount ?? totalCount} marca(s) a ${parsed} %.`,
        timer: 3000,
        showConfirmButton: false,
      });
      onHide();
      if (onSuccess) onSuccess();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data || 'No se pudo actualizar la rentabilidad.',
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
        <Modal.Title>Fijar rentabilidad (masivo)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {supplierId ? (
          <p style={{ fontSize: 14, color: '#575757' }}>
            Se aplicará a <strong>{affectedCount ?? 0} marca(s)</strong> del proveedor <strong>{supplierName}</strong>. Se fijará el mismo valor a todas.
          </p>
        ) : (
          <>
            <p style={{ fontSize: 14, color: '#575757' }}>
              {brands.length} marca(s) seleccionada(s). Se fijará el mismo valor a todas.
            </p>
            <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 16, border: '1px solid #eee', borderRadius: 6 }}>
              {brands.map((b) => (
                <div
                  key={b.id}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}
                >
                  <span>{b.name} <span style={{ color: '#999' }}>{b.code}</span></span>
                  <span style={{ color: '#999' }}>{b.rentabilidad != null ? `${b.rentabilidad * 100} %` : '—'}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 4, fontSize: 14 }}>
          Nueva rentabilidad (%)
        </label>
        <input
          type="number"
          className="form-control"
          placeholder="Ej: 25"
          min="0"
          max="200"
          step="0.5"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={submitting}
        />
        {value !== '' && !valid && (
          <small style={{ color: '#d33' }}>Ingresá un valor entre 0 y 200.</small>
        )}
        <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
          Los productos con rentabilidad propia mantienen su valor.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !valid || !canSubmit}
          style={{ backgroundColor: '#673ab7', border: '1px solid #673ab7' }}
        >
          {submitting ? (
            <><Spinner animation="border" size="sm" /> Aplicando...</>
          ) : (
            'Aplicar rentabilidad'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BulkUpdateRentabilidadModal;
