import React, { useEffect } from 'react';
import EditBrandComponent from '../components/editBrandComponent/EditBrandComponent';
import { useForm } from 'react-hook-form';
import { getSupplierRequest } from '../redux/supplier';
import { useDispatch, useSelector } from 'react-redux';
import { updateBrandRequest } from '../redux/brand';
import { getBrandByDataRequest } from '../redux/searchBrands';

function EditBrandContainer(props) {
  // console.log(props);
  const { brand, closeModal } = props;
  // console.log(brand)
  const methods = useForm();
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.supplier);
  const loading = useSelector((state) => state.brand).loading;
  const editBrand = (data) => {
    data.brandId = brand.id;
    dispatch(updateBrandRequest(data)).then(() => {
      dispatch(getBrandByDataRequest(null));
      closeModal();
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
    />
  );
}

export default EditBrandContainer;
