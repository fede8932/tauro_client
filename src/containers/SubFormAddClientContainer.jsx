import React, { useEffect } from 'react';
import SubFormAddClientComponent from '../components/subFormAddClientComponent/SubFormAddClient';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBrandToTable,
  delBrandToTable,
  getBrandToTable,
} from '../redux/tableItems';
import { getBrandRequest } from '../redux/brand';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';

function SubFormAddClientContainer(props) {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const methods = useForm();
  const tItems = useSelector((state) => state.tableItems.data);
  const client = useSelector((state) => state.client.data);
  const id =
    pathname.split('/')[1] == 'edit' ? pathname.split('/')[3] : client?.id;
  const addBrand = (data) => {
    data.porcentaje = parseFloat(data.porcentaje) / 100;
    data.brandId = parseFloat(data.brandId);
    data.clientId = id;
    if (data.brandId == 0) {
      Swal.fire({
        title: 'Estas seguro?',
        text: 'Vas a reemplazar todas las configuraciones actuales para este cliente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        if (result.isConfirmed) {
          methods.reset();
          dispatch(addBrandToTable(data));
          return;
        }
      });
    } else {
      methods.reset();
      dispatch(addBrandToTable(data));
    }
  };
  const delBrand = (brandId, clientId) => {
    const ids = { brandId: brandId, clientId: id };
    dispatch(delBrandToTable(ids));
  };

  useEffect(() => {
    dispatch(getBrandRequest());
    dispatch(getBrandToTable(id));
  }, [client]);
  return (
    <SubFormAddClientComponent
      delFn={delBrand}
      methods={methods}
      onSubmitBrand={addBrand}
      tableItems={tItems}
    />
  );
}

export default SubFormAddClientContainer;
