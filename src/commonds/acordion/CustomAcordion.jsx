import React, { useState } from 'react';
import styles from './customAcordion.module.css';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { resetPendingSave } from '../../redux/pendingSave';
import { deleteSellOrder } from '../../request/orderRequest';

const CustomAcordion = ({ props }) => {
  const { textButton, icon01, items, notific } = props;
  // console.log(notific);
  const [isOpen, setIsOpen] = useState(false);
  const [iconClass, setIconClass] = useState('sideIconGri');
  const [icon02, setIcon02] = useState('fa-solid fa-caret-down');

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    let icon = isOpen ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-up';
    setIcon02(icon);
  };

  const pendingSave = useSelector((state) => state.pendingSave);
  const dispatch = useDispatch();

  const handleClick = (fn) => {
    // console.log(pendingSave);
    if (pendingSave.pending) {
      Swal.fire({
        title: 'Deseas guardar la orden de venta?',
        showDenyButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
        denyButtonText: `No guardar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          dispatch(resetPendingSave(null));
          Swal.fire('Guardado!', '', 'success');
          fn();
        } else if (result.isDenied) {
          deleteSellOrder(pendingSave.orderId).then(() => {
            dispatch(resetPendingSave(null));
            Swal.fire('No se guardaron los cambios', '', 'info');
            fn();
          });
        }
      });
    } else {
      fn();
    }
  };

  return (
    <div>
      <button
        className={styles.sideOptionButton}
        onMouseOver={() => {
          setIconClass('sideIconVio');
        }}
        onMouseLeave={() => {
          setIconClass('sideIconGri');
        }}
        onClick={toggleAccordion}
      >
        <div>
          <i className={`${styles[iconClass]} ${icon01}`}></i>
          <span className={styles.textContainer}>
            {textButton}
            {notific?.notific ? <div className={styles.notif}></div> : null}
          </span>
        </div>
        <div>
          <i className={`${styles[iconClass]} ${icon02}`}></i>
        </div>
      </button>
      {isOpen && (
        <div className={styles.contentContainer}>
          {items.map((item, i) => (
            <button
              key={i}
              className={styles.interButton}
              onClick={() => {
                handleClick(item.fn);
              }}
            >
              <i className={`${styles.pointIcon} fa-solid fa-circle`}></i>
              <span>{item.textButton}</span>
              {notific?.notific && i == notific?.index ? (
                <div className={styles.notif}></div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomAcordion;
