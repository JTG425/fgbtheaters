import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { motion } from 'framer-motion';
import '../componentstyles/datepicker.css'; // Import CSS for additional styles

const DatePicker = (props) => {
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const dateRefs = useRef([]);
    // populate a list of 14 dates starting from today
    const dates = [
        new Date(),
        new Date(new Date().setDate(new Date().getDate() + 1)),
        new Date(new Date().setDate(new Date().getDate() + 2)),
        new Date(new Date().setDate(new Date().getDate() + 3)),
        new Date(new Date().setDate(new Date().getDate() + 4)),
        new Date(new Date().setDate(new Date().getDate() + 5)),
        new Date(new Date().setDate(new Date().getDate() + 6)),
        new Date(new Date().setDate(new Date().getDate() + 7)),
        new Date(new Date().setDate(new Date().getDate() + 8)),
        new Date(new Date().setDate(new Date().getDate() + 9)),
        new Date(new Date().setDate(new Date().getDate() + 10)),
        new Date(new Date().setDate(new Date().getDate() + 11)),
        new Date(new Date().setDate(new Date().getDate() + 12)),
        new Date(new Date().setDate(new Date().getDate() + 13)),
    ];
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    const animateDatePicker = () => {
        const slideWidth = dateRefs.current[0]?.offsetWidth || 0;
        dateRefs.current.forEach((img, index) => {
            const offset = (index - currentDateIndex) * (slideWidth + 10);
            anime({
                targets: img,
                translateX: offset,
                opacity: index === currentDateIndex ? 1 : 0.75,
                easing: "easeOutExpo",
                duration: 900,
            });
        });
        anime({
            targets: ".slide-active",
            opacity: 1,
            zindex: 1,
            backgroundColor: "#940303",
            color: "#fbfbfb",
            easing: "easeOutExpo",
            duration: 900,
        });
        anime({
            targets: ".slide-left",
            opacity: 0.5,
            backgroundColor: "#fbfbfb",
            color: "#292323",
            easing: "easeOutExpo",
            duration: 900,
        });
        anime({
            targets: ".slide-right",
            opacity: 0.5,
            backgroundColor: "#fbfbfb",
            color: "#292323",
            easing: "easeOutExpo",
            duration: 900,
        });
    };

    const handleDateChange = (index) => {
        const selectedDate = formatDate(dates[index]);
        console.log(selectedDate);
        props.setDate(selectedDate);
    };

    useEffect(() => {
        animateDatePicker();
    }, [currentDateIndex]);

    return (
        <div className="datepicker-container">
            <div className="datepicker">
                {dates.map((date, index) => {
                    return (
                        <>
                            <button
                                key={index}
                                ref={(el) => (dateRefs.current[index] = el)}
                                alt={`date-${index}`}
                                className={`slide-${index === currentDateIndex ? 'active' : index < currentDateIndex ? 'left' : 'right'}`}
                                onClick={() => {
                                    setCurrentDateIndex(index);
                                    handleDateChange(index);
                                }}
                            >
                                <div className="dp-button-text">
                                    <div className="weekday">
                                        {weekdays[date.getDay()]}
                                    </div>
                                    <div className="date">
                                        {handleDisplayDate(date)}
                                    </div>
                                </div>
                            </button>
                        </>
                    );
                })}
            </div>
        </div>
    );
};

const handleDisplayDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}`;
}

const formatDate = (date) => {
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    const formattedDay = day < 10 ? `0${day}` : day.toString();
    return `${formattedMonth}${formattedDay}${year}`;
}

export default DatePicker;
