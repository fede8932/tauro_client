import React, { useState } from 'react';
import styles from './posEcommerce.module.css';

const VEHICLE_BRANDS = [
  'ALFA ROMEO', 'AUDI', 'BMW', 'CHEVROLET', 'CITROEN', 'FIAT', 'FORD',
  'HONDA', 'HYUNDAI', 'JEEP', 'KIA', 'LAND ROVER', 'LEXUS', 'MAZDA',
  'MERCEDES-BENZ', 'MITSUBISHI', 'NISSAN', 'PEUGEOT', 'PORSCHE',
  'RENAULT', 'SUBARU', 'SUZUKI', 'TOYOTA', 'VOLKSWAGEN', 'VOLVO',
];

const PRODUCT_BRANDS = [
  'ACDelco', 'Bosch', 'Continental', 'Denso', 'Febi', 'Gates',
  'Hella', 'Lemforder', 'Mann-Filter', 'NGK', 'SKF', 'Valeo',
  'ATE', 'Brembo', 'Textar', 'Sachs', 'ZF', 'DINN', 'Meyle', 'TRW',
];

function PosEcommerce() {
  const [searchText, setSearchText] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const handleReset = () => {
    setSearchText('');
    setVehicleBrand('');
    setProductBrand('');
    setShowSaleOnly(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterCard}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Buscar producto</label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por código o descripción..."
              className={styles.input}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Marca del vehículo</label>
            <select
              value={vehicleBrand}
              onChange={(e) => setVehicleBrand(e.target.value)}
              className={styles.select}
            >
              <option value="">Todas las marcas</option>
              {VEHICLE_BRANDS.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Marca del producto</label>
            <select
              value={productBrand}
              onChange={(e) => setProductBrand(e.target.value)}
              className={styles.select}
            >
              <option value="">Todas las marcas</option>
              {PRODUCT_BRANDS.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Ofertas</label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showSaleOnly}
                onChange={(e) => setShowSaleOnly(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Solo ofertas</span>
            </label>
          </div>
        </div>
        <div className={styles.filterActions}>
          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
              title="Vista de cuadrícula"
            >
              <i className="fa-solid fa-th" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
              title="Vista de lista"
            >
              <i className="fa-solid fa-list" />
            </button>
          </div>
          <button onClick={handleReset} className={styles.resetButton}>
            <i className="fa-solid fa-times" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PosEcommerce;
