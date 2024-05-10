import { useState, Suspense, useEffect } from "react";
import "../pagestyles/home.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";
import DatePicker from "react-datepicker";
import "../componentstyles/datepicker.css";
import { CiCalendarDate } from "react-icons/ci";
import { motion } from "framer-motion";

const handleDateFormating = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();

  return `${formattedMonth}${formattedDay}${year}`;
};

function Home(props) {
  const capShows = props.capShows;
  const parShows = props.parShows;
  const [filteredCapShows, setFilteredCapShows] = useState([]);
  const [filteredParShows, setFilteredParShows] = useState([]);
  const capPosters = props.capPosters;
  const parPosters = props.parPosters;
  const bannerPosters = props.bannerPosters;

  const dataReceived = props.dataReceived;
  const [startDate, setStartDate] = useState(new Date());
  const [selectedTheater, setSelectedTheater] = useState("Capitol");

  const [formattedDate, setFormattedDate] = useState(
    handleDateFormating(startDate)
  );

  return (
    <div className="page-container">
      <SlideShow bannerPosters={bannerPosters} />
      <motion.div
        className="datePickerContainer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CiCalendarDate />
        <DatePicker
          className="datePicker"
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setFormattedDate(handleDateFormating(date));
          }}
        />
      </motion.div>
      <div className="movies-container">
        {dataReceived && selectedTheater === "Capitol" ? (
          <MovieCard
            date={formattedDate}
            shows={capShows}
            dataReceived={dataReceived}
            capPosters={capPosters}
            parPosters={parPosters}
          />
        ) : (
          <MovieCard
            date={formattedDate}
            shows={parShows}
            dataReceived={dataReceived}
            capPosters={capPosters}
            parPosters={parPosters}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
