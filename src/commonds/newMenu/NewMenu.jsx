import React from 'react';
import {
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  Dropdown,
} from 'semantic-ui-react';
import CustomMenu from '../menu/CustomMenu';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
const redirect_url = import.meta.env.VITE_REDIRECT_URL;
const entorno = import.meta.env.VITE_ENTORNO;

function NewMenu(props) {
  const { logOutFn, perfilFn, ...rest } = props;

  const redirectToGoogle = (url) => {
    window.location.href = url ?? redirect_url;
  };
  return (
    <Dropdown text="File" trigger={<CustomMenu />} icon={null} {...rest}>
      <DropdownMenu>
        <DropdownItem
          text="Perfil"
          onClick={() => {
            perfilFn();
          }}
        />
        <DropdownDivider />
        {entorno !== 'BLASE' ? (
          <ProtectedComponent listAccesss={[1]}>
            <DropdownItem
              text="Ir a Blase"
              onClick={() =>
                redirectToGoogle('https://admin.blasedistribuidora.com')
              }
            />
          </ProtectedComponent>
        ) : null}
        {entorno !== 'DIFRANI' ? (
          <ProtectedComponent listAccesss={[1]}>
            <DropdownItem
              text="Ir a Difrani"
              onClick={() => redirectToGoogle('https://system.difrani.com')}
            />
          </ProtectedComponent>
        ) : null}
        {entorno !== 'ALOSPITS' ? (
          <ProtectedComponent listAccesss={[1]}>
            <DropdownItem
              text="Ir a Alospits"
              onClick={() => redirectToGoogle('https://admin.alospits.com')}
            />
          </ProtectedComponent>
        ) : null}
        <DropdownItem text="Cerrar sesión" onClick={() => logOutFn()} />
      </DropdownMenu>
    </Dropdown>
  );
}
export default NewMenu;
