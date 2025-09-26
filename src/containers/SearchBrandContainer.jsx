import React, { useEffect } from 'react';
import SearchBrandComponent from '../components/searchBrandComponent/SearchBrandComponent';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBrandByDataRequest,
} from '../redux/searchBrands';

function SearchBrandContainer(props) {
  const filterBrand = useSelector((state) => state.searchBrand);
  const dispatch = useDispatch();
  const methods = useForm();
  const searchBrand = (data) => {
    dispatch(getBrandByDataRequest(data.brandCode));
  };
  const resetSearch = () => {
    dispatch(getBrandByDataRequest(null));
  };

  useEffect(() => {
    dispatch(getBrandByDataRequest(null));
  }, []);
  return (
    <SearchBrandComponent
      {...props}
      methods={methods}
      onSubmit={searchBrand}
      brands={filterBrand.data}
      status={filterBrand.loading}
      resetSearch={resetSearch}
    />
  );
}

export default SearchBrandContainer;
