import React from 'react';
import { DatePicker, Space } from 'antd';
// const onChange = (date, dateString) => {
//   console.log(date, dateString);
// };
const DataPicker = (props) => {
  const { className, onChange } = props;
  return (
    <Space direction="vertical">
      <DatePicker onChange={onChange} className={className} size="large" />
    </Space>
  );
};
export default DataPicker;
