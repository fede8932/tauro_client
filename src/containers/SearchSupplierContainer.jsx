import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import SearchSupplierComponent from '../components/searchSupplier/SearchSupplierComponent';
import { getSuppliersByTextRequest } from '../redux/searchSupplier';
import { useLocation } from 'react-router-dom';
import SearchRepSupplierComponent from '../components/searchSupplier/SearchRepSupplierComponent';
import { searchRepresentRequest } from '../redux/representativeSearch';

function SearchSupplierContainer(props) {
  const [searchText, setSearchText] = useState('null');
  const { pathname } = useLocation();
  const representantes = useSelector((state) => state.searchRepresentatives);
  const methods = useForm();
  const dispatch = useDispatch();
  const searchSupplier = (text) => {
    setSearchText(text);
    const data = {
      text: text.campo,
      page: 1,
      pageSize: 10,
      orderByColumn: 'id',
    };
    dispatch(getSuppliersByTextRequest(data));
  };
  const changePag = (activePag) => {
    const data = {
      text: searchText,
      page: activePag,
      pageSize: 10,
      orderByColumn: 'id',
    };
    dispatch(getSuppliersByTextRequest(data));
  };
  const dataSupplier = useSelector((state) => state.searchSuppliers);
  useEffect(() => {
    const data = {
      text: 'null',
      page: 1,
      pageSize: 10,
      orderByColumn: 'id',
    };
    dispatch(getSuppliersByTextRequest(data));
    dispatch(searchRepresentRequest({ page: 1 }));
  }, []);
  const resetSearch = () => {
    const data = {
      text: 'null',
      page: 1,
      pageSize: 10,
      orderByColumn: 'id',
    };
    dispatch(getSuppliersByTextRequest(data));
  };
  const searchRep = (page, text) => {
    dispatch(searchRepresentRequest({ page: page, text: text }));
  };

  return (
    <>
      {pathname == '/search/supplier' ? (
        <SearchSupplierComponent
          methods={methods}
          onSubmit={searchSupplier}
          result={dataSupplier}
          changePag={changePag}
          resetSearch={resetSearch}
        />
      ) : (
        <SearchRepSupplierComponent
          methods={methods}
          onSubmit={searchRep}
          result={representantes}
        />
      )}
    </>
  );
}

export default SearchSupplierContainer;
