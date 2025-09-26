import React, { useState } from 'react';
import styles from './customMenu.module.css';
import avatar from '../../assets/avatars/hombre.png';

function CustomMenu(props) {
  const [classIcon, setClassIcon] = useState('configIconBlue');
  const [classConfigContainer, setClassConfigContainer] = useState(
    'configContainerWhite'
  );

  return (
    <div>
      <div
        onMouseOver={() => {
          setClassIcon('configIconWhite');
          setClassConfigContainer('configContainerBlue');
        }}
        onMouseOut={() => {
          setClassIcon('configIconBlue');
          setClassConfigContainer('configContainerWhite');
        }}
        className={`${styles[classConfigContainer]}`}
      >
        <div className={styles.avatarContainer}>
          <img
            src={avatar}
            alt="Avatar de usuario"
            style={{ heigth: '25px', width: '25px' }}
          />
        </div>
        <div>
          <i className={`${styles[classIcon]} fa-solid fa-gear`}></i>
        </div>
      </div>
    </div>
  );
}

export default CustomMenu;
