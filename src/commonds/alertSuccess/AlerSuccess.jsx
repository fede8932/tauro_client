import React from 'react';
import { Alert } from 'antd';

const AlertSuccess = (props) => {
  const { visible } = props;
  return (
    <Alert
      message={props.text}
      type="success"
      closeIcon={true}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s' }}
    />
  );
};

export default AlertSuccess;
