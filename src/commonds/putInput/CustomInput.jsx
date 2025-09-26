import React, { useEffect, useState } from 'react';
import styles from './customInput.module.css';
import { useFormContext } from 'react-hook-form';

const formatNumber = (value) => {
  if (value == null || value === '') return '0,00';
  const nValue = String(value);
  
  // Si el valor ya está formateado (contiene comas o puntos), lo parseamos primero
  if (nValue.includes(',') || nValue.includes('.')) {
    // Remover formato existente y convertir a número
    const cleanValue = nValue.replace(/\./g, '').replace(',', '.');
    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) return '0,00';
    return numValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  // Si es un número puro del backend (como 174000), lo tratamos como pesos completos
  const numValue = parseFloat(nValue);
  if (isNaN(numValue)) return '0,00';
  
  return numValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function CustomInput(props) {
  const {
    width,
    icon,
    name,
    validate,
    readOnly,
    defaultValue,
    formatNum,
    ...rest
  } = props;
  const [classDivContainer, setClassDivContainer] = useState('inputContainer');
  const {
    register,
    formState: { errors },
    setValue, // Para actualizar el valor del campo en el formulario
  } = useFormContext();

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatNumber(rawValue);
    setValue(name, formattedValue); // Actualiza el valor en el formulario
  };

  // Mantener sincronizado el valor cuando se pasa via props.value
  useEffect(() => {
    if (rest.value !== undefined) {
      setValue(name, rest.value); // Actualiza el valor en react-hook-form
    }
  }, [rest.value, name, setValue]);

  // Si se habilita formatNum, formatear el defaultValue inicial
  useEffect(() => {
    if (formatNum) {
      const formatted = formatNumber(defaultValue);
      setValue(name, formatted);
    }
  }, [formatNum, defaultValue, name, setValue]);

  return (
    <div style={{ marginBottom: '15px' }} className={`${styles[width]}`}>
      <div
        onBlur={() => {
          setClassDivContainer('inputContainer');
        }}
        className={`${styles[classDivContainer]}`}
      >
        <i className={`${styles.searchIcon} ${icon}`}></i>
        <input
          defaultValue={!formatNum ? defaultValue || '' : formatNumber(defaultValue)}
          disabled={readOnly}
          {...register(name, validate)}
          onFocus={() => {
            setClassDivContainer('inputContainerActive');
          }}
          className={styles.input}
          onChange={formatNum ? handleChange : () => {}}
          {...rest}
        />
      </div>
      <div className={styles.errorContainer}>
        {errors[name] && <span>El campo es obligatorio</span>}
      </div>
    </div>
  );
}

export default CustomInput;
