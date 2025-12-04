import React from 'react';
import styles from './addProduct.module.css';
import { FormProvider } from 'react-hook-form';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import ExcelUpload from '../../commonds/upload/ExcelUpload';
import { Checkbox } from 'semantic-ui-react';
import { downloadProductTemplate } from '../../request/productRequest';

function AddProductsFormComponent(props) {
  const {
    onSubmit,
    status,
    methods,
    setSelectedFile,
    selectedFile,
    checks,
    setChecks,
  } = props;

  const handleDownloadTemplate = async () => {
    try {
      const response = await downloadProductTemplate();
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cargar_productos_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error descargando template:', error);
    }
  };

  const changeCheck = (e, d) => {
    let newChecks = { ...checks };
    newChecks[d.name] = d.checked;
    for (let key in newChecks) {
      if (newChecks.hasOwnProperty(key) && newChecks[key] === true) {
        setChecks(newChecks);
        return;
      }
    }
  };
  // console.log(selectedFile);
  return (
    <FormProvider {...methods}>
      <div className={styles.checkContainer}>
        <Checkbox
          label="Precio"
          name="price"
          checked={checks.price}
          onClick={changeCheck}
        />
        <Checkbox
          label="Descripción"
          name="description"
          checked={checks.description}
          onClick={changeCheck}
        />
        <Checkbox
          label="Ubicación"
          name="location"
          checked={checks.location}
          onClick={changeCheck}
        />
        <Checkbox
          label="Stock"
          name="stock"
          checked={checks.stock}
          onClick={changeCheck}
        />
      </div>
      <form className={styles.formContainer}>
        <div className={styles.subFormContainer}>
          <div className={styles.infoInputContainer}></div>
          <div className={styles.subUploadContainer}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className={styles.subTitle}>Subir productos</span>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleDownloadTemplate}
                style={{
                  marginTop: '5px',
                  fontSize: '12px',
                  padding: '4px 8px',
                  height: 'auto',
                }}
              >
                <i className="fa-solid fa-download" style={{ marginRight: '5px' }}></i>
                Descargar template
              </Button>
            </div>
            <div className={styles.uploadContainer}>
              <ExcelUpload
                label={true}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            </div>
          </div>
        </div>
        <Button
          type="button"
          disabled={selectedFile ? false : true}
          onClick={methods.handleSubmit(onSubmit)}
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

export default AddProductsFormComponent;
