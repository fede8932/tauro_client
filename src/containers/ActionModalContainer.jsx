import React, { useEffect, useState } from 'react';
import ActionModalComponent from '../components/actionModal/ActionModalComponent';
import { useSelector } from 'react-redux';
import { deleteProductImage } from '../request/productRequest';
import Swal from 'sweetalert2';

function ActionModalContainer(props) {
  const { images } = props;
  const [imagesState, setImagesState] = useState(images || []);

  useEffect(() => {
    setImagesState(images || []);
  }, [images]);

  const handleDeleteImage = async (imageId) => {
    const result = await Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProductImage(imageId);
      setImagesState((prev) => prev.filter((img) => img.id !== imageId));
      Swal.fire('Eliminada', 'La imagen fue eliminada correctamente', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la imagen', 'error');
    }
  };

  const extProps = { ...props };
  extProps.disabled = imagesState?.length < 1;
  extProps.iconColor = imagesState?.length < 1 ? 'iconStyleGrey' : 'iconStylePurple';
  extProps.images = imagesState;
  extProps.onDeleteImage = handleDeleteImage;
  return <ActionModalComponent {...extProps} />;
}

export default ActionModalContainer;
