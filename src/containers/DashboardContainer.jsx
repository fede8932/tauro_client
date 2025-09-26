import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';

function DashboardContainer(props) {
  const { ...rest } = props;
  return <Dashboard {...rest} />;
}

export default DashboardContainer;
