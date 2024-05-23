import { useState, Suspense, useEffect } from "react";
import "../pagestyles/home.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";
import SelectTheater from "../components/selecttheater";
import { CiCalendarDate } from "react-icons/ci";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";

const handleDateFormating = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  return `${formattedMonth}${formattedDay}${year}`;
};

const handleDisplayDate = (date) => {
  const month = date.slice(0, 2);
  const day = date.slice(2, 4);
  const year = date.slice(4, 8);
  return `${month} / ${day} / ${year}`;
};

function Home(props) {
  const capShows = props.capShows;
  const parShows = props.parShows;
  const dataReceived = props.dataReceived;
  const [startDate, setStartDate] = useState(new Date());
  const [date, setDate] = useState(handleDateFormating(new Date()));
  const [selectedTheater, setSelectedTheater] = useState("capitol");


  const handleTheaterChange = (theater) => {
    setSelectedTheater(theater);
  }

  const handleDateChange = (date) => {
    setStartDate(date);
    setDate(handleDateFormating(date));
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <SlideShow />
      <div className="home-container">
        <h2>Today's Showings</h2>
        <SelectTheater selected={selectedTheater} setSelected={handleTheaterChange} />
        <div className="datepicker-container">
          <ReactDatePicker
            className="datepicker"
            minDate={new Date()}
            showIcon
            selected={startDate}
            onChange={(date) => handleDateChange(date)}
          />
        </div>
        <div className="movies-container">
          {dataReceived && selectedTheater === "capitol" ? (
            <MovieCard
              date={date}
              capShows={capShows}
              parShows={parShows}
              selectedTheater={selectedTheater}
            />
          ) : (
            <MovieCard
              date={date}
              capShows={capShows}
              parShows={parShows}
              selectedTheater={selectedTheater}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Home;


