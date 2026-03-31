import React, { useEffect, useState } from 'react';
import AddProductFormComponent from '../components/addProductForm/AddProductFormComponent';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSupplierRequest } from '../redux/supplier';
import { getBrandByRSRequest } from '../redux/brand';
import {
  productCreateRequest,
  productsFileCreateRequest,
} from '../redux/product';
import Swal from 'sweetalert2';
import LoadingSpinner from '../commonds/loading/LoadingSpinner';
import AddProductsFormComponent from '../components/addProductsForm/AddProductsFormComponent';

function AddProductFormContainer(props) {
  const { view } = props;
  const [checks, setChecks] = useState({
    price: true,
    description: false,
    location: false,
    stock: false,
  });
  const [selectStatus, setSelectStatus] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedExcel, setSelectedExcel] = useState(null);
  const dispatch = useDispatch();
  const methods = useForm();
  const suppliers = useSelector((state) => state.supplier);
  const brands = useSelector((state) => state.brand);
  const productStatus = useSelector((state) => state.product.loading);
  const addProduct = (data) => {
    if (data.cantidad === '') {
      data.cantidad = 0;
    }
    if (selectedFiles.length > 0) {
      data.images = selectedFiles;
    }
    dispatch(productCreateRequest(data))
      .then((res) => {
        if (res.error) {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo guardar tu registro',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 2500,
          });
          return;
        }
        Swal.fire({
          icon: 'success',
          title: 'Registrado con éxito',
          showConfirmButton: false,
          timer: 1000,
        });
        methods.reset();
        setSelectedFiles([]);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo registrar',
          icon: 'error',
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
      });
  };
  const addFileProduct = () => {
    dispatch(productsFileCreateRequest({ file: selectedExcel, check: checks }))
      .then((res) => {
        if (res.error) {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo guardar tu registro',
            icon: 'error',
            showConfirmButton: false,
            timer: 2500,
          });
          return;
        }

        const data = res.payload;
        const hasWarnings = data.brandsNotFound?.length > 0 || 
                           data.suppliersNotFound?.length > 0 || 
                           data.skipped > 0;
        const hasAssociations = data.brandSupplierAssociated?.length > 0;

        // Construir mensaje HTML detallado
        let htmlContent = `
          <div style="text-align: left; font-size: 14px;">
            <p><strong>Total filas procesadas:</strong> ${data.totalRows}</p>
            <p><strong>✅ Agregados:</strong> ${data.added}</p>
            <p><strong>🔄 Actualizados:</strong> ${data.updated}</p>
            ${data.skipped > 0 ? `<p><strong>⚠️ Omitidos:</strong> ${data.skipped}</p>` : ''}
        `;

        if (hasAssociations) {
          htmlContent += `
            <hr style="margin: 10px 0;">
            <p><strong>🔗 Proveedores asociados a marcas:</strong></p>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${data.brandSupplierAssociated.map(a => `<li>${a}</li>`).join('')}
            </ul>
          `;
        }

        if (data.brandsNotFound?.length > 0) {
          htmlContent += `
            <hr style="margin: 10px 0;">
            <p><strong>❌ Marcas no encontradas:</strong></p>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${data.brandsNotFound.map(b => `<li>${b}</li>`).join('')}
            </ul>
          `;
        }

        if (data.suppliersNotFound?.length > 0) {
          htmlContent += `
            <hr style="margin: 10px 0;">
            <p><strong>❌ Proveedores no encontrados:</strong></p>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${data.suppliersNotFound.map(s => `<li>${s}</li>`).join('')}
            </ul>
          `;
        }

        htmlContent += '</div>';

        Swal.fire({
          icon: hasWarnings ? 'warning' : 'success',
          title: hasWarnings ? 'Proceso completado con advertencias' : 'Proceso completado',
          html: htmlContent,
          confirmButtonText: 'Cerrar',
          width: '500px',
        });

        methods.reset();
        setSelectedExcel(null);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo procesar el archivo',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          showConfirmButton: true,
          timer: 2500,
        });
      });
  };
  const activeSelect = (razonSocial) => {
    dispatch(getBrandByRSRequest(razonSocial)).then(() => {
      setSelectStatus(false);
    });
  };
  useEffect(() => {
    dispatch(getSupplierRequest());
  }, []);
  return (
    <>
      {suppliers.loading ? (
        <LoadingSpinner loading={suppliers.loading} />
      ) : (
        <>
          {view !== 'group' ? (
            <AddProductFormComponent
              {...props}
              files={{
                selectedFiles: selectedFiles,
                setSelectedFiles: setSelectedFiles,
              }}
              methods={methods}
              suppliers={suppliers.data}
              brands={brands.data}
              onSubmit={addProduct}
              status={productStatus}
              selectStatus={selectStatus}
              setSelectStatus={activeSelect}
            />
          ) : (
            <AddProductsFormComponent
              {...props}
              checks={checks}
              setChecks={setChecks}
              methods={methods}
              suppliers={suppliers.data}
              brands={brands.data}
              onSubmit={addFileProduct}
              status={productStatus}
              selectStatus={selectStatus}
              setSelectStatus={activeSelect}
              setSelectedFile={setSelectedExcel}
              selectedFile={selectedExcel}
            />
          )}
        </>
      )}
    </>
  );
}

export default AddProductFormContainer;
