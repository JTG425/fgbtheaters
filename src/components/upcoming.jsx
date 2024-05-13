import "../componentstyles/upcoming.css";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";


const Upcoming = (props) => {
    const upcoming = props.upcomingCapShows;
    const upcomingPosters = props.upcomingCapPosters;
    const [shows, setShows] = useState([]);
    const [posters, setPosters] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [groupedShows, setGroupedShows] = useState([]);

    useEffect(() => {
        if (upcoming.length > 0 && upcomingPosters.length > 0) {
            setShows(upcoming[0].upcoming);
            setPosters(upcomingPosters);
        }
        if (shows.length === upcoming.length && posters.length === upcomingPosters.length) {
            setLoaded(true);
        }

        if (loaded) {
            filterAndGroupShows(shows);
        }

    }, [upcoming, upcomingPosters]);


    // Remove Shows with a "(" or ")" in the title
    // Assign Shows to their poster where 
    // show[i].rtsCode === poster[i].rtsCode
    const filterAndGroupShows = (shows) => {
        let filteredShows = shows.filter(show => !show.name.includes("(") && !show.name.includes(")"));
        let groupedShows = [];
        filteredShows.forEach(show => {
            let poster = posters.find(poster => poster.rtsCode === show.rtsCode);
            if (poster) {
                groupedShows.push({ show: show, poster: poster });
            }
        });
        setGroupedShows(groupedShows);
    };

    const formatDate = (date) => {
        const year = date.slice(0, 4);
        const month = date.slice(4, 6);
        const day = date.slice(6, 8);
        return `${month} / ${day} / ${year}`;
    };


    return (
        <div className="upcoming">
            <h3>Upcoming Movies</h3>
            <div className="upcoming-carousel">
                {groupedShows.map((group, index) => {
                    return (
                        <motion.div
                            key={index}
                            className="upcoming-show"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <img className="upcoming-poster" src={group.poster.imageUrl} alt={group.show.name} />
                            <a href={group.show.website} target="_blank" rel="noreferrer">
                                <h4>{group.show.name}</h4>
                            </a>
                            <p>{formatDate(group.show.startDate)}</p>
                        </motion.div>
                    );
                })}
            </div>


        </div>
    );
};

export default Upcoming;
