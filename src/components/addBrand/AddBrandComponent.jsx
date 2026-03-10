import React, { useState } from 'react';
import styles from './addBrand.module.css';
import CustomInput from '../../commonds/input/CustomInput';
import CustomSelect from '../../commonds/select/CustomSelect';
import CustomTextArea from '../../commonds/textarea/CustomTextArea';
import Button from 'react-bootstrap/esm/Button';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';

function AddBrandComponent(props) {
  const { onSubmit, status, methods, suppliers } = props;
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  const handleAddSupplier = (supplierId) => {
    if (!supplierId || selectedSuppliers.find((s) => s.value === Number(supplierId))) return;
    const supplier = suppliers.find((s) => s.value === Number(supplierId));
    if (supplier) {
      setSelectedSuppliers((prev) => [...prev, supplier]);
    }
  };

  const handleRemoveSupplier = (supplierId) => {
    setSelectedSuppliers((prev) => prev.filter((s) => s.value !== supplierId));
  };

  const handleSubmit = (data) => {
    if (selectedSuppliers.length === 0) return;
    data.supplierIds = selectedSuppliers.map((s) => s.value);
    onSubmit(data).then(() => {
      setSelectedSuppliers([]);
    });
  };

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
              placeholder="Código de marca"
              icon="fas fa-hashtag"
              validate={{ required: true }}
            />
            <CustomInput
              name="name"
              type="text"
              width="large"
              placeholder="Nombre"
              icon="fa-solid fa-id-card"
              validate={{ required: true }}
            />
            {suppliers && (
              <>
                <div className={styles.supplierSection}>
                  <select
                    className={`form-select ${styles.supplierSelect}`}
                    onChange={(e) => {
                      handleAddSupplier(e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Seleccioná proveedores
                    </option>
                    {suppliers
                      .filter((s) => !selectedSuppliers.find((sel) => sel.value === s.value))
                      .map((option, i) => (
                        <option key={i} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                  </select>
                  {selectedSuppliers.length > 0 && (
                    <div className={styles.chipsContainer}>
                      {selectedSuppliers.map((supplier) => (
                        <div key={supplier.value} className={styles.chip}>
                          <span className={styles.chipText}>{supplier.text}</span>
                          <button
                            type="button"
                            className={styles.chipRemove}
                            onClick={() => handleRemoveSupplier(supplier.value)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedSuppliers.length === 0 && (
                    <span className={styles.supplierHint}>
                      Debés seleccionar al menos un proveedor
                    </span>
                  )}
                </div>
                <CustomSelect
                  width="medium"
                  text="Factura"
                  name="seFactura"
                  validate={{ required: true }}
                  arrayOptions={[
                    { value: true, text: 'Facturar' },
                    { value: false, text: 'No facturar' },
                  ]}
                />
              </>
            )}
          </div>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos adicionales</span>
            <CustomInput
              name="renta"
              type="number"
              width="complete"
              placeholder="Rentabilidad"
              icon="fa-solid fa-percent"
              validate={{ required: true }}
            />
            <CustomTextArea
              name="notas"
              width="large"
              placeholder="En este campo puedes ingresar la descripción... (Máximo 160 caracteres)"
              type="textarea"
              validate={{ required: false, maxLength: 160 }}
            />
          </div>
        </div>
        <Button
          onClick={methods.handleSubmit(handleSubmit)}
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

export default AddBrandComponent;
