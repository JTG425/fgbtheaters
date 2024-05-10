import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [capRtsCodes, setCapRtsCodes] = useState([]);
  const [parRtsCodes, setParRtsCodes] = useState([]);
  const [rtsCodes, setRtsCodes] = useState([]);
  const [dataReceived, setDataReceived] = useState(false);

  const [posters, setPosters] = useState([]);

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
      } catch (error) {
        console.error("Error fetching Paramount shows:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPosters = async () => {
      const fetchedPosters = await Promise.all(
        rtsCodes.map(async (code) => {
          try {
            const response = await fetch(
              `https://1shn6ru7ic.execute-api.us-east-1.amazonaws.com/default/send-posters`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
              }
            );

            const json = await response.json();
            const base64Image = json.base64Image;
            setPosters([...posters, { rtsCode: code, base64Image }]);
            return { rtsCode: code, base64Image };
          } catch (error) {
            console.error("Error fetching poster for RTS code:", code, error);
            return { rtsCode: code, base64Image: "" }; // return with empty image in case of error
          }
        })
      );
      setPosters(fetchedPosters);
    };

    if (rtsCodes.length > 0 && dataReceived) {
      fetchPosters();
    }
  }, [rtsCodes, dataReceived]);

  useEffect(() => {
    setRtsCodes([...new Set([...capRtsCodes, ...parRtsCodes])]);
    console.log(posters);
  }, [capRtsCodes, parRtsCodes]);

  return (
    <div className="App">
      <BrowserRouter>
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
                path="/"
                element={
                  <PageWrapper>
                    <Home
                      dataReceived={dataReceived}
                      capShows={capitolShows}
                      parShows={paramountShows}
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
