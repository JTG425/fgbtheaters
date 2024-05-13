import "../componentstyles/moviecard.css";
import { motion, AnimatePresence } from "framer-motion";
import MoviePoster from "./moviePoster";
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
  const shows = props.shows;
  const received = props.dataReceived;
  const posters = props.posters;

  const groupShowsByMovie = () => {
    const groupedShows = {};
    shows.forEach(film => {
      const baseName = film.name.split('(')[0].trim();
      const showForDate = film.shows.filter(show => show.date === date);
      if (showForDate.length > 0) {  // Check if there are shows for the given date
        if (!groupedShows[baseName]) {
          groupedShows[baseName] = {
            name: baseName,
            shows: [],
            rtsCode: film.rtsCode,
            rating: film.rating,
            length: film.length,
            website: film.website,
          };
        }
        showForDate.forEach(show => {
          const subtitleTag = film.name.includes('(') ? " (Subtitles)" : "";
          groupedShows[baseName].shows.push({
            ...show,
            subtitleTag
          });
        });
      }
    });
    return Object.values(groupedShows).filter(film => film.shows.length > 0);  // Filter out films without shows
  };

  const groupedMovies = received ? groupShowsByMovie() : [];

  return (
    <motion.div className="movieCard">
      {received ? (
        <AnimatePresence>
          {groupedMovies.map((film, filmIndex) => (
            <motion.div className="film" key={filmIndex}>
              <MoviePoster
                film={film}
                rtsCode={film.rtsCode}
                posters={posters}
              />
              <div className="film-header">
                <a href={film.website} target="_blank" rel="noopener noreferrer">
                  <h3 className="film-name">{film.name}</h3>
                </a>
                <span className='film-info'>
                  <p>{film.rating}</p>
                  <p>{film.length} minutes</p>
                </span>
                {film.shows.map((show, showIndex) => (
                  <div className="showtime" key={showIndex}>
                    <a
                      className="showtime-link"
                      href={show.saleLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.button
                        className="showtime-button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {convertToStandardTime(show.time)}{show.subtitleTag}
                      </motion.button>
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </motion.div>
  );
}

export default MovieCard;
