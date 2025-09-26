import react, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PermissionDenied from '../../components/permissionDenied/PermissionDenied';
import { useNavigate } from 'react-router';

function ProtectedView(props) {
  const { listAccesss, children } = props; // array con los id de roles permitidos

  const user = useSelector((state) => state.user).data;
  const navigate = useNavigate();

  const checkPermis = () => {
    return listAccesss.includes(user.rolId);
  };

  useEffect(() => {
    if (!listAccesss.includes(user.rolId)) {
      switch (user.rolId) {
        case 2:
          navigate('/search/product');
          break;
        case 5:
          navigate('/search/product');
          break;
        case 6:
          navigate('/search/sell');
          break;
        case 7:
          navigate('/control/orden');
          break;
      }
    }
  }, [user]);

  return <>{checkPermis() ? children : <PermissionDenied />}</>;
}

export default ProtectedView;
