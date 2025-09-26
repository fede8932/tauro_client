import React from 'react';
import { Descriptions } from 'antd';
import { camelCaseToText } from '../../utils';
// const items = [
//   {
//     key: '1',
//     label: 'UserName',
//     children: 'Zhou Maomao',
//   },
// ];
const Description = (props) => {
  const { infoProv } = props;
  const orderInfoProv = {
    razonSocial: infoProv.razonSocial,
    cuit: infoProv.cuit,
    status: infoProv.status,
    currentAcount: infoProv.id ? infoProv.currentAcount.resume : '',
    calle: infoProv.calle,
    altura: infoProv.altura,
    codigoPostal: infoProv.codigoPostal,
    localidad: infoProv.localidad,
    email: infoProv.email,
    telefono: infoProv.telefono,
    comentarios: infoProv.comentarios,
  };
  const items = [];
  let key = 1;
  for (let prop in orderInfoProv) {
    let children;
    if (prop == 'status' && infoProv.id) {
      children = orderInfoProv[prop] ? (
        <span style={{ color: 'green' }}>Activo</span>
      ) : (
        <span style={{ color: 'red' }}>Inactivo</span>
      );
    } else {
      children = orderInfoProv[prop];
    }
    items.push({
      key: key,
      label: camelCaseToText(prop),
      children: children,
    });
    key++;
  }
  return (
    <>
      {infoProv.id ? (
        <Descriptions title="Información general" bordered items={items} />
      ) : null}
    </>
  );
};
export default Description;
