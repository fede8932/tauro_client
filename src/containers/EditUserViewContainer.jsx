import React, { useEffect } from 'react';
import EditUserViewComponent from '../components/editUserView/EditUserViewComponent';
import { useForm } from 'react-hook-form';
import { UpdateSellersRequest } from '../redux/searchSeller';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerIdRequest, resetSellerStatus } from '../redux/seller';

function EditUserViewContainer(props) {
  const { seller, close, sellerId } = props;
  const { loading } = useSelector((state) => state.searchSellers);

  const useSeller = sellerId
    ? useSelector((state) => state.seller.data)[0]
    : seller;
  const methods = useForm();
  const dispatch = useDispatch();
  const updateSeller = (data) => {
    const { ...sellerData } = data;
    sellerData.altura = Number(sellerData.altura);
    sellerData.codigoPostal = Number(sellerData.codigoPostal);
    sellerData.comisionBase = Number(sellerData.comisionBase) / 100;
    sellerData.comisionOferta = Number(sellerData.comisionOferta) / 100;
    sellerData.id = useSeller?.id;
    dispatch(UpdateSellersRequest(sellerData)).then(() => {
      close();
    });
  };

  useEffect(() => {
    dispatch(getSellerIdRequest(seller.id ?? sellerId));
    return () => {
      dispatch(resetSellerStatus());
    };
  }, []);

  return (
    <EditUserViewComponent
      {...props}
      seller={useSeller}
      update={updateSeller}
      methods={methods}
      loading={loading}
    />
  );
}

export default EditUserViewContainer;
