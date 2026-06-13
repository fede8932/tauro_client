import React, { useState, useRef, useCallback } from 'react';
import styles from './inputFile.module.css';

const MAX_IMAGES = 10;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileInput = (props) => {
  const { selectedFiles, setSelectedFiles } = props;
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter((f) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type)
    );
    if (validFiles.length !== Array.from(files).length) {
      return;
    }
    setSelectedFiles((prev) => {
      const combined = [...prev, ...validFiles];
      return combined.slice(0, MAX_IMAGES);
    });
  }, [setSelectedFiles]);

  const handleFileChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const canAddMore = selectedFiles.length < MAX_IMAGES;

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : ''}`}
        onClick={() => canAddMore && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ cursor: canAddMore ? 'pointer' : 'default' }}
      >
        <div className={styles.dropZoneIcon}>
          <i className="fa-regular fa-images"></i>
        </div>
        <p className={styles.dropZoneText}>
          {canAddMore
            ? 'Arrastrá imágenes o hacé click para subir'
            : `Máximo ${MAX_IMAGES} imágenes`}
        </p>
        <p className={styles.dropZoneHint}>
          JPG, PNG o WebP &middot; {selectedFiles.length}/{MAX_IMAGES}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {selectedFiles.length > 0 && (
        <div className={styles.thumbnailGrid}>
          {selectedFiles.map((file, index) => (
            <div key={index} className={styles.thumbnailCard}>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={styles.thumbnailImg}
              />
              <div className={styles.thumbnailOverlay}>
                <button
                  type="button"
                  className={styles.thumbnailRemoveBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  title="Eliminar imagen"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
              <span className={styles.thumbnailFileName}>{file.name}</span>
              <span className={styles.thumbnailFileSize}>{formatFileSize(file.size)}</span>
            </div>
          ))}
          {canAddMore && (
            <button
              type="button"
              className={styles.addMoreBtn}
              onClick={() => inputRef.current?.click()}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Agregar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileInput;
