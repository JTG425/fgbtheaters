import "../componentstyles/moviecard.css";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import MoviePoster from "./moviePoster";
import { useState, Suspense } from "react";

const convertToStandardTime = (militaryTime) => {
  const hoursMinutes = militaryTime.match(/(\d{2})(\d{2})/);
  let hours = parseInt(hoursMinutes[1], 10);
  const minutes = hoursMinutes[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${suffix}`;
};

function MovieCard(props) {
  const [inView, setInView] = useState(false);
  const date = props.date;
  const shows = props.shows;
  const recieved = props.dataReceived;

  return (
    <motion.div className="movieCard">
      {recieved ? (
        <AnimatePresence>
          {shows.map((show, index) => {
            return (
              <motion.div
                key={index}
                className="show"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MoviePoster film={show} />
                <div className="show-info">
                  <h3>{show.name}</h3>
                  <p>{show.rating}</p>
                  <p>{show.length}</p>
                  <a href={show.website}>Website</a>
                </div>
                <div className="showtimes">
                  <h4>Showtimes</h4>
                  {show.capitolShows.map((capitolShow, index) => {
                    return (
                      <div key={index} className="showtime">
                        <p>{capitolShow.date}</p>
                        <p>{convertToStandardTime(capitolShow.time)}</p>
                        <a href={capitolShow.saleLink}>Tickets</a>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </motion.div>
  );
}

export default MovieCard;
