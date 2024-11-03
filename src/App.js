// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PlayerProvider } from "./PlayerContext";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import Player from "./Player";

const App = () => {
    <PlayerProvider>
        <Router>
            <div className="app">
                <Router>
                    <Route path="/" element={<Home />} />
                    <Route path="/playlist" element={<Playlist />} />
                </Router>
                <Player />
            </div>
        </Router>
    </PlayerProvider>
};

export default App;