import React, { useState, useRef, useCallback } from 'react';
import { Carousel } from 'antd';
import styles from './carrousel.module.css';
import useSafeImages from '../../hooks/useSafeImages';

const CustomCarrousel = (props) => {
  const { images, onDeleteImage, onClose } = props;
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { markFailed, filter } = useSafeImages();

  const validImages = filter(images);

  const handleAfterChange = useCallback((current) => {
    setCurrentIndex(current);
  }, []);

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
