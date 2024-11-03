// PlayerContext.js
import React, { createContext, useContext, useState, useRef, Children } from "react";

// Создать контекст
const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playSong = (song) => {
        if (currentSong !== song) {
            audioRef.current.src = song.link;
            setCurrentSong(song);
            audioRef.current.play();
            setIsPlaying(true);
        } if (!isPlaying) {
            audioRef.current.play();
            setIsPlaying(true)
        }
    };

    const pauseSong = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    }

    const togglePlayPause = () => {
        audioRef ? pauseSong() : playSong(currentSong);
    };

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, pauseSong, togglePlayPause }}>\
            { children }
        </PlayerContext.Provider>
    );
}