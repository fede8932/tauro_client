import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import EditClientViewComponent from '../components/editClientView/EditClientViewComponent';
import { getSellersRequest } from '../redux/seller';
import { UpdateClientsRequest } from '../redux/searchClient';
import { getClientIdRequest, resetAllClientRequest } from '../redux/client';

function EditClientViewContainer(props) {
  const { client, close, clientId } = props;
  // console.log(client);
  // const { loading } = useSelector((state) => state.searchClients);

  const { data, loading } = useSelector((state) => state.client);

  const sendClient = data;

  const sellers = useSelector((state) => state.seller);

  // console.log(sellers)
  const methods = useForm();
  const dispatch = useDispatch();
  const updateClient = (data) => {
    const { iva, sellerId, ...clientData } = data;
    clientData.acceptPending = sendClient.acceptPending;
    clientData.hasSale = sendClient.hasSale;
    clientData.allowPasswordChange = sendClient.user.allowPasswordChange;
    clientData.iva = iva != '' ? iva : sendClient.iva;
    clientData.sellerId =
      sellerId != '' ? Number(sellerId) : sendClient.sellerId;
    clientData.altura = Number(clientData.altura);
    clientData.codigoPostal = Number(clientData.codigoPostal);
    clientData.id = clientId ? clientId : client.id;
    clientData.comitionSale = sendClient.comitionSale;


    dispatch(UpdateClientsRequest(clientData)).then((res) => {
      // console.log(clientData);
      // console.log(res);
      close();
    });
  };
  useEffect(() => {
    dispatch(getSellersRequest());
    dispatch(getClientIdRequest(client.id ?? clientId));
    return () => {
      dispatch(resetAllClientRequest());
    };
  }, []);
  return (
    <EditClientViewComponent
      {...props}
      client={sendClient}
      sellers={sellers.data}
      update={updateClient}
      methods={methods}
      loading={loading}
    />
  );
}

export default EditClientViewContainer;
