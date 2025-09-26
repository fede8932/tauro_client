import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddSupplierToBrand from '../components/addSupplierToBrand/AddSupplierToBrand';
import { getSuppliersInfoRequest } from '../redux/supplier';
import LoadingSpinner from '../commonds/loading/LoadingSpinner';
import {
  addSupplierToBrandRequest,
  deleteSupplierToBrandRequest,
} from '../redux/searchBrands';

function AddSupplierToBrandContainer(props) {
  const { close, brands, index } = props;
  const brand = brands[index];
  const suppliers = useSelector((state) => state.supplier);
  const dispatch = useDispatch();
  const addSuppliers = (data) => {
    const trueProperties = [];
    for (const key in data) {
      if (data[key] === true) {
        trueProperties.push(Number(key));
      }
    }
    const sendInfo = {
      brandId: brand.id,
      listSupplierId: trueProperties,
    };
    dispatch(addSupplierToBrandRequest(sendInfo));
    // close();
  };
  const deleteSupplier = (data) => {
    dispatch(deleteSupplierToBrandRequest(data));
    // close();
  };
  useEffect(() => {
    dispatch(getSuppliersInfoRequest());
  }, []);
  return (
    <>
      {suppliers.loading ? (
        <LoadingSpinner />
      ) : (
        <AddSupplierToBrand
          {...props}
          brand={brand}
          addSuppliers={addSuppliers}
          deleteSupplier={deleteSupplier}
          suppliers={suppliers}
        />
      )}
    </>
  );
}

export default AddSupplierToBrandContainer;
