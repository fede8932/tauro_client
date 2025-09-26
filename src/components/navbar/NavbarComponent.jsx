import React, { useState } from 'react';
import styles from './navbar.module.css';
import logo from '../../assets/logo/logo.png';
import CustomButton from '../../commonds/button/CustomButton';
import CustomSearch from '../../commonds/search/CustomSearch';
import NewMenu from '../../commonds/newMenu/NewMenu';
import { useDispatch, useSelector } from 'react-redux';
import { sendLogoutRequest } from '../../redux/user';
import { logOutCookiesRequest } from '../../request/userRequest';

function NavbarComponent(props) {
  const { fnSidebar, atrasFn } = props;
  const Rol = {
    1: 'System',
    2: 'Admin',
    3: 'Vendedor',
    4: 'Cliente',
    5: 'Encargado',
    6: 'Contador',
    7: 'Operario',
  };
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user).data;
  console.log(user);
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.titleLogo}>
        <div>
          <div style={{ position: 'relative' }}>
            <img className={styles.logo} src={logo} alt="Logo" />
            <h1 className={styles.title}>Ad panel</h1>
          </div>
          <span className={styles.userInfo}>
            {`<${
              Rol[user.rolId]
            }> ${user.name.toUpperCase()} ${user.lastName.toUpperCase()}`.substring(
              0,
              28
            )}
          </span>
        </div>
        <CustomButton
          props={{
            buttonStyle: 'menuButton',
            icon: 'fa-solid fa-bars',
            iconStyle: 'menuIconVio',
            iconHoverStyle: 'menuIconBla',
            fnSidebar: fnSidebar,
          }}
        />
      </div>
      <div style={{marginLeft: "10px"}}>
        <CustomButton
          props={{
            buttonStyle: 'menuButton',
            icon: 'fa-solid fa-arrow-left',
            iconStyle: 'menuIconVio',
            iconHoverStyle: 'menuIconBla',
            fnSidebar: atrasFn,
          }}
        />
      </div>
      <div className={styles.barContainer}>
        <div style={{ display: 'flex', width: '950px', alignItems: 'center' }}>
          <CustomSearch />
        </div>
        <div className={styles.perfilContainer}>
          <CustomButton
            props={{
              buttonStyle: 'menuButton',
              icon: 'fa-regular fa-bell',
              iconStyle: 'menuIconVio',
              iconHoverStyle: 'menuIconBla',
            }}
          />
          <NewMenu
            direction="left"
            perfilFn={() => {
              console.log('no hay fn');
            }}
            logOutFn={() => {
              logOutCookiesRequest().then(() => {
                window.location.reload();
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default NavbarComponent;
