import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import BrandSaleComponent from '../components/brandSale/BrandSaleComponent';
import {
  changePrioriSaleRequest,
  deleteSaleRequest,
  getBrandByIdRequest,
  newSaleRequest,
  resetSelectBrand,
  toggleStatusSaleRequest,
} from '../redux/searchBrandsExtra';
import { useForm } from 'react-hook-form';

function BrandSaleContainer(props) {
  const dispatch = useDispatch();

  const { pathname } = useLocation();
  const id = Number(pathname.split('/')[3]);
  const methods = useForm();
  const [intervalSale, setIntervalSale] = useState({ init: null, end: null });

  console.log(intervalSale)

  const newSale = (data) => {
    const sendData = { ...data };
    sendData.percentage = Number(data.percentage) / 100;
    sendData.minUnit = Number(data.minUnit);
    sendData.saleType = 0;
    sendData.brandId = id;
    sendData.init = intervalSale.init;
    sendData.end = intervalSale.end;
    dispatch(newSaleRequest(sendData)).then((res) => {
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No es posible guardar la oferta: ${res.error.message}`,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
        return;
      }
      methods.reset();
      setIntervalSale({ init: null, end: null });
    });
  };

  const deleterSale = (id) => {
    dispatch(deleteSaleRequest(id)).then((res) => {
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No es posible eliminar la oferta: ${res.error.message}`,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
        return;
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Oferta eliminada',
        showConfirmButton: false,
        timer: 1000,
      });
    });
  };

  const toogleStatusSale = (id) => {
    dispatch(toggleStatusSaleRequest(id));
  };

  const changePriori = (id, mode) => {
    dispatch(changePrioriSaleRequest({ id: id, mode: mode }));
  };

  useEffect(() => {
    dispatch(getBrandByIdRequest(id));
    return () => dispatch(resetSelectBrand());
  }, []);

  return (
    <BrandSaleComponent
      setIntervalSale={setIntervalSale}
      intervalSale={intervalSale}
      methods={methods}
      newSale={newSale}
      deleterSale={deleterSale}
      toogleStatusSale={toogleStatusSale}
      changePriori={changePriori}
    />
  );
}

export default BrandSaleContainer;
