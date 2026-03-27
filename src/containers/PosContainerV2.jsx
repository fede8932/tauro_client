import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSupplierRequest } from '../redux/supplier';
import { deleteProductRequest } from '../redux/product';
import { searchProductsAndEquivalencesRequest } from '../redux/productEquivalence';
import Swal from 'sweetalert2';
import PosComponentV2 from '../components/posComponent/PosComponentV2';

function PosContainerV2(props) {
  const [text, setText] = useState(null);
  const { data } = useSelector((state) => state.supplier);

  const productEquivalence = useSelector((state) => state.productEquivalence);

  const methods = useForm();
  const dispatch = useDispatch();
  
  // This might be used if there's a global search, but table filters are primary
  const search = (data) => {
    // setText(data.campo);
    // dispatch(searchProductsAndEquivalencesRequest({ page: 1, description: data.campo }));
  };

  const changePage = (page) => {
    // This will be handled in the table component usually, but if passed down:
    // dispatch(searchProductsAndEquivalencesRequest({ ...currentFilters, page: page }));
  };

  const resetSearch = () => {
    // dispatch(searchProductsAndEquivalencesRequest({ page: 1 }));
  };

  const deleteProduct = (id) => {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Vas a eliminar un producto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProductRequest(id))
          .then((res) => {
            if (!res.payload) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No es posible borrar el producto',
              });
              return;
            }
            Swal.fire({
              title: 'Eliminado!',
              text: 'El producto ya no está en los registros',
              icon: 'success',
            });
            // Refresh search?
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrio un error en el servidor',
            });
          });
      }
    });
  };

  useEffect(() => {
    dispatch(getSupplierRequest());
  }, []);

  return (
    <>
      <PosComponentV2
        {...props}
        methods={methods}
        onSubmit={search}
        suppliers={data}
        productEquivalence={productEquivalence}
        changePage={changePage}
        resetSearch={resetSearch}
        deleteProduct={deleteProduct}
      />
    </>
  );
}

export default PosContainerV2;
