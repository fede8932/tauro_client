import React, { useEffect, useState } from 'react';
import SearchSellerComponent from '../components/searchSeller/SearchSellerComponent';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSellersByTextRequest } from '../redux/searchSeller';
import { getPendingBySellerReq } from '../request/movNoApplyRequest';
import { clienteReportBySeller } from '../templates/clienteReportBySeller';

function SearchSellerContainer(props) {
  const methods = useForm();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [text, setText] = useState(null);
  const [onlyActive, setOnlyActive] = useState(true);

  const searchSeller = (data) => {
    setText(data.text);
    setPage(1)
  };
  const result = useSelector((state) => state.searchSellers);

  useEffect(() => {
    let data = {
      text: text,
      by: 'cuil',
      page: page,
      pageSize: 1000,
      orderByColumn: 'id',
      active: onlyActive,
    };
    if (text) {
      const carcterInicial = parseInt(text?.substring(0, 1), 10);
      if (isNaN(carcterInicial)) {
        data.by = 'name';
      } else {
        data.by = 'cuil';
      }
    }
    dispatch(getSellersByTextRequest(data));
  }, [page, text, onlyActive]);

  const resetSearch = () => {
    const data = {
      text: 'null',
      by: 'cuil',
      page: 1,
      pageSize: 1000,
      orderByColumn: 'id',
      active: true,
    };
    dispatch(getSellersByTextRequest(data));
    setOnlyActive(true);
  };

  const clientsResumePrint = async (sellerId) => {
    try {
      const { cuil, user, clients } = await getPendingBySellerReq(sellerId);
      // console.log(cuil, user, clients);

      const render = await clienteReportBySeller(
        cuil,
        user.name,
        user.lastName,
        clients
      );

      const nuevaVentana = window.open('', '', 'width=900,height=1250');
      const containerFact = nuevaVentana.document.createElement('div');
      nuevaVentana.document.body.appendChild(containerFact);

      containerFact.innerHTML = render;
    } catch (err) {
      throw err;
    } finally {
    }
  };

  const changePage = (p) => {
    setPage(p);
  };

  return (
    <SearchSellerComponent
      methods={methods}
      onSubmit={searchSeller}
      result={result}
      resetSearch={resetSearch}
      clientsResumePrint={clientsResumePrint}
      changePage={changePage}
      onlyActive={onlyActive}
      setOnlyActive={setOnlyActive}
    />
  );
}

export default SearchSellerContainer;
