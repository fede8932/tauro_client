import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import OtherFormComponent from '../components/otherFormComponent/OtherFormComponent';
import { createOtherUsersRequest } from '../redux/otherUsers';

function OtherFormContainer(props) {
  const createUser = useSelector((state) => state.otherUsers.loading);
  const methods = useForm();
  const dispatch = useDispatch();
  const addUser = (data) => {
    dispatch(createOtherUsersRequest(data))
      .then((res) => {
        if (res.error) {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo guardar tu registro',
            icon: 'error',
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 2500,
          });
          return;
        }
        Swal.fire({
          icon: 'success',
          title: 'Registrado con éxito',
          showConfirmButton: false,
          timer: 1000,
        });
        methods.reset();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo registrar',
          icon: 'error',
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
      });
  };
  return (
    <OtherFormComponent
      {...props}
      onSubmit={addUser}
      methods={methods}
      status={createUser}
    />
  );
}

export default OtherFormContainer;
