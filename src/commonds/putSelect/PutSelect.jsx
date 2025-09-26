import React from 'react';
import styles from './customSelect.module.css';
import { useFormContext, Controller } from 'react-hook-form';

function PutSelect(props) {
  const {
    text,
    arrayOptions,
    width,
    name,
    validate,
    active,
    fnSelect,
    extraFn,
    defaultValue,
  } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext();
  // console.log(arrayOptions);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue !== undefined || defaultValue !== null ? defaultValue : ''}
      rules={validate}
      render={({ field }) => (
        <select
          disabled={active == undefined ? false : active}
          className={`form-select ${styles.selectContainer} ${styles[width]}`}
          {...field}
          onChange={(e) => {
            field.onChange(e); // Asegurarse de que el controlador reciba el evento
            const selectedValue = e.target.value;
            // console.log(selectedValue);
            if (fnSelect) {
              fnSelect(e.target.value);
            }
            if (extraFn) {
              if (e.target.value !== 'P') {
                extraFn(true);
              } else {
                extraFn(false);
              }
            }
          }}
        >
          <option value="" disabled>
            {text}
          </option>
          {arrayOptions?.map((option, i) => {
            return (
              <option key={i} value={option.value}>
                {option.text}
              </option>
            );
          })}
        </select>
      )}
    />
  );
}

export default PutSelect;
