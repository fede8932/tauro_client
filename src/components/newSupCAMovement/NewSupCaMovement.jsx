import styles from './newSupMovement.module.css';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { createSupMovementsRequest, updateSupMovementsRequest } from '../../request/supMovementRequest';
import { setActualizar } from '../../redux/supCurrentAcount';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

const NewSupCaMovement = (props) => {
  const { movement } = props;
  const [formData, setFormData] = useState({
    billType: movement?.billType ?? '',
    type: movement?.type ?? '',
    fecha: movement?.fecha ?? '',
    totalAmount: movement?.total ?? '',
    numComprobante: movement?.numComprobante ?? '',
    concept: movement?.concept ?? '',
    currentAcountId: movement?.currentAcountId ?? props.currentAcountId,
  });

  const dispatch = useDispatch();

  const [movTypeState, setMovTypeState] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Formateamos el monto total (en centavos) a representación monetaria
    if (name === 'totalAmount') {
      const raw = value.replace(/\D/g, '');
      const num = parseInt(raw || '0', 10);
      const amount = num / 100;
      const formatted = amount.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      billType: parseInt(formData.billType),
      type: parseInt(formData.type),
      fecha: new Date(formData.fecha).toISOString(),
      totalAmount: parseFloat(
        formData.totalAmount.replace(/\./g, '').replace(',', '.')
      ),
      numComprobante: parseInt(formData.numComprobante),
      concept: formData.concept || '',
    };

    if (!movement) {
      createSupMovementsRequest(payload)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Se cargó el movimiento con éxito.',
            showConfirmButton: false,
            timer: 3000,
          });
          dispatch(setActualizar());
          props.closeModal();
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el movimiento. Verifique si no es un duplicado.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33',
          });
        });
    }
    else
    {
      const sendUpdate = {
        id: movement.id,
        numCte: payload.numComprobante,
        amount: payload.totalAmount
      }
      updateSupMovementsRequest(sendUpdate)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Se actulizó el movimiento con éxito.',
            showConfirmButton: false,
            timer: 3000,
          });
          dispatch(setActualizar());
          props.closeModal();
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el movimiento. Verifique si no es un duplicado.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33',
          });
        });
    }
  };

  useEffect(() => {
    switch (formData.type) {
      case '1':
        setMovTypeState([
          { text: 'NCA', value: 3 },
          // { text: 'NCB', value: 8 },
          // { text: 'NCC', value: 13 },
          { text: 'NCP', value: 2 },
        ]);
        break;
      case '0':
        setMovTypeState([
          { text: 'A', value: 1 },
          // { text: 'B', value: 6 },
          // { text: 'C', value: 11 },
          { text: 'P', value: 0 },
        ]);
        break;
      default:
        setMovTypeState([]);
        break;
    }
  }, [formData.type]);

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="type">
            <Form.Label>Tipo de Movimiento</Form.Label>
            <Form.Select
              disabled={movement}
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="0">Factura</option>
              <option value="1">Nota de Crédito</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {!movement ? (
          <Col>
            <Form.Group controlId="billType">
              <Form.Label>Tipo de Comprobante</Form.Label>
              <Form.Select
                disabled={movTypeState.length == 0}
                name="billType"
                value={formData.billType}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                {movTypeState.map((m) => (
                  <option value={m.value}>{m.text}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        ) : null}
      </Row>

      {!movement ? (
        <Form.Group className="mb-3" controlId="fecha">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </Form.Group>
      ) : null}

      <Form.Group className="mb-3" controlId="totalAmount">
        <Form.Label>Total</Form.Label>
        <Form.Control
          type="text"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="numComprobante">
        <Form.Label>Número de Comprobante</Form.Label>
        <Form.Control
          type="number"
          name="numComprobante"
          value={formData.numComprobante}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="concept">
        <Form.Label>Concepto (opcional)</Form.Label>
        <Form.Control
          disabled={movement}
          type="text"
          name="concept"
          value={formData.concept}
          onChange={handleChange}
        />
      </Form.Group>
      <Row className="w-100 justify-content-end">
        <Button style={{ width: '150px' }} variant="primary" type="submit">
          Guardar
        </Button>
      </Row>
    </Form>
  );
};

export default NewSupCaMovement;
