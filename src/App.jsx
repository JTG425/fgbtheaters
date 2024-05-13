import "./App.css";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import loading from "./assets/loading.svg";
import NavBar from "./components/navbar";
import Home from "./pages/home";
import Tickets from "./pages/tickets";
import Locations from "./pages/locations";
import About from "./pages/about";
import Admin from "./pages/admin";

function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [capitolShows, setCapitolShows] = useState([]);
  const [paramountShows, setParamountShows] = useState([]);
  const [upcomingCapShows, setUpcomingCapShows] = useState([]);
  const [upcomingParShows, setUpcomingParShows] = useState([]);


  const [capRtsCodes, setCapRtsCodes] = useState([]);
  const [parRtsCodes, setParRtsCodes] = useState([]);
  const [upcomingCapRtsCodes, setUpcomingCapRtsCodes] = useState([]);
  const [upcomingParRtsCodes, setUpcomingParRtsCodes] = useState([]);

  const [rtsCodes, setRtsCodes] = useState([]);
  const [dataReceived, setDataReceived] = useState(false);
  const [loadScreen, setLoadScreen] = useState(true);
  const [disableScroll, setDisableScroll] = useState(false);

  const [capParsed, setCapParsed] = useState(false);
  const [parParsed, setParParsed] = useState(false);
  const [upcomingCapParsed, setUpcomingCapParsed] = useState(false);
  const [upcomingParParsed, setUpcomingParParsed] = useState(false);

  const [capPosters, setCapPosters] = useState([]);
  const [parPosters, setParPosters] = useState([]);
  const [upcomingCapPosters, setUpcomingCapPosters] = useState([]);
  const [upcomingParPosters, setUpcomingParPosters] = useState([]);

  const [posters, setPosters] = useState([]);
  const [bannerPosters, setBannerPosters] = useState([]);

  const fadeRef = useRef();
  const loadVariants = {
    loadScreen: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    loadScreenOut: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const pages = [
    {
      name: "Home",
      path: "/",
      component: Home,
    },
    {
      name: "Buy Tickets",
      path: "/tickets",
      component: Tickets,
    },
    {
      name: "Locations",
      path: "/locations",
      component: Locations,
    },
    {
      name: "About",
      path: "/about",
      component: About,
    },
  ];

  const handlePageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchCapitolShows(), fetchParamountShows()]);
        setDataReceived(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDataReceived(false);
      }
    };

    const fetchCapitolShows = async () => {
      try {
        const response = await fetch(
          `https://8qgqyq3ke0.execute-api.us-east-1.amazonaws.com/default/send-xml`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ theater: "Capitol" }),
          }
        );
        const capXML = await response.text();
        parseCapXML(capXML);
        parseUpcomingCapXML(capXML);
      } catch (error) {
        console.error("Error fetching Capitol shows:", error);
      }
    };

    const fetchParamountShows = async () => {
      try {
        const response = await fetch(
          `https://8qgqyq3ke0.execute-api.us-east-1.amazonaws.com/default/send-xml`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ theater: "Paramount" }),
          }
        );
        const parXML = await response.text();
        parseParXML(parXML);
      } catch (error) {
        console.error("Error fetching Paramount shows:", error);
      }
    };

    const parseCapXML = async (capXML) => {
      const parser = new DOMParser();
      const capDoc = parser.parseFromString(capXML, "application/xml");

      const capFilmTitleElements = capDoc.getElementsByTagName("filmtitle");

      let allRtsCodes = [];

      const extractedCapShows = Array.from(capFilmTitleElements).map(
        (capFilmTitleElement) => {
          const name = capFilmTitleElement.querySelector("name").textContent;
          const rating =
            capFilmTitleElement.querySelector("rating").textContent;
          const length =
            capFilmTitleElement.querySelector("length").textContent;
          const website =
            capFilmTitleElement.querySelector("website").textContent;
          const rtsCode =
            capFilmTitleElement.querySelector("RtsCode").textContent;
          allRtsCodes.push(rtsCode);

          const capShowElements =
            capFilmTitleElement.getElementsByTagName("show");
          const extractedCapShows = Array.from(capShowElements).map(
            (capShowElement) => {
              const date = capShowElement.querySelector("date").textContent;
              const time = capShowElement.querySelector("time").textContent;
              const saleLink =
                capShowElement.querySelector("salelink").textContent;
              return { date, time, saleLink };
            }
          );
          return {
            name,
            rating,
            length,
            website,
            rtsCode,
            shows: extractedCapShows,
          };
        }
      );
      setCapitolShows(extractedCapShows);
      setCapRtsCodes([...new Set(allRtsCodes)]);
      setCapParsed(true);
      fetchCapPosters(allRtsCodes);
    };

    const parseParXML = async (parXML) => {
      const parser = new DOMParser();
      const parDoc = parser.parseFromString(parXML, "application/xml");

      const parFilmTitleElements = parDoc.getElementsByTagName("filmtitle");

      let allRtsCodes = [];

      const extractedParShows = Array.from(parFilmTitleElements).map(
        (parFilmTitleElement) => {
          const name = parFilmTitleElement.querySelector("name").textContent;
          const rating =
            parFilmTitleElement.querySelector("rating").textContent;
          const length =
            parFilmTitleElement.querySelector("length").textContent;
          const website =
            parFilmTitleElement.querySelector("website").textContent;
          const rtsCode =
            parFilmTitleElement.querySelector("RtsCode").textContent;
          allRtsCodes.push(rtsCode);

          const parShowElements =
            parFilmTitleElement.getElementsByTagName("show");
          const extractedParShows = Array.from(parShowElements).map(
            (parShowElement) => {
              const date = parShowElement.querySelector("date").textContent;
              const time = parShowElement.querySelector("time").textContent;
              const saleLink =
                parShowElement.querySelector("salelink").textContent;
              return { date, time, saleLink };
            }
          );
          return {
            name,
            rating,
            length,
            website,
            rtsCode,
            shows: extractedParShows,
          };
        }
      );
      setParamountShows(extractedParShows);
      setParRtsCodes([...new Set(allRtsCodes)]);
      setParParsed(true);
      fetchParPosters(allRtsCodes);
    };

    const parseUpcomingCapXML = async (xml) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "application/xml");

      const upcomingTitleElements = doc.getElementsByTagName("upcomingtitles");

      let allRtsCodes = [];

      const extractedTitles = Array.from(upcomingTitleElements).map(
        (upcomingTitleElement) => {
          const titleElements = upcomingTitleElement.getElementsByTagName("title");
          const extractedTitles = Array.from(titleElements).map(titleElement => {
            const name = titleElement.querySelector("name").textContent;
            const rating = titleElement.querySelector("rating").textContent;
            const length = titleElement.querySelector("length").textContent;
            const website = titleElement.querySelector("website").textContent;
            const rtsCode = titleElement.querySelector("RtsCode").textContent;
            const startDate = titleElement.querySelector("StartDate").textContent;
            allRtsCodes.push(rtsCode);
            return { name, rating, length, website, rtsCode, startDate };
          });
          return { upcoming: extractedTitles };
        }
      );
      setUpcomingCapShows(extractedTitles);
      setUpcomingCapRtsCodes([...new Set(allRtsCodes)]);
      setUpcomingCapParsed(true);
      fetchUpcomingCapPosters(allRtsCodes);
    };


    const fetchCapPosters = async (rcodes) => {
      try {
        const response = await fetch(
          `https://1shn6ru7ic.execute-api.us-east-1.amazonaws.com/default/send-posters`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ codes: rcodes }),
          }
        );
        const json = await response.json();
        if (json && json.images) {
          setCapPosters(json.images);
          fetchSlideshowPosters(rcodes);
        } else {
          console.error("Received invalid or empty images array:", json);
        }
      } catch (error) {
        console.error("Error fetching posters for chunk:", chunk, error);
      }
    };

    const fetchUpcomingCapPosters = async (rcodes) => {
      try {
        const response = await fetch(
          `https://1shn6ru7ic.execute-api.us-east-1.amazonaws.com/default/send-posters`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ codes: rcodes }),
          }
        );
        const json = await response.json();
        if (json && json.images) {
          setUpcomingCapPosters(json.images);
        } else {
          console.error("Received invalid or empty images array:", json);
        }
      } catch (error) {
        console.error("Error fetching posters for chunk:", chunk, error);
      }
    };

    const fetchParPosters = async (rcodes) => {
      try {
        const response = await fetch(
          `https://1shn6ru7ic.execute-api.us-east-1.amazonaws.com/default/send-posters`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ codes: rcodes }),
          }
        );
        const json = await response.json();
        setParPosters(json.images);
      } catch (error) {
        console.error("Error fetching posters:", error);
      }
    };

    const fetchSlideshowPosters = async (rcodes) => {
      try {
        const response = await fetch(
          `https://v9m5j4di57.execute-api.us-east-1.amazonaws.com/default/send-banner-images`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ codes: rcodes }),
          }
        );
        const json = await response.json();
        if (json && json.images) {
          setBannerPosters(json.images);
        } else {
          console.error("Received invalid or empty images array:", json);
        }
      } catch (error) {
        console.error("Error fetching posters for chunk:", chunk, error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dataReceived) {
      setTimeout(() => {
        setLoadScreen(false);
        setTimeout(() => {
          fadeRef.current.style.display = "none";
          setDisableScroll(false);
        }, 1000);
      }, 1000);
    }
  }, [dataReceived]);

  const scrollVariants = {
    disable: {
      opacity: 0,
      overflowY: "hidden",
    },
    enable: {
      opacity: 1,
      overflowY: "scroll",
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <motion.div
          className="Loading"
          initial="loadScreen"
          ref={fadeRef}
          animate={loadScreen ? "loadScreen" : "loadScreenOut"}
          variants={loadVariants}
        >
          <img src={loading} alt="loading" className="loading-svg" />
          <h1>FGB Theaters</h1>
        </motion.div>
        <NavBar
          pages={pages}
          handlePageChange={handlePageChange}
          currentPage={currentPage.name}
        />
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route
                key="home"
                path="/"
                element={
                  <PageWrapper>
                    <Home
                      dataReceived={dataReceived}
                      capShows={capitolShows}
                      parShows={paramountShows}
                      bannerPosters={bannerPosters}
                      capPosters={capPosters}
                      parPosters={parPosters}
                      upcomingCapShows={upcomingCapShows}
                      upcomingParShows={upcomingParShows}
                      upcomingCapPosters={upcomingCapPosters}
                      upcomingParPosters={upcomingParPosters}
                    />
                  </PageWrapper>
                }
              />
              <Route
                path="/tickets"
                element={
                  <PageWrapper>
                    <Tickets />
                  </PageWrapper>
                }
              />
              <Route
                path="/locations"
                element={
                  <PageWrapper>
                    <Locations />
                  </PageWrapper>
                }
              />
              <Route
                path="/about"
                element={
                  <PageWrapper>
                    <About />
                  </PageWrapper>
                }
              />
              <Route
                path="/admin"
                element={
                  <PageWrapper>
                    <Admin />
                  </PageWrapper>
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </BrowserRouter>
    </div>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

export default App;
