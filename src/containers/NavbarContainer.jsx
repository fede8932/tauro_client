import React from 'react';
import NavbarComponent from '../components/navbar/NavbarComponent';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/sidebar';
import { logOutCookiesRequest } from '../request/userRequest';
import { useNavigate, useNavigationType } from 'react-router';

function NavbarContainer() {
  const navigate = useNavigate()
  const navigationType = useNavigationType();
  const dispatch = useDispatch();
  const arrayButtons = [
    {
      text: 'Perfil',
      fn: () => {
        console.log('ok');
      },
    },
    {
      text: 'Cerrar Sesión',
      fn: () => {
        logOut();
      },
    },
  ];

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };
  const logOut = () => {
    logOutCookiesRequest().then(() => {
      window.location.reload();
    });
    // const userId = JSON.parse(localStorage.getItem('user')).userId;
    // dispatch(sendLogoutRequest(userId));
  };

  const atrasFn = () => {
    if (navigationType === 'POP') {
      // No hay historial de navegación válido, redirige a una ruta de fallback
      navigate('/search/product');
    } else {
      // Vuelve a la página anterior si hay historial
      navigate(-1);
    }
  }

  return (
    <NavbarComponent
      fnSidebar={handleToggleSidebar}
      atrasFn={atrasFn}
      arrayButtons={arrayButtons}
    />
  );
}

export default NavbarContainer;
