import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const InvoiceForm = (props) => {
  const { closeModal, onSubmit } = props;
  const [formData, setFormData] = useState({
    percentage: '',
    concept: '',
    isOfficial: false,
  });

  const [errors, setErrors] = useState({
    percentage: '',
    concept: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = { percentage: '', concept: '' };

    if (!formData.percentage || parseFloat(formData.percentage) <= 0 || parseFloat(formData.percentage) > 100) {
      newErrors.percentage = 'El monto es requerido y debe ser mayor a 0 y menos o igual a 100.';
      valid = false;
    }

    if (!formData.concept.trim()) {
      newErrors.concept = 'El concepto es requerido.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit?.(formData);
    closeModal();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formConcept">
        <Form.Label>Concepto</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese el concepto"
          name="concept"
          value={formData.concept}
          onChange={handleChange}
          isInvalid={!!errors.concept}
        />
        <Form.Control.Feedback type="invalid">
          {errors.concept}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formPercentage">
        <Form.Label>Porcentaje</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ingresar el porcentaje"
          name="percentage"
          value={formData.percentage}
          onChange={handleChange}
          isInvalid={!!errors.percentage}
        />
        <Form.Control.Feedback type="invalid">
          {errors.percentage}
        </Form.Control.Feedback>
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formIsOfficial">
        <Form.Check
          type="checkbox"
          label="Factura oficial"
          name="isOfficial"
          checked={formData.isOfficial}
          onChange={handleChange}
        />
      </Form.Group> */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </div>
    </Form>
  );
};

export default InvoiceForm;
