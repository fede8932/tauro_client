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
    // console.log(selectedExcel);
    // console.log(checks);
    dispatch(productsFileCreateRequest({ file: selectedExcel, check: checks }))
      .then((res) => {
        // console.log(res);
        const brands = res.payload.blackList.join(' ');
        if (res.error) {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo guardar tu registro',
            icon: 'error',
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 2500,
          });
          return;
        }
        Swal.fire({
          icon: res.payload.blackList.length > 0 ? 'warning' : 'success',
          title:
            res.payload.blackList.length > 0
              ? `Hay marcas no registradas:`
              : 'Registrado con éxito',
          text: `${
            res.payload.blackList.length > 0
              ? `No registrado: ${brands} - `
              : ''
          } Actualizados: ${res.payload.update} - Agregados: ${
            res.payload.add
          }`,
          showConfirmButton: false,
          // timer: 1950,
        });
        methods.reset();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo registrar',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          showConfirmButton: false, // Oculta el botón "OK"
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
