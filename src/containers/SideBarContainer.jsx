import React from 'react';
import SideBarComponent from '../components/sidebar/SidebarComponent';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function SideBarContainer() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const newSellNotif = useSelector((state) => state.newSellNotific);
  const notific = { newSell: newSellNotif };
  const navigate = useNavigate();
  return (
    <SideBarComponent status={isOpen} fnNavigate={navigate} notific={notific} />
  );
}

export default SideBarContainer;
