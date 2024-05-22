import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { motion } from 'framer-motion';
import '../componentstyles/slideshow.css'; // Import CSS for additional styles

const SlideShow = (props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = props.images;
  const imageRefs = useRef([]);

  const animateSlideShow = () => {
    const slideWidth = imageRefs.current[0]?.offsetWidth || 0;
    imageRefs.current.forEach((img, index) => {
      const offset = (index - currentImageIndex) * (slideWidth + 50) - 100;
      anime({
        targets: img,
        translateX: offset,
        opacity: index === currentImageIndex ? 1 : 0.75,
        easing: "easeOutExpo",
        duration: 900,
      });
    });
    anime({
      targets: ".slide-active",
      opacity: 1,
      zindex: 1,
      easing: "easeOutExpo",
      duration: 900,
    });
    anime({
      targets: ".slide-left",
      opacity: 0.5,
      easing: "easeOutExpo",
      duration: 900,
    });
    anime({
      targets: ".slide-right",
      opacity: 0.5,
      easing: "easeOutExpo",
      duration: 900,
    });
  };

  const handleImageChange = (direction) => {
    if (direction === 'left') {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    } else {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  useEffect(() => {
    animateSlideShow();
  }, [currentImageIndex]);

  return (
    <div className="slideshow-container">
      <div className="slideshow">
        {images.map((image, index) => {
          return (
            <img
              key={index}
              ref={(el) => (imageRefs.current[index] = el)}
              src={image.posterData.url.href}
              alt={`banner-${index}`}
              className={`slide-${index === currentImageIndex ? 'active' : index < currentImageIndex ? 'left' : 'right'}`}
            />
          );
        })}
        <div className='slideshow-controls'>
          <motion.button
            className="slideshow-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleImageChange('left')}
          >
            &#10094;
          </motion.button>
          <motion.button
            className="slideshow-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleImageChange('right')}
          >
            &#10095;
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SlideShow;
