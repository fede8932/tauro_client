import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchCurrentAcount from '../components/searchCurrentAcount/SearchCurrentAcount';
import {
  marcMovementsByCurrentAcountId,
} from '../redux/searchCurrentAcount';
import { useLocation } from 'react-router';
import {
  resetFilterMovements,
  setFilterMovements,
} from '../redux/filtersMovements';

function SearchCurrentAcountContainer(props) {
  const [filterCheck, setFilterCheck] = useState({
    facturas: true,
    pagos: true,
    notasCredito: true,
    devoluciones: true,
    descuentos: true,
    notasDebito: true,
  });
  // console.log(filterCheck);
  const changeFilter = (prop) => {
    let newStatus = { ...filterCheck };
    newStatus[prop] = !newStatus[prop];
    setFilterCheck(newStatus);
  };
  const dispatch = useDispatch();

  const location = useLocation();
  const currentPath = location.pathname;
  const pathSegments = currentPath.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  const accountId = parseInt(lastSegment, 10);

  const checkToggle = (mov) => {
    dispatch(marcMovementsByCurrentAcountId(mov.id));
  };

  // useEffect(() => {
  //   dispatch(getAcountById(accountId)).catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    dispatch(setFilterMovements({ name: 'currentAcountId', value: accountId }));
    return () => {
      dispatch(resetFilterMovements(null));
    };
  }, []);

  return (
    <SearchCurrentAcount
      filterCheck={filterCheck}
      changeFilter={changeFilter}
      checked={checkToggle}
    />
  );
}

export default SearchCurrentAcountContainer;
