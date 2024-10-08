import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from "./navbar";
import "./css/index.css"
import Player from './player';
import MusicList from './musicList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar />
    {/* <MusicList /> */}
    <Player />
  </React.StrictMode>
);