import { useState, useEffect } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../componentstyles/navbar.css";
import DropDown from "./dropdown";
import NavLogo from '../assets/navLogo.svg';

function NavBar(props) {
  const pages = props.pages;
  const handlePageChange = props.handlePageChange;
  const [page, setPage] = useState("Home");
  const [showDropdown, setShowDropdown] = useState(false);

  const [hovered, setHovered] = useState("None");

  const buttonVariants = {
    Selected: {
      background: "#940303",
    },
    NotSelected: {
      background: "#fbfbfb",
    },
    hovered: {
      background: "#940303",
      boxShadow: "0px 0px 10px 0px rgba(148, 3, 3, 0.75)",
    },
  };


  // color: "#fd9999",
  // fontWeight: "bold",

  // Not Selected:       color: "#292323",

  const textVariants = {
    selected: {
      color: "#fbfbfb",
      fontWeight: "700",
    },
    notselected: {
      color: "#292323",
      fontWeight: "400",
    },
    hovered: {
      color: "#fbfbfb",
    },
  };


  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="nav-container">
      <div className="nav-content-container">
        <Link to="/">
          <motion.img
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            src={NavLogo}
            alt="nav-logo"
            className="nav-logo"
            onClick={() => {
              handlePageChange("Home");
              setPage("Home");
            }}
          />
        </Link>
        <DropDown />
        <div className="nav-buttons-container">
          <Link to="/">
            <motion.button
              whileHover="hovered"
              whileTap={{ scale: 0.9 }}
              className="nav-button"
              initial="NotSelected"
              animate={page === "Home" ? "Selected" : "NotSelected"}
              variants={buttonVariants}
              transition={{ duration: 0.25 }}
              onClick={() => {
                handlePageChange("Home");
                setPage("Home");
              }}
            >

              <motion.p
                initial="selected"
                whileHover="hovered"
                animate={page === "Home" ? "selected" : "notselected"}
                variants={textVariants}
                transition={{ duration: 0.3 }}
              >
                Home
              </motion.p>
            </motion.button>
          </Link>

          <Link to="/tickets">
            <motion.button
              whileHover="hovered"
              whileTap={{ scale: 0.9 }}
              className="nav-button"
              initial="NotSelected"
              animate={page === "Tickets" ? "Selected" : "NotSelected"}
              variants={buttonVariants}
              transition={{ duration: 0.25 }}
              onClick={() => {
                handlePageChange("Tickets");
                setPage("Tickets");
              }}
            >
              <motion.p
                initial="selected"
                whileHover="hovered"
                animate={page === "Tickets" ? "selected" : "notselected"}
                variants={textVariants}
                transition={{ duration: 0.3 }}
              >
                Tickets
              </motion.p>
            </motion.button>
          </Link>
          <Link to="/locations">
            <motion.button
              whileHover="hovered"
              whileTap={{ scale: 0.9 }}
              className="nav-button"
              initial="NotSelected"
              animate={page === "Locations" ? "Selected" : "NotSelected"}
              variants={buttonVariants}
              transition={{ duration: 0.25 }}
              onClick={() => {
                handlePageChange("Locations");
                setPage("Locations");
              }}
            >
              <motion.p
                initial="selected"
                whileHover="hovered"
                animate={page === "Locations" ? "selected" : "notselected"}
                variants={textVariants}
                transition={{ duration: 0.3 }}
              >
                Locations
              </motion.p>
            </motion.button>
          </Link>
          <Link to="/gifts">
            <motion.button
              whileHover="hovered"
              whileTap={{ scale: 0.9 }}
              className="nav-button"
              initial="NotSelected"
              animate={page === "Gifts" ? "Selected" : "NotSelected"}
              variants={buttonVariants}
              transition={{ duration: 0.25 }}
              onClick={() => {
                handlePageChange("Gifts");
                setPage("Gifts");
              }}
            >
              <motion.p
                initial="selected"
                whileHover="hovered"
                animate={page === "Gifts" ? "selected" : "notselected"}
                variants={textVariants}
                transition={{ duration: 0.3 }}
              >
                Gifts
              </motion.p>
            </motion.button>
          </Link>
          <Link to="/about">
            <motion.button
              whileHover="hovered"
              whileTap={{ scale: 0.9 }}
              className="nav-button"
              initial="NotSelected"
              animate={page === "About" ? "Selected" : "NotSelected"}
              variants={buttonVariants}
              transition={{ duration: 0.25 }}
              onClick={() => {
                handlePageChange("About");
                setPage("About");
              }}
            >
              <motion.p
                initial="selected"
                whileHover="hovered"
                animate={page === "About" ? "selected" : "notselected"}
                variants={textVariants}
                transition={{ duration: 0.3 }}
              >
                About
              </motion.p>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
