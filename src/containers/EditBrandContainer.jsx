import React, { useEffect } from 'react';
import EditBrandComponent from '../components/editBrandComponent/EditBrandComponent';
import { useForm } from 'react-hook-form';
import { getSupplierRequest } from '../redux/supplier';
import { useDispatch, useSelector } from 'react-redux';
import { updateBrandRequest } from '../redux/brand';
import {
  addSupplierToBrandRequest,
  deleteSupplierToBrandRequest,
  getBrandByDataRequest,
} from '../redux/searchBrands';
import { searchBrandsExtraRequest } from '../redux/searchBrandsExtra';
import Swal from 'sweetalert2';

function EditBrandContainer(props) {
  const { brand, closeModal } = props;
  const methods = useForm();
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.supplier);
  const loading = useSelector((state) => state.brand).loading;
  const filterBrands = useSelector((state) => state.filterBrand);

  const editBrand = (data) => {
    data.brandId = brand.id;
    dispatch(updateBrandRequest(data)).then(() => {
      dispatch(searchBrandsExtraRequest(filterBrands));
    });
  };

  const handleAddSupplier = (supplierId) => {
    dispatch(
      addSupplierToBrandRequest({
        brandId: brand.id,
        listSupplierId: [Number(supplierId)],
      })
    ).then((res) => {
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el proveedor',
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      dispatch(searchBrandsExtraRequest(filterBrands));
    });
  };

  const handleDeleteSupplier = (supplierId) => {
    Swal.fire({
      title: '¿Eliminar proveedor?',
      text: 'Se desvinculará este proveedor de la marca',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#673ab7',
      cancelButtonColor: '#999',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteSupplierToBrandRequest({
            brandId: brand.id,
            supplierId: supplierId,
          })
        ).then((res) => {
          if (res.error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar. La marca debe tener al menos un proveedor.',
              timer: 2500,
              showConfirmButton: false,
            });
            return;
          }
          dispatch(searchBrandsExtraRequest(filterBrands));
        });
      }
    });
  };


  useEffect(() => {
    dispatch(getSupplierRequest());
  }, []);

  return (
    <EditBrandComponent
      {...props}
      brand={brand}
      loading={loading}
      methods={methods}
      handleSubmit={editBrand}
      suppliers={suppliers.data}
      onAddSupplier={handleAddSupplier}
      onDeleteSupplier={handleDeleteSupplier}
    />
  );
}

export default EditBrandContainer;
