import React from 'react';
import { useSelector } from 'react-redux';
import SellerLiquidationComponent from '../components/sellerLiquidation/SellerLiquidationComponent';

function SellerLiquidationContainer(props) {
  const resume = useSelector((state) => state.sellerResume);
  return (
    <SellerLiquidationComponent
      resumeSeller={resume.data}
      loading={resume.loading}
      {...props}
    />
  );
}

export default SellerLiquidationContainer;
