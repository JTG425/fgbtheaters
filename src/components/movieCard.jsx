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
  const received = props.dataReceived;
  const capShows = props.capShows;
  const parShows = props.parShows;
  const capPosters = props.capPosters;
  const parPosters = props.parPosters;
  const [shows, setShows] = useState(capShows);
  const [posters, setPosters] = useState(capPosters);

  const selectedTheater = props.selectedTheater;

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

  useEffect(() => {
    setShows(selectedTheater === "capitol" ? capShows : parShows);
    setPosters(selectedTheater === "capitol" ? capPosters : parPosters);

  }, [selectedTheater]);

  return (
    <motion.div className="movieCard">
      {received ? (
        <AnimatePresence>
          {groupedMovies.map((film, filmIndex) => (
            <motion.div className="film" key={filmIndex}>
              <MoviePoster
                film={film}
                rtsCode={film.rtsCode}
                capPosters={capPosters}
                parPosters={parPosters}
                selectedTheater={selectedTheater}
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
                        <p>{convertToStandardTime(show.time)}{show.subtitleTag}</p>
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
