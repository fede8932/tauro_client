import react from 'react';
import { useSelector } from 'react-redux';

function ProtectedComponent(props) {
  const { listAccesss, children } = props; // array con los id de roles permitidos

  const user = useSelector((state) => state.user).data;

  const checkPermis = () => {
    return listAccesss.includes(user.rolId);
  };

  return <>{checkPermis() ? children : null}</>;
}

export default ProtectedComponent;
