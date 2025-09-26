import React, { useEffect } from 'react';
import formatCost from '../../utils/formatCost';
import styles from './addProduct.module.css';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../commonds/input/CustomInput';
import CustomSelect from '../../commonds/select/CustomSelect';
import CustomTextArea from '../../commonds/textarea/CustomTextArea';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import FileInput from '../../commonds/inputFile/InputFile';

function AddProductFormComponent(props) {
  // Formateamos el campo listPrice mientras el usuario escribe
  // Se obtienen setValue y watch desde los métodos del formulario pasados como prop
  const { setValue, watch } = props.methods;
  const listPrice = watch('listPrice');

  useEffect(() => {
    if (typeof listPrice === 'string' && listPrice.length > 0) {
      // Eliminamos todo excepto dígitos
      const raw = listPrice.replace(/\D/g, '');
      const num = parseInt(raw || '0', 10);
      // Convertimos a centavos y formateamos
      const formatted = formatCost(num / 100);
      if (formatted !== listPrice) {
        setValue('listPrice', formatted);
      }
    }
  }, [listPrice, setValue]);
  const {
    onSubmit,
    status,
    methods,
    suppliers,
    brands,
    selectStatus,
    setSelectStatus,
    files,
  } = props;
  // console.log(brands);
  return (
    <FormProvider {...methods}>
      <form className={styles.formContainer}>
        <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos generales</span>
            <CustomInput
              name="code"
              type="text"
              width="large"
              placeholder="Código de artículo"
              icon="fas fa-hashtag"
              validate={{ required: true }}
            />
            {/* <CustomInput
              name="intCode"
              type="text"
              width="large"
              placeholder="Código de barras"
              icon="fa-solid fa-barcode"
            /> */}
            <CustomInput
              name="name"
              type="text"
              width="large"
              placeholder="Nombre / referencia"
              icon="fa-solid fa-id-card"
              validate={{ required: true }}
            />
            {suppliers && (
              <CustomSelect
                text="Seleccioná la proveedor"
                name="supplierName"
                validate={{ required: true }}
                arrayOptions={suppliers}
                fnSelect={setSelectStatus}
              />
            )}
            {
              <CustomSelect
                active={selectStatus}
                text="Seleccioná la marca"
                name="brandId"
                validate={{ required: true }}
                arrayOptions={brands}
              />
            }
          </div>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos adicionales</span>
            <CustomTextArea
              name="notas"
              width="large"
              placeholder="En este campo puedes ingresar la descripción... (Máximo 160 caracteres)"
              type="textarea"
              validate={{ required: false, maxLength: 160 }}
            />
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <CustomInput
                name="listPrice"
                type="text"
                width="small"
                placeholder="Costo"
                icon="fas fa-dollar-sign"
                validate={{ required: true }}
              />
              <CustomInput
                name="location"
                type="text"
                width="small"
                placeholder="Ubicación"
                icon="fas fa-sort-numeric-up"
                validate={{ required: true }}
              />
            </div>
            <FileInput
              selectedFiles={files.selectedFiles}
              setSelectedFiles={files.setSelectedFiles}
            />
          </div>
        </div>
        <Button
          onClick={methods.handleSubmit(onSubmit)}
          style={{
            backgroundColor: '#673ab7',
            border: '1px solid #673ab7',
            marginTop: '35px',
            height: '48px',
          }}
        >
          {!status ? (
            'Agregar'
          ) : (
            <Spinner animation="border" variant="light" size="sm" />
          )}
        </Button>
      </form>
    </FormProvider>
  );
}

export default AddProductFormComponent;
