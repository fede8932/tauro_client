import React, { useState, useRef, useEffect } from 'react';
import styles from './brandSelector.module.css';

function BrandSelector({ brands = [], selectedBrands = [], onChange }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = brands.filter((b) =>
    b.text.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBrand = (id) => {
    const next = selectedBrands.includes(id)
      ? selectedBrands.filter((bid) => bid !== id)
      : [...selectedBrands, id];
    onChange(next);
  };

  const removeBrand = (id) => {
    onChange(selectedBrands.filter((bid) => bid !== id));
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.inputContainer}>
        <i className={`${styles.searchIcon} fas fa-search`}></i>
        <input
          type="text"
          placeholder="Buscar marcas..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          className={styles.input}
        />
      </div>

      {selectedBrands.length > 0 && (
        <div className={styles.chips}>
          {selectedBrands.map((id) => {
            const brand = brands.find((b) => b.value === id);
            if (!brand) return null;
            return (
              <span key={id} className={styles.chip}>
                {brand.text}
                <button
                  type="button"
                  className={styles.chipClose}
                  onClick={() => removeBrand(id)}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}

      {isOpen && filtered.length > 0 && (
        <div className={styles.dropdown}>
          {filtered.map((b) => (
            <label key={b.value} className={styles.option}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.value)}
                onChange={() => toggleBrand(b.value)}
              />
              <span>{b.text}</span>
            </label>
          ))}
        </div>
      )}

      {isOpen && search && filtered.length === 0 && (
        <div className={styles.dropdown}>
          <span className={styles.noResults}>Sin resultados</span>
        </div>
      )}
    </div>
  );
}

export default BrandSelector;
