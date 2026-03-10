import React, { useState } from 'react';
import CustomInput from '../../commonds/putInput/CustomInput';
import { FormProvider } from 'react-hook-form';
import styles from './editProduct.module.css';
import { Button, Spinner } from 'react-bootstrap';
import FileInput from '../../commonds/inputFile/InputFile';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';

function EditProduct(props) {
  const { methods, product, update, files, onChangeActiveSupplier, onUpdateSupplierPrice } = props;
  const [changingSupplier, setChangingSupplier] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceInput, setPriceInput] = useState('');

  const brandSuppliers = product?.data?.brand?.brandSuppliers || [];
  const supplierPrices = product?.data?.supplierPrices || [];
  const activeSupplierId = product?.data?.activeSupplierId;
  const purchasePrice = product?.data?.purchasePrice;
  const calculatedSalePrice = product?.data?.calculatedSalePrice;

  console.log('EditProduct - product.data:', product?.data);
  console.log('EditProduct - brandSuppliers:', brandSuppliers);
  console.log('EditProduct - supplierPrices:', supplierPrices);

  const handleSupplierChange = async (supplierId) => {
    if (supplierId === activeSupplierId) return;
    setChangingSupplier(true);
    await onChangeActiveSupplier(product.data.id, supplierId);
    setChangingSupplier(false);
  };

  const handleStartEditPrice = (supplierId, currentPrice) => {
    setEditingPriceId(supplierId);
    setPriceInput(currentPrice != null ? String(currentPrice) : '');
  };

  const handleSavePrice = async (supplierId) => {
    const parsed = parseFloat(priceInput.replace(',', '.'));
    if (isNaN(parsed) || parsed < 0) return;
    await onUpdateSupplierPrice(product.data.id, supplierId, parsed);
    setEditingPriceId(null);
    setPriceInput('');
  };

  const handleCancelEditPrice = () => {
    setEditingPriceId(null);
    setPriceInput('');
  };

  return (
    <FormProvider {...methods}>
      <form>
        <div className={styles.inpFlex}>
          <div className={styles.medium}>
            <label>Artículo</label>
            <CustomInput
              readOnly={false}
              name="article"
              type="text"
              width="large"
              placeholder="Artículo"
              icon="fa-solid fa-id-card"
              validate={{ required: true }}
              defaultValue={product?.data?.article}
            />
          </div>
          <div className={styles.medium}>
            <label>Localización</label>
            <CustomInput
              readOnly={false}
              name="location"
              type="text"
              width="large"
              placeholder="Localización"
              icon="fa-solid fa-id-card"
              validate={{ required: false }}
              defaultValue={product?.data?.location}
            />
          </div>
        </div>
        <ProtectedComponent listAccesss={[1, 2, 5]}>
          <div className={styles.medium}>
            <label>Stock</label>
            <CustomInput
              readOnly={false}
              name="stock"
              type="text"
              width="large"
              placeholder="Stock"
              icon="fa-solid fa-id-card"
              validate={{ required: true }}
              defaultValue={product?.data?.stock?.stock}
            />
          </div>
        </ProtectedComponent>
        {brandSuppliers.length > 0 ? (
          <div className={styles.supplierPricingSection}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-dollar-sign"></i>
              <span>Gestión de Precios por Proveedor</span>
            </div>
            
            <div className={styles.priceCardsGrid}>
              {brandSuppliers.map((bs) => {
                const isActive = bs.supplierId === activeSupplierId;
                const supplierPrice = supplierPrices.find(sp => sp.supplierId === bs.supplierId);
                const hasPrice = supplierPrice?.purchasePrice != null;
                const isEditing = editingPriceId === bs.supplierId;
                
                return (
                  <div
                    key={bs.supplier?.id}
                    className={`${styles.priceCard} ${isActive ? styles.activeCard : ''} ${!hasPrice ? styles.noPriceCard : ''}`}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.supplierInfo}>
                        <div className={styles.supplierAvatar}>
                          {bs.supplier?.razonSocial?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className={styles.supplierDetails}>
                          <span className={styles.supplierName}>
                            {bs.supplier?.razonSocial}
                          </span>
                          {isActive && (
                            <span className={styles.activeBadge}>
                              <i className="fa-solid fa-check-circle"></i> Activo
                            </span>
                          )}
                        </div>
                      </div>
                      {isActive && !changingSupplier && (
                        <div className={styles.activeIndicator}>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      )}
                      {changingSupplier && bs.supplierId === activeSupplierId && (
                        <Spinner animation="border" size="sm" variant="primary" />
                      )}
                    </div>
                    
                    <div className={styles.cardBody}>
                      <div className={styles.priceRow}>
                        <span className={styles.priceLabel}>Precio de Compra:</span>
                        {isEditing ? (
                          <div className={styles.priceEditRow}>
                            <input
                              type="text"
                              className={styles.priceInput}
                              value={priceInput}
                              onChange={(e) => setPriceInput(e.target.value)}
                              placeholder="0.00"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSavePrice(bs.supplierId);
                                if (e.key === 'Escape') handleCancelEditPrice();
                              }}
                              autoFocus
                            />
                            <button
                              type="button"
                              className={styles.priceSaveBtn}
                              onClick={() => handleSavePrice(bs.supplierId)}
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                            <button
                              type="button"
                              className={styles.priceCancelBtn}
                              onClick={handleCancelEditPrice}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        ) : (
                          <span
                            className={styles.priceValue}
                            onClick={() => handleStartEditPrice(bs.supplierId, supplierPrice?.purchasePrice)}
                            style={{ cursor: 'pointer' }}
                            title="Click para editar"
                          >
                            {hasPrice ? `$${supplierPrice.purchasePrice.toFixed(2)}` : 'Sin precio'}
                            <i className="fa-solid fa-pencil" style={{ marginLeft: '4px', fontSize: '10px', opacity: 0.5 }}></i>
                          </span>
                        )}
                      </div>
                      
                      {isActive && hasPrice && (
                        <>
                          <div className={styles.divider}></div>
                          <div className={styles.priceRow}>
                            <span className={styles.priceLabel}>
                              Precio de Venta:
                              <span className={styles.priceHint}>
                                (con margen + IVA)
                              </span>
                            </span>
                            <span className={`${styles.priceValue} ${styles.salePriceValue}`}>
                              ${calculatedSalePrice?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                        </>
                      )}
                      
                      {!isActive && hasPrice && (
                        <button
                          type="button"
                          className={styles.setActiveBtn}
                          onClick={() => handleSupplierChange(bs.supplierId)}
                        >
                          Establecer como activo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {!activeSupplierId && supplierPrices.some(sp => sp.purchasePrice != null) && (
              <div className={styles.warningMessage}>
                <i className="fa-solid fa-info-circle"></i>
                <span>Seleccioná un proveedor activo para calcular el precio de venta</span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.supplierPricingSection}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-truck"></i>
              <span>Este producto no tiene proveedores asociados a la marca</span>
            </div>
          </div>
        )}
        <div>
          <label>Descripción</label>
          <CustomInput
            readOnly={false}
            name="description"
            type="text"
            width="large"
            placeholder="Artículo"
            icon="fa-solid fa-id-card"
            validate={{ required: true }}
            defaultValue={product?.data?.description}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
            <FileInput
              selectedFiles={files.selectedFiles}
              setSelectedFiles={files.setSelectedFiles}
            />
          </ProtectedComponent>
        </div>
        <div className={styles.buttoContainer}>
          <Button
            onClick={methods.handleSubmit(update)}
            type="button"
            style={{
              backgroundColor: '#673ab7',
              border: '1px solid #673ab7',
              height: '35px',
              width: '100px',
              marginLeft: '10px',
            }}
          >
            {!false ? (
              'Actualizar'
            ) : (
              <Spinner animation="border" variant="light" size="sm" />
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
export default EditProduct;
