import { useState, Suspense, useEffect } from "react";
import "../pagestyles/home.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";
import DatePicker from "../components/datepick";
import SelectTheater from "../components/selecttheater";

import "../componentstyles/datepicker.css";
import { CiCalendarDate } from "react-icons/ci";
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
  const [filteredCapShows, setFilteredCapShows] = useState([]);
  const [filteredParShows, setFilteredParShows] = useState([]);
  const capPosters = props.capPosters;
  const parPosters = props.parPosters;
  const bannerPosters = props.bannerPosters;
  const upcomingCapShows = props.upcomingCapShows;
  const upcomingCapPosters = props.upcomingCapPosters;



  const dataReceived = props.dataReceived;
  const [date, setDate] = useState(handleDateFormating(new Date()));
  const [selectedTheater, setSelectedTheater] = useState("capitol");
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleTheaterChange = (theater) => {
    setSelectedTheater(theater);
  }

  const handleDateChange = (date) => {
    setShowDatePicker(false);
    setDate(date);
  };


  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <SlideShow bannerPosters={bannerPosters} />
      <SelectTheater selected={selectedTheater} setSelected={handleTheaterChange} />
      <motion.div
        className="datePickerContainer"
      >
        <motion.button
          className="datePickerButton"
          onClick={() => setShowDatePicker(!showDatePicker)}
        ><CiCalendarDate />{handleDisplayDate(date)}</motion.button>

        {showDatePicker && (
          <DatePicker date={date} setDate={handleDateChange} />
        )}
      </motion.div>
      <div className="movies-container">
        {dataReceived && selectedTheater === "capitol" ? (
          <MovieCard
            date={date}
            capShows={capShows}
            capPosters={capPosters}
            parShows={parShows}
            parPosters={parPosters}
            dataReceived={dataReceived}
            selectedTheater={selectedTheater}
          />
        ) : (
          <MovieCard
            date={date}
            capShows={capShows}
            capPosters={capPosters}
            parShows={parShows}
            parPosters={parPosters}
            dataReceived={dataReceived}
            selectedTheater={selectedTheater}
          />
        )}
      </div>
    </motion.div>
  );
}

export default Home;


