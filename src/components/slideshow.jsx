import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { motion } from 'framer-motion';
import '../componentstyles/slideshow.css'; // Import CSS for additional styles

const SlideShow = (props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const images = props.images;

  const tempSlides = [
    {
      image: "https://placehold.co/1000x1500/png",
      background: "https://i.imgur.com/CjufWqq.png",
      title: "Welcome To FGB Theaters",
      text: "Central Vermont"
    },
    {
      image: "https://placehold.co/1000x1500/png",
      background: "https://placehold.co/1500x800/png",
      title: "Welcome To FGB Theaters",
      text: "Located in Central Vermont"
    },
  ];

  const imageVariants = {
    hidden: {
      opacity: 0,
      display: 'none',
    },
    visible: {
      opacity: 1,
      display: 'flex'
    },

  };


  return (
    <div className="slideshow-container">
      <div className="slideshow">
        {tempSlides.map((slide, index) => (
          <motion.div
            key={`slideshow-div-${index}`}
            initial='hidden'
            animate={currentImageIndex === index ? 'visible' : 'hidden'}
            variants={imageVariants}
          >
            <img
              key={`slide-background-${index}`}
              className='slide-background'
              src={slide.background}
            />
            <div key={`slideshow-content-div-${index}`} className='slideshow-content'>
              <img
                key={`slide-image-${index}`}
                className='slide-image'
                src={slide.image}

              />
              <div key={`slide-text-div-${index}`} className='slide-text-div'>
                <h2
                  key={`slide-title-${index}`}
                  className='slide-title'
                >{slide.title}</h2>
                <p
                  key={`slide-text-${index}`}
                  className='slide-text'
                >{slide.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SlideShow;
