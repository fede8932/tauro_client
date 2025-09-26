import React from 'react';
import PickingTable from '../tables/pickingTable/PickingTable';

function SearchPickingOrderComponent(props) {
  const { printFn, updatePicking } = props;
  return (
    <div style={{ marginTop: '40px' }}>
      <PickingTable updatePicking={updatePicking} printFn={printFn} />
    </div>
  );
}

export default SearchPickingOrderComponent;
