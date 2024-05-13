import "../componentstyles/upcoming.css";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";


const Upcoming = (props) => {
    const upcoming = props.upcomingCapShows;
    const upcomingPosters = props.upcomingCapPosters;
    const dataReceived = props.dataReceived;

    if (dataReceived) {
        const shows = upcoming[0].upcoming;
    }

    useEffect(() => {
        console.log(upcoming);
        console.log(upcomingPosters);
    }, [dataReceived]);


    return (
        <div className="upcoming">
            <h3>Upcoming Movies</h3>

        </div>
    );
};

export default Upcoming;
