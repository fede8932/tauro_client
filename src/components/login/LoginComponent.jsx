import React from 'react';
import styles from './login.module.css';
import logo from '../../assets/logo/logo.png';
import Separador from '../../commonds/separador/Separador';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Spinner from 'react-bootstrap/Spinner';

function LoginComponent(props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { onSubmit, user } = props;
  return (
    <div className={styles.LoginComponentContainer}>
      <div className={styles.contenedorSecundario}>
        <div className={styles.titleContainer}>
          <div className={styles.iconTitleContainer}>
            <img className={styles.logo} src={logo} alt="Logo" />
            <h1 className={styles.title}>Ad panel</h1>
          </div>
          <h5 className={styles.saludo}>Hola, Bienvenido!</h5>
          <span className={styles.instruction}>
            Ingresá tus credenciales para continuar
          </span>
        </div>
        <Separador props={{ clase: 'separador' }} />
        <div className={styles.formContainer}>
          <span className={styles.instructionForm}>
            Ingresá con tu correo electrónico
          </span>
          <Form className={styles.formulario} onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Form.Control
                type="email"
                placeholder="Ingresá tu email"
                id={styles.textInput}
                {...register('email', { required: true })}
              />
              {errors.email && (
                <span className={styles.spanError}>
                  El campo es obligatorio
                </span>
              )}
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <div>
              <Form.Group>
                <Form.Control
                  id={styles.textInput}
                  type="password"
                  placeholder="Ingresá tu contraseña"
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <span className={styles.spanError}>
                    El campo es obligatorio
                  </span>
                )}
              </Form.Group>
              <div className={styles.submitContainer}>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Recordame"
                    className={styles.checkbox}
                    {...register('recordame')}
                  />
                </Form.Group>
                <a href="/ruta" className={styles.resetPassButton}>
                  Olvidé mi contraseña
                </a>
              </div>
            </div>
            <Button
              type="submit"
              className={styles.submitButton}
              style={{ height: '40px' }}
            >
              {user.loading ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </Form>
        </div>
        <Separador props={{ clase: 'separador' }} />
        <div className={styles.footContainer}>
          <a href="/ruta" className={styles.resetPassButton}>
            No tenés una cuenta?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
