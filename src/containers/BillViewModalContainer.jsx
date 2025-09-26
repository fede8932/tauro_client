import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import BillModalViewComponent from '../components/billModalView/BillModalViewComponent';
import { getBillById, resetSelectBill } from '../redux/selectedBill';

function BillViewModalContainer(props) {
  const { movId, ...rest } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (movId) {
      dispatch(getBillById(movId));
    }
    return () => {
      dispatch(resetSelectBill());
    };
  }, []);

  return <BillModalViewComponent {...rest} />;
}

export default BillViewModalContainer;
