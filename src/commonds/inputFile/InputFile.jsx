import React, { useState } from 'react';
import styles from './inputFile.module.css';
import { Icon, Label } from 'semantic-ui-react';

const FileInput = (props) => {
  const { selectedFiles, setSelectedFiles } = props;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // Limitar la cantidad de archivos seleccionados a 3
    if (files.length > 1) {
      alert('Solo puedes seleccionar hasta 1 archivo.');
      return;
    }
    setSelectedFiles(files);
  };

  return (
    <div className={styles.fileInputContainer}>
      <label htmlFor="file-upload" className={styles.customFileUpload}>
        Seleccionar imágenes
      </label>
      <input
        type="file"
        accept=".jpg, .jpeg"
        id="file-upload"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {/* Mostrar los nombres de los archivos seleccionados */}
      <div className={styles.fileList}>
        {selectedFiles.map((file, index) => (
          <div key={index} className={styles.labelContainer}>
            <Label as="a">
              {file.name}
              <Icon
                name="delete"
                onClick={() => {
                  setSelectedFiles(
                    selectedFiles.filter((file, i) => index != i)
                  );
                }}
              />
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileInput;
