import React from 'react';
import { Carousel } from 'antd';
import styles from './carrousel.module.css';

const contentStyle = {
  margin: 0,
  height: '600px',
  color: '#fff',
  lineHeight: '490px',
  textAlign: 'center',
  background: '#364d79',
  borderRadius: '5px',
};

const CustomCarrousel = (props) => {
  const { images } = props;
  console.log(images);
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  return (
    <Carousel
      afterChange={onChange}
      autoplay={true}
      className={styles.slickDots}
    >
      {images &&
        images.map((image, i) => (
          <div style={contentStyle}>
            <img
              src={image.url}
              alt={`Imagen ${i}`}
              style={{ height: '600px', maxWidth: '790px' }}
            />
          </div>
        ))}
    </Carousel>
  );
};

export default CustomCarrousel;
