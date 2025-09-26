import React from 'react';
import NewBill from '../components/newBill/NewBill';
import { useSelector } from 'react-redux';

function NewBillContainer(props) {
  return <NewBill {...props}/>;
}

export default NewBillContainer;
