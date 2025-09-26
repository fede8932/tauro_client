import React from 'react';
import LoginComponent from '../components/login/LoginComponent';
import { useDispatch, useSelector } from 'react-redux';
import { sendLoginRequest } from '../redux/user';

function LoginContainer() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fnLogin = (data, event) => {
    const { email, password } = data;
    event.preventDefault();
    dispatch(sendLoginRequest({ email, password }))
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.payload));
      })
      .catch((err) => console.log(err));
  };
  return <LoginComponent onSubmit={fnLogin} user={user} />;
}

export default LoginContainer;
