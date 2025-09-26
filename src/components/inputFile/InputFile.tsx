import React, { useRef } from 'react';

const StockUploadButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simula el clic en el input file
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aquí puedes procesar el archivo Excel
      console.log('Archivo seleccionado:', file.name);
      // Puedes añadir lógica para enviar el archivo al servidor o procesarlo en el frontend
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Add stock</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} // Oculta el input file
        accept=".xlsx, .xls" // Solo permite archivos Excel
        onChange={handleFileChange}
      />
    </div>
  );
};

export default StockUploadButton;
