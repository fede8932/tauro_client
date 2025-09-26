import React, { useEffect } from 'react';
import AddClientComponent from '../components/addClient/AddClientComponent';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { clientCreateRequest } from '../redux/client';
import { getSellersRequest } from '../redux/seller';
import { getBrandRequest } from '../redux/brand';
import { resetBrandToTable } from '../redux/tableItems';
import LoadingSpinner from '../commonds/loading/LoadingSpinner';
import { message } from 'antd';
import { useNavigate } from 'react-router';

function AddClientContainer(props) {
  const { nextFn, type } = props;
  const navigate = useNavigate();
  const createClientStatus = useSelector((state) => state.client.loading);
  const { rolId } = useSelector((state) => state.user.data);
  // console.log(rolId);
  const sellers = useSelector((state) => state.seller);
  const methods = useForm();
  const dispatch = useDispatch();
  const addClient = (data) => {
    dispatch(clientCreateRequest(data)).then((res) => {
      if (res?.error?.message) {
        message.error(res?.error?.message);
        navigate('/search/client');
        return;
      }
      type == 'client' ? message.success('Cliente registrado!') : null;
      methods.reset();
      dispatch(resetBrandToTable()).then(() => {
        if (rolId != 1 && rolId != 2 && rolId != 5) {
          navigate('/search/client');
        }
      });
      nextFn(1);
    });
  };
  useEffect(() => {
    dispatch(getSellersRequest());
    dispatch(getBrandRequest());
  }, []);
  return (
    <>
      {sellers.loading ? (
        <LoadingSpinner loading={sellers.loading} />
      ) : (
        <AddClientComponent
          {...props}
          onSubmit={addClient}
          status={createClientStatus}
          methods={methods}
          sellers={sellers.data}
        />
      )}
    </>
  );
}

export default AddClientContainer;
