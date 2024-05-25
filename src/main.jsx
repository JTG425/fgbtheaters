import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth'
import awsmobile from './aws-exports.js';
import amplifyconfig from './amplifyconfiguration.json';
import { generateClient } from 'aws-amplify/api';
import { getProperties, getUrl, downloadData } from 'aws-amplify/storage';



Amplify.configure(amplifyconfig)

let cap_json = [];
let par_json = [];
let announcements_json = [];

let capShows = [];
let parShows = [];
let upcomingCapShows = [];
let upcomingParShows = [];
let announcements = [];

let capRecieved = false;
let parRecieved = false;
let annRecieved = false;






const start = async () => {
  const fetchData = async () => {
    cap_json = await fetchCapShows();
    par_json = await fetchParShows();
    announcements_json = await fetchAnnouncements();
    if (capRecieved && parRecieved && annRecieved) {
      capShows = JSON.parse(cap_json);
      parShows = JSON.parse(par_json);
      announcements = JSON.parse(announcements_json);
      console.log(announcements)
      root();
    } else {
      wait();
    }
  };

  const fetchCapShows = async () => {
    try {
      const getCapShows = await downloadData({
        path: 'public/schedule/RTS_Schedule_Capitol.json',
        CacheControl: "no-cache, no-store, must-revalidate"
      }).result;
      const json = await (getCapShows.body).text();
      capRecieved = true;
      return json;
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const fetchParShows = async () => {
    let parData = []
    try {
      const getParShows = await downloadData({
        path: 'public/schedule/RTS_Schedule_Paramount.json',
        CacheControl: "no-cache, no-store, must-revalidate"
      }).result;
      var json = await (getParShows.body).text();
      parRecieved = true;
      return json;
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const fetchAnnouncements = async () => {
    let annData = []
    try {
      const getAnnouncements = await downloadData({
        path: 'public/announcements/announcements.json',
        CacheControl: "no-cache, no-store, must-revalidate"
      }).result;
      var json = await (getAnnouncements.body).text();
      annRecieved = true;
      return json;
    } catch (error) {
      console.log('Error : ', error);
    }
  };


  const wait = () => {
    if (capRecieved && parRecieved) {
      root();
    } else {
      setTimeout(wait, 1000);
    }
  }

  fetchData();
};

const refreshToken = async () => {
  try {
    const currentSession = await fetchAuthSession({ forceRefresh: true });
    console.log('Token Refreshed', currentSession);
    start();
  } catch (e) {
    console.log('Unable to refresh Token', e);
  }
};
refreshToken();

const root = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App
        capShows={capShows}
        parShows={parShows}
        announcements={announcements}
        dataReceived={capRecieved && parRecieved && annRecieved}
      />
    </React.StrictMode>,
  )
};
