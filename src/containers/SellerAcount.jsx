import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import SellerAcountComponent from '../components/sellerAcount/SellerAcountComponent';

function SellerAcountContainer(props) {
  const resume = useSelector((state) => state.sellerResume);
  return (
    <SellerAcountComponent
      resumeSeller={resume.data}
      loading={resume.loading}
      {...props}
    />
  );
}

export default SellerAcountContainer;
