import React, { useEffect, useState } from 'react';
import styles from './customInput.module.css';
import { useFormContext } from 'react-hook-form';

// Formatea una cadena de dígitos como moneda con formato es-AR: x.xxx.xxx,xx
// Reglas:
// - Solo se permiten dígitos en la entrada
// - Los últimos 2 dígitos son los decimales
// - Se insertan separadores de miles "." y decimales ","
const formatCurrencyFromDigits = (value) => {
  if (value == null) return '0,00';
  // Mantener únicamente los dígitos (soporta pegar valores con símbolos)
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 0) return '0,00';

  let intPart = '0';
  let fracPart = '00';

  if (digits.length === 1) {
    // x -> 0,0x
    fracPart = `0${digits}`;
  } else if (digits.length === 2) {
    // xy -> 0,xy
    fracPart = digits;
  } else {
    // abc..xy -> abc..,xy
    intPart = digits.slice(0, -2).replace(/^0+/, '') || '0';
    fracPart = digits.slice(-2);
  }

  // Agregar separadores de miles a la parte entera
  const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${intWithSep},${fracPart}`;
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

  // Cuenta cuántos dígitos hay a la izquierda del caret
  const countDigitsLeft = (str, caretIndex) => {
    let count = 0;
    for (let i = 0; i < Math.max(0, caretIndex); i++) {
      const ch = str[i];
      if (ch >= '0' && ch <= '9') count++;
    }
    return count;
  };

  // Dado un string formateado y una cantidad de dígitos a la izquierda,
  // devuelve el índice de caret equivalente en el texto formateado
  const caretIndexFromDigits = (formatted, digitsLeft) => {
    if (digitsLeft <= 0) return 0;
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      const ch = formatted[i];
      if (ch >= '0' && ch <= '9') {
        count++;
        if (count === digitsLeft) {
          // Posicionar el caret justo después de este dígito
          return i + 1;
        }
      }
    }
    // Si hay menos dígitos que digitsLeft, ubicar al final
    return formatted.length;
  };

  const handleChange = (e) => {
    const input = e.target;
    const rawValue = input.value;
    const caretBefore = input.selectionStart ?? rawValue.length;

    // Cantidad de dígitos a la izquierda del caret antes de formatear
    const digitsLeft = countDigitsLeft(rawValue, caretBefore);

    // Formatear (se normaliza a dígitos => formato es-AR con ., y ,)
    const formattedValue = formatCurrencyFromDigits(rawValue);

    // Actualizar el valor en el formulario y en el input visible
    setValue(name, formattedValue, { shouldDirty: true, shouldValidate: false });
    input.value = formattedValue;

    // Calcular nueva posición del caret equivalente
    const newCaret = caretIndexFromDigits(formattedValue, digitsLeft);
    // Restaurar selección/caret
    requestAnimationFrame(() => {
      try {
        input.setSelectionRange(newCaret, newCaret);
      } catch (_) {}
    });
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
      const formatted = formatCurrencyFromDigits(defaultValue ?? '');
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
          defaultValue={!formatNum ? defaultValue || '' : formatCurrencyFromDigits(defaultValue ?? '')}
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
