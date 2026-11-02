import React, { useState, useRef, useCallback } from 'react';
import { Carousel } from 'antd';
import styles from './carrousel.module.css';
import useSafeImages from '../../hooks/useSafeImages';
import { downloadProductImage } from '../../request/productRequest';

const getFileName = (url, index) => {
  try {
    const segment = decodeURIComponent(
      url.split('/').pop().split('?')[0] || ''
    );
    return segment && segment.includes('.')
      ? segment
      : `imagen-${index + 1}.jpg`;
  } catch {
    return `imagen-${index + 1}.jpg`;
  }
};

const CustomCarrousel = (props) => {
  const { images, onDeleteImage, onClose } = props;
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const { markFailed, filter } = useSafeImages();

  const validImages = filter(images);

  const handleAfterChange = useCallback((current) => {
    setCurrentIndex(current);
  }, []);

  const handleDownload = useCallback(async () => {
    const image = validImages[currentIndex];
    if (!image || downloading) return;
    setDownloading(true);
    try {
      let blob;
      if (image.id) {
        // Descarga vía API: responde con el archivo y evita el bloqueo de CORS
        const response = await downloadProductImage(image.id);
        blob = response.data;
      } else {
        const response = await fetch(image.url);
        if (!response.ok) throw new Error('Error al descargar la imagen');
        blob = await response.blob();
      }
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = getFileName(image.url, currentIndex);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Último recurso: abrir en una pestaña nueva para guardar manualmente
      window.open(image.url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  }, [validImages, currentIndex, downloading]);

  if (!validImages || validImages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <i className="fa-regular fa-image"></i>
        <p>Sin imágenes</p>
      </div>
    );
  }

  return (
    <div className={styles.carouselWrapper}>
      <span className={styles.counter}>
        {currentIndex + 1} / {validImages.length}
      </span>

      {onClose && (
        <button
          className={styles.closeBtn}
          onClick={onClose}
          title="Cerrar"
        >
          <i className="fas fa-times"></i>
        </button>
      )}

      {onDeleteImage && (
        <button
          className={styles.deleteBtn}
          onClick={() => onDeleteImage(validImages[currentIndex].id)}
          title="Eliminar imagen actual"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      )}

      <button
        className={styles.downloadBtn}
        onClick={handleDownload}
        disabled={downloading}
        title="Descargar imagen actual"
      >
        <i
          className={
            downloading ? 'fas fa-spinner fa-spin' : 'fas fa-download'
          }
        ></i>
      </button>

      <Carousel
        ref={carouselRef}
        afterChange={handleAfterChange}
        dots={validImages.length > 1}
        autoplay={false}
      >
        {validImages.map((image, i) => (
          <div key={image.id} className={styles.slide}>
            <img
              src={image.url}
              alt={`Imagen ${i + 1}`}
              className={styles.slideImg}
              onError={() => markFailed(image.url)}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CustomCarrousel;
