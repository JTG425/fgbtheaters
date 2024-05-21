import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import '../pagestyles/about.css'

const sliderVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};


const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

function About() {
  const aboutPosters = [
    {
      image: 'https://via.placeholder.com/150',
      alt: 'placeholder',
      title: 'stuff',
      text: "something"
    },
    {
      image: 'https://via.placeholder.com/150',
      alt: 'placeholder',
      title: 'other Stuff',
      text: "something else"
    },
    {
      image: 'https://via.placeholder.com/150',
      alt: 'placeholder',
      title: 'other stuff',
      text: "something else"
    },

  ]


  const [[imageIndex, direction], setImageIndex] = useState([0, 0]);
  const activeImageIndex = wrap(0, aboutPosters.length, imageIndex);


  return (
    <div className='page-container'>
      <h1>About</h1>
      <AnimatePresence initial={false} custom={direction}>
        <div className='image-container'>
          {aboutPosters.map((poster, index) => {
            const isActive = activeImageIndex === index;
            const isPrevious = activeImageIndex === index - 1;
            const isNext = activeImageIndex === index + 1;
            const imageDirection = isActive ? direction : isPrevious ? -1 : 1;

            return (
              <motion.div
                key={index}
                className='image'
                custom={imageDirection}
                variants={sliderVariants}
                initial='enter'
                animate='center'
                exit='exit'
                drag='x'
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    setImageIndex([index + 1, 1]);
                  } else if (swipe > swipeConfidenceThreshold) {
                    setImageIndex([index - 1, -1]);
                  }
                }}
              >
                <motion.img
                  src={poster.image}
                  alt={poster.alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {poster.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {poster.text}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

      </AnimatePresence>
    </div>
  )
}

export default About;
