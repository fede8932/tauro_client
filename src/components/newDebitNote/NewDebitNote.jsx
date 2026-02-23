import React, { useState } from 'react';
import { Button, Form, Input, TextArea } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { createDebitNoteRequest } from '../../request/currentAcountRequest';
import { useDispatch, useSelector } from 'react-redux';
import { getMovementsByCurrentAcountIdX } from '../../redux/searchCurrentAcount';

function NewDebitNote(props) {
  const { currentAcountId, closeModal } = props;
  const [descripcion, setDescripcion] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const filterMovements = useSelector((state) => state.filterMovementsOrder);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La descripción es obligatoria',
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    const monto = parseFloat(montoTotal);
    if (isNaN(monto) || monto <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El monto debe ser mayor a cero',
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      html: `Vas a crear una <b>Nota de Débito</b> por <b>$${monto.toFixed(2)}</b>.<br/>Concepto: ${descripcion}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await createDebitNoteRequest(currentAcountId, {
            descripcion: descripcion.toUpperCase(),
            montoTotal: monto,
          });

          Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'La nota de débito fue creada correctamente.',
            timer: 2500,
            showConfirmButton: false,
          });

          dispatch(getMovementsByCurrentAcountIdX(filterMovements));
          closeModal();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data || 'Ocurrió un error al crear la nota de débito',
            showConfirmButton: true,
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field required>
        <label>Descripción</label>
        <TextArea
          placeholder="Ej: Cheque rechazado, Gastos administrativos, etc."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />
      </Form.Field>
      <Form.Field required>
        <label>Monto Total</label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={montoTotal}
          onChange={(e) => setMontoTotal(e.target.value)}
          icon="dollar"
          iconPosition="left"
        />
      </Form.Field>
      <Button type="submit" primary loading={loading} disabled={loading}>
        Crear Nota de Débito
      </Button>
      <Button type="button" onClick={closeModal} disabled={loading}>
        Cancelar
      </Button>
    </Form>
  );
}

export default NewDebitNote;
