import React, { useEffect } from 'react';
import ActionModalComponent from '../components/actionModal/ActionModalComponent';
import { useSelector } from 'react-redux';

function ActionModalContainer(props) {
  // console.log("VER PROPS => ", props);
  const { images } = props;
  // console.log("VER ING => ", images);
  const extProps = { ...props };
  extProps.disabled = images?.length < 1;
  extProps.iconColor = images?.length < 1 ? 'iconStyleGrey' : null;
  return <ActionModalComponent {...extProps} />;
}

export default ActionModalContainer;
