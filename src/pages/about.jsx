import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import '../pagestyles/about.css'

function About() {


  return (
    <div className='page-container'>
      <div className='about-container'>
        <h1>About Us</h1>
        <img className='vermont-strong' src="https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/Other/about1.png" alt="FGBCinema" />
        <span className='about-text-container'>
          <p>FGB Theaters, including the Capitol Theater and Paramount Theater, are family owned and operated movie Theaters located in the heart of Vermont.</p>
          <p>Opened in xxxx, our two locations have been a staple of downtown Montpelier and Barre VT, bringing the most popular and anticipated movies to our audience for decades</p>
          <p>Our theaters are equipped with the latest in digital projection and sound technology, providing our customers with a first class movie going experience </p>
        </span>
      </div>
    </div>
  )
}

export default About;
