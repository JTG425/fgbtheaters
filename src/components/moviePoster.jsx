import "../componentstyles/moviecard.css";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  closed: {
    opacity: 1,
    x: 0,
    zIndex: 5,
  },
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    opacity: 0,
    x: 0,
  },
};

const MoviePoster = (props) => {
  const film = props.film;
  const rtsCode = film.rtsCode;
  const capPosters = props.capPosters;
  const parPosters = props.parPosters;
  const selectedTheater = props.selectedTheater;

  const [posters, setPosters] = useState(selectedTheater === "capitol" ? capPosters : parPosters);


  const [poster, setPoster] = useState(null);
  const [error, setError] = useState(false);



  useEffect(() => {
    const poster = posters.find((poster) => poster.rtsCode === rtsCode);
    if (poster != null) {
      setPoster(poster.posterData.url.href);
    }
  }, [posters, rtsCode]);


  return (
    <div className="poster">
      {poster != null ? (
        <motion.img
          className="poster"
          src={poster}
          alt={rtsCode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        />
      ) : error ? (
        <motion.div className="not-found">
          <p>No Poster Found</p>
        </motion.div>
      ) : (
        <motion.div className="poster-loading">
          <p>Loading {rtsCode}</p>
        </motion.div>
      )}
    </div>
  );
};

export default MoviePoster;
