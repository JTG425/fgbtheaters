import { useState, Suspense, useEffect } from "react";
import "../pagestyles/home.css";
import SlideShow from "../components/slideshow";
import MovieCard from "../components/movieCard";

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
  const dataReceived = props.dataReceived;
  const [startDate, setStartDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(
    handleDateFormating(startDate)
  );

  const [selectedTheater, setSelectedTheater] = useState("Capitol");

  return (
    <div className="page-container">
      <h1>Home</h1>
      <SlideShow />
      <div className="movies-container">
        {dataReceived && selectedTheater === "Capitol" ? (
          <MovieCard
            date={formattedDate}
            shows={capShows}
            dataReceived={dataReceived}
          />
        ) : (
          <MovieCard
            date={formattedDate}
            shows={parShows}
            dataReceived={dataReceived}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
