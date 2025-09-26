import React from 'react';
import styles from './formClient.module.css';
import CustomSelect from '../select/CustomSelect';
import CustomTextArea from '../textarea/CustomTextArea';
import CustomInput from '../input/CustomInput';
import Button from 'react-bootstrap/Button';
import { FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import brand from '../../redux/brand';

const FormClientSupplier = (props) => {
  const { supMethods, onSubmitBrand } = props;
  const brands = useSelector((state) => state.brand.data);
  const listBrands = [{ text: 'TODAS', value: 0 }, ...brands];
  return (
    <FormProvider {...supMethods}>
      <form className={styles.containerTable1}>
        <CustomSelect
          name="brandId"
          text="Seleccioná una marca"
          arrayOptions={listBrands}
          validate={{ required: true }}
        />
        <CustomTextArea
          name="notas"
          width="large"
          placeholder="En este campo puedes ingresar comentarios adicionales... (Máximo 160 caracteres)"
          type="textarea"
          validate={{ required: false, maxLength: 160 }}
        />
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <CustomInput
            name="porcentaje" //es descuento
            width="small"
            placeholder="Recargo"
            icon="fas fa-percentage"
            type="number"
            min="-100"
            max="100"
            step="1"
            validate={{ required: true }}
          />
          <Button
            className={styles.selectButton}
            style={{
              backgroundColor: '#673ab7',
              border: '1px solid #673ab7',
            }}
            onClick={supMethods.handleSubmit(onSubmitBrand)}
          >
            Agregar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormClientSupplier;
