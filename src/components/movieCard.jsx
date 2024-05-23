import "../componentstyles/moviecard.css";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const convertToStandardTime = (militaryTime) => {
  const hoursMinutes = militaryTime.match(/(\d{2})(\d{2})/);
  let hours = parseInt(hoursMinutes[1], 10);
  const minutes = hoursMinutes[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${suffix}`;
};

function MovieCard(props) {
  const date = props.date;
  const capShows = props.capShows;
  const parShows = props.parShows;
  const [shows, setShows] = useState(capShows);
  const selectedTheater = props.selectedTheater;

  useEffect(() => {
    setShows(selectedTheater === "capitol" ? capShows : parShows);
  }, [selectedTheater]);

  return (
    <motion.div className="movieCard">
      <AnimatePresence>
        {shows
          .filter((film) => film.show.some((show) => show.date === date))
          .map((film, filmIndex) => (
            <motion.div className="film" key={filmIndex}>
              <motion.img
                className="poster"
                src={film.poster}
                alt={film.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <div className="film-header">
                <a href={film.website} target="_blank" rel="noopener noreferrer">
                  <h3 className="film-name">{film.name}</h3>
                </a>
                <span className="film-info">
                  <p>{film.rating}</p>
                  <p>{film.length} minutes</p>
                </span>
                {film.show
                  .filter((show) => show.date === date)
                  .map((show, showIndex) => (
                    <div className="showtime" key={showIndex}>
                      <a
                        className="showtime-link"
                        href={show.salelink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <motion.button
                          className="showtime-button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <p>
                            {convertToStandardTime(show.time)}
                            {show.subtitleTag}
                          </p>
                        </motion.button>
                      </a>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default MovieCard;