import React from "react";
import { usePlayer } from "./playerContext";

const Player = () => {
    const { currentSong, isPlaying, togglePlayPause } = usePlayer();

    if (!currentSong) return null;

    return (
        <div className="player">
            <img src={currentSong.cover} alt="Cover трека" />
            <div className="player-info">
                <h3>{currentSong.name}</h3>
                <h4>{currentSong.artist}</h4>
            </div>
            <button onClick={togglePlayPause}>
                {isPlaying ? "Пауза" : "Играть"}
            </button>
        </div>
    );
};

export default Player;