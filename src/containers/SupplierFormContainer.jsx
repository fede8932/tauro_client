import React, { useEffect, useState } from 'react';
import SupplierFormCmponent from '../components/supplierForm/SupplierFormComponent';
import { useDispatch, useSelector } from 'react-redux';
import { supplierCreateRequest } from '../redux/supplier';
import { getBrandRequest } from '../redux/brand';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

function SupplierFormContainer(props) {
  const createSupplierStatus = useSelector((state) => state.supplier.loading);
  const brands = useSelector((state) => state.brand.data);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const methods = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrandRequest());
  }, []);

  const addSupplier = (data) => {
    data.brandIds = selectedBrands;
    dispatch(supplierCreateRequest(data))
      .then((res) => {
        console.log('Registrado', res);
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
        Swal.fire({
          icon: 'success',
          title: 'Registrado con éxito',
          showConfirmButton: false,
          timer: 1000,
        });
        methods.reset();
        setSelectedBrands([]);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo registrar',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          showConfirmButton: false,
          timer: 2500,
        });
      });
  };
  return (
    <SupplierFormCmponent
      {...props}
      onSubmit={addSupplier}
      status={createSupplierStatus}
      methods={methods}
      brands={brands}
      selectedBrands={selectedBrands}
      setSelectedBrands={setSelectedBrands}
    />
  );
}

export default SupplierFormContainer;
