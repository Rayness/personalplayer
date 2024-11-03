import React, { useEffect, useState} from "react";
import { usePlayer } from "../PlayerContext";

const Playlist = () => {
    const { playSong } = usePlayer();
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        //
        fetch("songs.json")
            .then(response => response.json())
            .then(data => setSongs(data))
            .then(error => console.error("Ошибка загрузки песен: ", error));
        

    }, []);

    return (
        <div>
            <h2>Плейлист</h2>
            {songs.map(song => (
                <div key={song.id} onClick={()=> playSong(song)}>
                    <h3>{song.name}</h3>
                    <p>{song.artist}</p>
                </div>
            ))};
        </div>
    );
    
};

export default Playlist;