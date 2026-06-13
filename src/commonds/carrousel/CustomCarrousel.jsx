import React, { useState, useRef, useCallback } from 'react';
import { Carousel } from 'antd';
import styles from './carrousel.module.css';

const CustomCarrousel = (props) => {
  const { images, onDeleteImage, onClose } = props;
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAfterChange = useCallback((current) => {
    setCurrentIndex(current);
  }, []);

  if (!images || images.length === 0) {
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
        {currentIndex + 1} / {images.length}
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
          onClick={() => onDeleteImage(images[currentIndex].id)}
          title="Eliminar imagen actual"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      )}

      <Carousel
        ref={carouselRef}
        afterChange={handleAfterChange}
        dots={images.length > 1}
        autoplay={false}
      >
        {images.map((image, i) => (
          <div key={image.id} className={styles.slide}>
            <img
              src={image.url}
              alt={`Imagen ${i + 1}`}
              className={styles.slideImg}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CustomCarrousel;
