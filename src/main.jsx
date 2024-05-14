import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import amplifyconfig from './amplifyconfiguration.json';
import { generateClient } from 'aws-amplify/api';
import { getProperties } from 'aws-amplify/storage';
import { getUrl } from 'aws-amplify/storage';
import { downloadData } from 'aws-amplify/storage'
import { parse } from 'dotenv'

Amplify.configure(amplifyconfig)
let rtsCodes = [];
let capShows = [];
let parShows = [];
let upcomingCapShows = [];
let upcomingParShows = [];

let capPosters = [];
let parPosters = [];
let bannerPosters = [];
let upcomingCapPosters = [];
let upcomingParPosters = [];


let capPostersReceived = false;
let parPostersReceived = false;
let upcomingCapPostersReceived = false;
let upcomingParPostersReceived = false;
let bannerPostersReceived = false;



const fetchData = async () => {
  capShows = await parseCapXML(await fetchCapXML());
  parShows = await parseParXML(await fetchParXML());
  upcomingCapShows = await parseUpcomingCapXML(await fetchCapXML());
  upcomingParShows = await parseUpcomingParXML(await fetchParXML());
  bannerPosters = await fetchBannerPosters(rtsCodes);
  if (capPostersReceived && parPostersReceived && upcomingCapPostersReceived && upcomingParPostersReceived && bannerPostersReceived) {
    root();
  } else {
    wait();
  }
};

const fetchCapXML = async () => {
  let capXML = '';
  try {
    const getCapXML = await downloadData({
      path: 'public/Capitol/RTS_Schedule_Capitol.xml',
    }).result;
    capXML = await getCapXML.body.text();
    return capXML;
  } catch (error) {
    console.log('Error : ', error);
  }

};

const fetchParXML = async () => {
  let parXML = '';
  try {
    const getParXML = await downloadData({
      path: 'public/Paramount/RTS_Schedule_Paramount.xml',
    }).result;
    parXML = await getParXML.body.text();
    return parXML;
  } catch (error) {
    console.log('Error : ', error);
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
      rtsCodes.push(rtsCode);

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
  fetchCapPosters(allRtsCodes);
  return extractedCapShows;
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
  fetchUpcomingCapPosters(allRtsCodes);
  return extractedTitles[0];
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
      rtsCodes.push(rtsCode);

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
  fetchParPosters(allRtsCodes);
  return extractedParShows;
};

const parseUpcomingParXML = async (xml) => {
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
  fetchUpcomingParPosters(allRtsCodes);
  return extractedTitles[0];
};

const fetchCapPosters = async (rcodes) => {
  for (let rcode of rcodes) {
    try {
      const getCapPoster = await getUrl({
        path: `public/images/${rcode}/poster.jpg`,
      });
      capPosters.push({ rtsCode: rcode, posterData: getCapPoster });
    } catch (error) {
      console.log('Error : ', error);
    }
  }
  capPostersReceived = true;
};

const fetchParPosters = async (rcodes) => {
  for (let rcode of rcodes) {
    try {
      const getParPoster = await getUrl({
        path: `public/images/${rcode}/poster.jpg`,
      });
      parPosters.push({ rtscode: rcode, poster: getParPoster });
    } catch (error) {
      console.log('Error : ', error);
    }
  }
  parPostersReceived = true;
};

const fetchUpcomingCapPosters = async (rcodes) => {
  for (let rcode of rcodes) {
    try {
      const getCapPoster = await getUrl({
        path: `public/images/${rcode}/poster.jpg`,
      });
      upcomingCapPosters.push(getCapPoster);
    } catch (error) {
      console.log('Error : ', error);
    }
  }
  upcomingCapPostersReceived = true;
};

const fetchUpcomingParPosters = async (rcodes) => {
  for (let rcode of rcodes) {
    try {
      const getCapPoster = await getUrl({
        path: `public/images/${rcode}/poster.jpg`,
      });
      upcomingParPosters.push(getCapPoster);
    } catch (error) {
      console.log('Error : ', error);
    }
  }
  upcomingParPostersReceived = true;
};

const fetchBannerPosters = async (rcodes) => {
  for (let rcode of rcodes) {
    try {
      const getBannerPoster = await getUrl({
        path: `public/images/${rcode}/moviebutton.jpg`,
      });
      bannerPosters.push(getBannerPoster);
    } catch (error) {
      console.log('Error : ', error);
    }
  }
  bannerPostersReceived = true;
  return bannerPosters;
};

const wait = () => {
  if (capPostersReceived && parPostersReceived && upcomingCapPostersReceived && upcomingParPostersReceived && bannerPostersReceived) {
    root();
  } else {
    setTimeout(wait, 1000);
  }
}

fetchData();

const root = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App
        capShows={capShows}
        parShows={parShows}
        capPosters={capPosters}
        parPosters={parPosters}
        upcomingCapShows={upcomingCapShows}
        upcomingParShows={upcomingParShows}
        upcomingCapPosters={upcomingCapPosters}
        upcomingParPosters={upcomingParPosters}
        bannerPosters={bannerPosters}
        dataReceived={capPostersReceived && parPostersReceived && upcomingCapPostersReceived && upcomingParPostersReceived && bannerPostersReceived}
      />
    </React.StrictMode>,
  )
};