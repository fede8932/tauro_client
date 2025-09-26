import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

const options = [
  { key: 1, text: 'San Jorge', value: 1 },
  { key: 2, text: 'Blase', value: 2 },
];

const CustomDropdown = () => (
  <div style={{ marginLeft: '25px' }}>
    <Menu compact>
      <Dropdown text="Sucursal" options={options} simple item />
    </Menu>
  </div>
);

export default CustomDropdown;
