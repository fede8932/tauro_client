import React from 'react';
import styles from './customModal.module.css';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

const VerticalModal = (props) => {
  const { title, size, onHide, children, show } = props; //size: 'sm' | 'lg' | 'xl'
  // console.log("esto tiene que llegar a children", rest);
  return (
    <Modal
      show={show}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title
          style={{ color: '#3C3C3C' }}
          id="contained-modal-title-vcenter"
        >
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={onHide}>Guardar</Button>
      </Modal.Footer> */}
    </Modal>
  );
};

function CustomModal(props) {
  const {
    title,
    size,
    actionButton,
    actionProps,
    bodyModal,
    bodyProps,
    ...rest
  } = props;
  // console.log("props", props);
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      {React.cloneElement(actionButton, {
        onClick: () => setModalShow(true),
        ...actionProps,
      })}
      <VerticalModal
        title={title}
        size={size}
        show={modalShow}
        onHide={() => setModalShow(false)}
        {...rest}
      >
        {bodyModal &&
          React.createElement(bodyModal, {
            /*index: props.index,*/
            closeModal: () => {
              setModalShow(false);
            },
            ...bodyProps,
            ...rest,
          })}
      </VerticalModal>
    </>
  );
}

export default CustomModal;
