import React, { useState } from 'react';
import styles from './editBrand.module.css';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../commonds/putInput/CustomInput';
import { Button, Spinner } from 'react-bootstrap';

function EditBrandComponent(props) {
  const { brand, methods, handleSubmit, suppliers, loading, onAddSupplier, onDeleteSupplier } = props;
  const [selectedSupplierId, setSelectedSupplierId] = useState('');

  const currentSuppliers = brand?.brandSuppliers || [];
  const currentSupplierIds = currentSuppliers.map((bs) => bs.supplier?.id);
  const availableSuppliers = suppliers
    ? suppliers.filter((s) => !currentSupplierIds.includes(s.value))
    : [];

  const handleAdd = () => {
    if (!selectedSupplierId) return;
    onAddSupplier(selectedSupplierId);
    setSelectedSupplierId('');
  };

  return (
    <div className={styles.editBrandContainer}>
      <div className={styles.modalGrid}>
        <div className={styles.leftPanel}>
          <div className={styles.sectionHeader}>
            <i className="fa-solid fa-pen-ruler"></i>
            <span>Datos de la marca</span>
          </div>
          <FormProvider {...methods}>
            <form className={styles.formSection}>
              <CustomInput
                defaultValue={brand?.code}
                name="code"
                type="text"
                width="complete"
                placeholder="Código"
                icon="fas fa-hashtag"
                validate={{ required: true, maxLength: 25 }}
              />
              <CustomInput
                defaultValue={brand?.name}
                name="name"
                type="text"
                width="complete"
                placeholder="Nombre"
                icon="fa-solid fa-id-card"
                validate={{ required: true, maxLength: 25 }}
              />
              <CustomInput
                defaultValue={
                  brand?.rentabilidad
                    ? brand.rentabilidad * 100
                    : 0
                }
                name="rentabilidad"
                type="number"
                width="complete"
                placeholder="Porcentaje de renta"
                icon="fa-solid fa-percent"
                validate={{ required: true }}
              />
              <Button
                onClick={methods.handleSubmit(handleSubmit)}
                className={styles.updateButton}
              >
                {!loading ? (
                  'Actualizar datos'
                ) : (
                  <Spinner animation="border" variant="light" size="sm" />
                )}
              </Button>
            </form>
          </FormProvider>
        </div>

        <div className={styles.divider} />

        <div className={styles.rightPanel}>
          <div className={styles.sectionHeader}>
            <i className="fa-solid fa-truck-field"></i>
            <span>Proveedores vinculados</span>
          </div>

          <div className={styles.suppliersList}>
            {currentSuppliers.length > 0 ? (
              currentSuppliers.map((bs) => (
                <div key={bs.supplier?.id} className={styles.supplierRow}>
                  <div className={styles.supplierInfo}>
                    <div className={styles.supplierAvatar}>
                      {bs.supplier?.razonSocial?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className={styles.supplierName}>
                      {bs.supplier?.razonSocial}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => onDeleteSupplier(bs.supplier?.id)}
                    title="Eliminar proveedor"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <i className="fa-solid fa-box-open"></i>
                <span>Sin proveedores</span>
              </div>
            )}
          </div>

          <div className={styles.addSupplierSection}>
            <div className={styles.addSupplierRow}>
              <select
                className={`form-select ${styles.supplierSelect}`}
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
              >
                <option value="" disabled>
                  Seleccionar proveedor
                </option>
                {availableSuppliers.map((option, i) => (
                  <option key={i} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.addBtn}
                onClick={handleAdd}
                disabled={!selectedSupplierId}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBrandComponent;
