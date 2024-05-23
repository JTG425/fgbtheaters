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
// import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';

// const myColor: MantineColorsTuple = [
//   '#fdeded',
//   '#f4d8d7',
//   '#edaca9',
//   '#e77d79',
//   '#e25750',
//   '#e04036',
//   '#df3429',
//   '#c6281e',
//   '#b12119',
//   '#9b1713'
// ];

// const theme = createTheme({
//   colors: {
//     myColor,
//   }
// });


Amplify.configure(amplifyconfig)

let cap_json = [];
let par_json = [];

let rtsCodes = [];
let capShows = [];
let parShows = [];
let upcomingCapShows = [];
let upcomingParShows = [];
let announcements = [];

let capPosters = [];
let parPosters = [];
let bannerPosters = [];
let upcomingCapPosters = [];
let upcomingParPosters = [];

let capRecieved = false;
let parRecieved = false;



const fetchData = async () => {
  cap_json = await fetchCapShows();
  par_json = await fetchParShows();
  if (capRecieved && parRecieved) {
    capShows = JSON.parse(cap_json);
    parShows = JSON.parse(par_json);
    root();
  } else {
    wait();
  }
};

const fetchCapShows = async () => {
  try {
    const getCapShows = await downloadData({
      path: 'public/schedule/RTS_Schedule_Capitol.json',
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
    }).result;
    var json = await (getParShows.body).text();
    parRecieved = true;
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

const root = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App
        capShows={capShows}
        parShows={parShows}
        dataReceived={capRecieved && parRecieved}
      />
    </React.StrictMode>,
  )
};