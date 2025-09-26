import React from 'react';
import styles from './changePass.module.css';
import { Divider } from 'semantic-ui-react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomInput from '../../commonds/input/CustomInput';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { changeUserPass } from '../../request/userRequest';

function ChangePass() {
  const methods = useForm();
  const save = (data) => {
    const { actualPass, newPass, newPassw } = data;
    if (newPass != newPassw) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'El password se debe ingresar dos veces y debe coincidir.',
        showConfirmButton: false, // Oculta el botón "OK"
        timer: 2500,
      });
      return;
    }
    if (newPass.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'El password debe tener al menos 8 dígitos',
        showConfirmButton: false, // Oculta el botón "OK"
        timer: 2500,
      });
      return;
    }
    changeUserPass({ password: actualPass, newPassword: newPass })
      .then((res) => {
        if (res.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: `Error: ${res.error.message}`,
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 2500,
          });
          return;
        }
        Swal.fire({
          title: 'Actualizado',
          icon: 'success',
          draggable: true,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: `Error Interno: ${err.message}`,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
      });
  };

  return (
    <div className={styles.changePassForm}>
      <FormProvider {...methods}>
        <form>
          <div>
            <label>Contraseña actual</label>
            <CustomInput
              name="actualPass"
              type="password"
              width="medium"
              placeholder="Ingrese tu contraseña"
              icon="fa-solid fa-key"
              validate={{ required: true }}
            />
          </div>
          <div>
            <label>Nueva contraseña</label>
            <CustomInput
              name="newPass"
              type="password"
              width="medium"
              placeholder="Ingrese la nueva contraseña"
              icon="fa-solid fa-key"
              validate={{ required: true }}
            />
          </div>
          <div>
            <label>Nueva contraseña</label>
            <CustomInput
              name="newPassw"
              type="password"
              width="medium"
              placeholder="Repita la nueva contraseña"
              icon="fa-solid fa-key"
              validate={{ required: true }}
            />
          </div>
        </form>
      </FormProvider>
      <Divider />
      <div className={styles.buttonCont}>
        <Button style={{ width: '100px' }} onClick={methods.handleSubmit(save)}>
          Actualizar
        </Button>
      </div>
    </div>
  );
}

export default ChangePass;
