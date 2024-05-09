import { useState } from "react";
import "../pagestyles/home.css";
import SlideShow from "../components/slideshow";

function Home() {
  return (
    <div className="page-container">
      <h1>Home</h1>
      <SlideShow />
    </div>
  );
}

export default Home;
