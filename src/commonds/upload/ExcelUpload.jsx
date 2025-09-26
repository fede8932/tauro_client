import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';

function ExcelUpload(props) {
  const { selectedFile, setSelectedFile, label } = props;
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div style={{ width: '45%', display: 'flex', alignItems: 'center' }}>
      <Form.Group controlId="formFile" className="mb-3">
        {label ? <Form.Label>Subir listado de productos</Form.Label> : null}
        <Form.Control type="file" accept=".xls" onChange={handleFileChange} />
      </Form.Group>
      {/*state && selectedFile? (
        <Spinner
          animation="border"
          variant="secondary"
          size="sm"
          style={{ margin: "12px 0px 0px 5px" }}
        />
      ) : null*/}
    </div>
  );
}

export default ExcelUpload;
