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
  const [poster, setPoster] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [recieved, setRecieved] = useState(false);
  const [error, setError] = useState(false);
  const film = props.film;
  const rtsCode = film.rtsCode;

  useEffect(() => {
    const getPoster = async () => {
      try {
        const response = await fetch(
          `https://1shn6ru7ic.execute-api.us-east-1.amazonaws.com/default/send-posters`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rtsCode }),
          }
        );

        const json = await response.json();
        setPoster(json.base64Image);
        setRecieved(true);
        setError(false);
      } catch (error) {
        setError(true);
        console.error("Error importing Poster Images:", error);
      }
    };
    setRecieved(false);
    getPoster();
  }, [rtsCode]);

  return (
    <div className="poster">
      {poster != null ? (
        <motion.img
          className="poster"
          src={`data:image/jpg;base64,${poster}`}
          alt={rtsCode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
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
