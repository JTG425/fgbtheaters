import "../pagestyles/locations.css";
import "../pagestyles/home.css";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import Map from "react-map-gl";

function CapitolMap() {
  return <p>Capitol Theater Map</p>;
}

function ParamountMap() {
  return <p>Paramount Theater Map</p>;
}

function Locations() {
  return (
    <div className="page-container">
      <div className="locations">
        <h2>Locations</h2>
        <span className="info">
          <p>
            <b>Hours of Operation:</b> The box office opens 30 minutes before
            the show and remains open for 20 minutes after the last show of the
            day.
          </p>
        </span>
        <div className="maps">
          <motion.div className="cap-map">
            <h3>Capitol Theaters</h3>
            <div className="map-container">
              <Suspense fallback={<div>Loading...</div>}>
                <CapitolMap />
              </Suspense>
            </div>
            <div className="map-cover"></div>
            <motion.a href="tel:18022290343" className="call">
              <span className="call-content">
                <FaPhoneAlt />
                <p>(802)-229-0343</p>
              </span>
            </motion.a>
          </motion.div>
          <motion.div className="par-map">
            <h3>Paramount Theaters</h3>
            <div className="map-container">
              <Suspense fallback={<div>Loading...</div>}>
                <ParamountMap />
              </Suspense>
            </div>
            <div className="map-cover"></div>
            <motion.a href="tel:18024790078" className="call">
              <span className="call-content">
                <FaPhoneAlt />
                <p>(802)-229-0343</p>
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Locations;
