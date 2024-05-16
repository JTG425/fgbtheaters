import React, { useEffect, useState } from 'react';
import '../componentstyles/datepicker.css';
import { motion } from 'framer-motion';

const DatePicker = (props) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const date = props.date;
    const setDate = props.setDate;
    const [stylingDate, setStylingDate] = useState(parseInt(date.slice(2, 4)));

    // Days and months for rendering
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate the days for the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const previousMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const displayPreviousMonth = firstDayOfMonth;

    let days = [];
    for (let i = displayPreviousMonth - 1; i >= 0; i--) {
        days.push(
            <td key={`prev-${i}`} className="day other-month">
                {previousMonthDays - i}
            </td>
        );
    }

    const dayVariants = {
        selected: {
            background: '#c61404',
            color: 'rgb(255, 255, 255)',
        },
        notSelected: {
            background: '#ffffff',
            color: 'rgb(0, 0, 0)',
        }
    }
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(
            <td
                key={day}
                className='day'
                onClick={() => {
                    handleSelectedDate(day, currentMonth, currentYear);
                    setStylingDate(day);
                }}
            >
                <motion.button
                    className='day-button'
                    whileHover={{ scale: 1.01, fontWeight: 'bold' }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ backgroundColor: 'white', fontWeight: 'normal' }}
                    animate={stylingDate === day ? 'selected' : 'notSelected'}
                    variants={dayVariants}
                    transition={{ duration: 0.5 }}
                >{day}</motion.button>

            </td>
        );
    }

    const handleDateFormating = (day) => {
        const year = currentYear;
        const month = currentMonth + 1;
        const formattedMonth = month < 10 ? `0${month}` : month.toString();
        const formattedDay = day < 10 ? `0${day}` : day.toString();

        return `${formattedMonth}${formattedDay}${year}`;
    };

    const handleSelectedDate = (day, month, year) => {
        setDate(handleDateFormating(day));
    }

    const totalDaysShown = days.length;
    const nextMonthDaysNeeded = 7 - (totalDaysShown % 7);
    if (nextMonthDaysNeeded < 7) {
        for (let i = 1; i <= nextMonthDaysNeeded; i++) {
            days.push(
                <td key={`next-${i}`} className="day other-month">
                    {i}
                </td>
            );
        }
    }

    const totalCells = days.length;
    const rowsNeeded = totalCells < 42 ? 42 - totalCells : 0;
    for (let i = 1; i <= rowsNeeded; i++) {
        days.push(
            <td key={`extra-${i}`} className="day other-month">
                {nextMonthDaysNeeded + i}
            </td>
        );
    }

    // Navigate between months
    const navigateMonth = (direction) => {
        if (direction === 'prev') {
            setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
            if (currentMonth === 0) setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
            if (currentMonth === 11) setCurrentYear(currentYear + 1);
        }
    };

    // Fill the rows in the table
    let rows = [];
    for (let i = 0; i < 42; i += 7) {
        const rowDays = days.slice(i, i + 7);
        rows.push(<tr key={i}>{rowDays}</tr>);
    }




    return (
        <div className="date-picker">
            <div className="header">
                <button onClick={() => navigateMonth('prev')}>&lt;</button>
                <div><h2>{months[currentMonth]} {currentYear}</h2></div>
                <button onClick={() => navigateMonth('next')}>&gt;</button>
            </div>
            <table>
                <thead>
                    <tr>
                        {daysOfWeek.map(day => <th key={day} className="weekday">{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
};

export default DatePicker;
