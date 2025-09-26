import React, { useState } from 'react';
import { Pagination } from 'semantic-ui-react';

const CustomPagination = (props) => {
  const { pages, changeFn, initPage } = props;
  const [activePage, setActivePage] = useState(initPage);
  const onPageChange = (e, d) => {
    // console.log(d);
    setActivePage(d.activePage);
    changeFn(d.activePage);
  };
  return (
    <Pagination
      boundaryRange={0}
      ellipsisItem={null}
      firstItem={null}
      lastItem={null}
      siblingRange={1}
      totalPages={pages}
      activePage={activePage}
      onPageChange={onPageChange}
    />
  );
};

export default CustomPagination;
