import { playSong, initializePlayer } from './player.js';

export const getSongs = async () => {
    try {
        const response = await fetch("../uploads/songs.json");
        const songs = await response.json();
        renderSongs(songs)
        initializePlayer(songs)
    } catch (error) {
        console.error("Ошибка загрузки песен:", error);
    }
};

export const renderSongs = (songs) => {
    const wrapper = document.getElementById("songsWrapper");
    wrapper.innerHTML = songs.map((song, index) => `
        <div class="song" data-index="${index}">
            <img src="${song.cover}" alt="cover">
            <div>
                <h3>${song.title}</h3>
                <h4>${song.artist}</h4>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".song").forEach((songElement, index) => {
        songElement.addEventListener("click", () => {
            playSong(songs[index]);
        });
    });
};
