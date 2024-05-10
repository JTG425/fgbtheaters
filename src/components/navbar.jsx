import { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../componentstyles/navbar.css";
import DropDown from "./dropdown";
import fullNavLogo from "../assets/fullNav.svg";
import smallNavLogo from "../assets/smallNav.svg";

function NavBar(props) {
  const pages = props.pages;
  const handlePageChange = props.handlePageChange;
  const [page, setPage] = useState("Home");
  const [showDropdown, setShowDropdown] = useState(false);

  const buttonVariants = {
    Selected: {
      background: "#940303",
      color: "#fd9999",
    },
    NotSelected: {
      background: "#f1efef",
      color: "#292323",
    },
  };

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="nav-container">
      <motion.img
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        src={fullNavLogo}
        alt="nav-logo"
        className="full-nav-logo"
      />

      <motion.img
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        src={smallNavLogo}
        alt="nav-logo"
        className="small-nav-logo"
      />

      <DropDown />
      <div className="nav-buttons-container">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="nav-button"
            initial="NotSelected"
            animate={page === "Home" ? "Selected" : "NotSelected"}
            variants={buttonVariants}
            transition={{ duration: 0.2 }}
            onClick={() => {
              handlePageChange("Home");
              setPage("Home");
            }}
          >
            Home
          </motion.button>
        </Link>

        <Link to="/tickets">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="nav-button"
            initial="NotSelected"
            animate={page === "Tickets" ? "Selected" : "NotSelected"}
            variants={buttonVariants}
            transition={{ duration: 0.2 }}
            onClick={() => {
              handlePageChange("Tickets");
              setPage("Tickets");
            }}
          >
            Buy Tickets
          </motion.button>
        </Link>

        <Link to="/locations">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="nav-button"
            initial="NotSelected"
            animate={page === "Locations" ? "Selected" : "NotSelected"}
            variants={buttonVariants}
            transition={{ duration: 0.2 }}
            onClick={() => {
              handlePageChange("Locations");
              setPage("Locations");
            }}
          >
            Locations
          </motion.button>
        </Link>

        <Link to="/about">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="nav-button"
            initial="NotSelected"
            animate={page === "About" ? "Selected" : "NotSelected"}
            variants={buttonVariants}
            transition={{ duration: 0.2 }}
            onClick={() => {
              handlePageChange("About");
              setPage("About");
            }}
          >
            About
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
