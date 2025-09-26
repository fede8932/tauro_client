import React from 'react';
import { Button, Steps } from 'antd';

const CustomStep = (props) => {
  const { steps, view } = props;
  // const next = () => {
  //   setCurrent(current + 1);
  // };
  // const prev = () => {
  //   setCurrent(current - 1);
  // };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <>
      <Steps current={view} items={items} style={{ width: '60%' }} />
    </>
  );
};
export default CustomStep;
