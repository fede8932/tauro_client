import React, { useEffect } from 'react';
import AddBrandComponent from '../components/addBrand/AddBrandComponent';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSupplierRequest } from '../redux/supplier';
import { brandCreateRequest } from '../redux/brand';
import Swal from 'sweetalert2';
import LoadingSpinner from '../commonds/loading/LoadingSpinner';

function AddBrandContainer(props) {
  const suppliers = useSelector((state) => state.supplier);
  const { loading } = useSelector((state) => state.brand);
  const dispatch = useDispatch();
  const methods = useForm();
  const addBrand = (data) => {
    dispatch(brandCreateRequest(data))
      .then((res) => {
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
          icon: 'success',
          title: 'Registrado con éxito',
          showConfirmButton: false,
          timer: 1000,
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
  useEffect(() => {
    dispatch(getSupplierRequest());
  }, []);
  return (
    <>
      {suppliers.loading ? (
        <LoadingSpinner loading={suppliers.loading} />
      ) : (
        <AddBrandComponent
          methods={methods}
          onSubmit={addBrand}
          {...props}
          suppliers={suppliers.data}
          status={loading}
        />
      )}
    </>
  );
}

export default AddBrandContainer;
