import styles from './permissionDenied.module.css';

function PermissionDenied(props) {
  return (
    <div className={styles.view}>
      <div className={styles.container}>
        <i style={{ fontSize: '55px' }} className="fa-solid fa-lock"></i>
        <span className={styles.title}>Acceso Denegado</span>
        <span className={styles.message}>
          Comunicate con el administrador de permisos
        </span>
      </div>
    </div>
  );
}

export default PermissionDenied;
