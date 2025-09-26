import React, { useEffect, useRef, useState } from 'react';
import SearchClientComponent from '../components/searchClient/SearchClientComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getClientssByTextRequest } from '../redux/searchClient';
import { useLocation, useNavigate } from 'react-router';
import { getClientIdRequest, resetClientState } from '../redux/client';

function SearchClientContainer(props) {
  const location = useLocation();
  const [sellerId, setSellerId] = useState(
    location.pathname.split('/').filter(Boolean).pop()
  );
  const [color, setColor] = useState('todos');
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [onlyActive, setOnlyActive] = useState(true);
  // console.log(sellerId);

  const changeInputValue = (value) => {
    setPage(1);
    setInputValue(value);
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const result = useSelector((state) => state.searchClients);

  const changePage = (page) => {
    console.log(page)
    setPage(page);
  };

  const redirectEditPercents = (clientId) => {
    dispatch(getClientIdRequest(clientId)).then(() => {
      navigate(`/edit/client/${clientId}`);
    });
  };

  const handleReset = () => {
    setInputValue('');
    setColor('todos');
    setOnlyActive(true);
  };

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (inputValue.trim() !== null) {
        // console.log('Buscando:', inputValue); // Aquí va tu lógica de búsqueda
        const data = {
          text: inputValue,
          color: color,
          page: page,
          pageSize: 10,
          orderByColumn: 'id',
          sellerId: isNaN(Number(sellerId)) ? null : sellerId,
          active: onlyActive,
        };
        dispatch(getClientssByTextRequest(data));
      }
    }, 800); // Espera 800 ms después de dejar de tipear
  }, [inputValue, color, page, onlyActive]);

  useEffect(() => {
    return () => {
      dispatch(resetClientState());
    };
  }, [sellerId]);

  return (
    <SearchClientComponent
      sellerId={isNaN(Number(sellerId)) ? null : sellerId}
      result={result}
      redirectEditPercents={redirectEditPercents}
      changePageFn={changePage}
      color={color}
      setColor={setColor}
      inputValue={inputValue}
      setInputValue={changeInputValue}
      handleReset={handleReset}
      onlyActive={onlyActive}
      setOnlyActive={setOnlyActive}
    />
  );
}

export default SearchClientContainer;
