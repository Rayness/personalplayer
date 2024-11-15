import { playSong, initializePlayer, getIndex } from './player.js';

let songs = [];        // Полный список треков
let filteredSongs = []; // Отфильтрованный список треков (на основе поиска)

export const getSongs = async () => {
    try {
        if (songs.length === 0) {
            const response = await fetch("../uploads/songs.json");
            songs = await response.json();
            filteredSongs = songs;
            renderSongs(filteredSongs)
            initializePlayer(filteredSongs)
        } else {
            renderSongs(filteredSongs);
        }   
    } catch (error) {
        console.error("Ошибка загрузки песен:", error);
    }
};

export const renderSongs = (songs) => {
    const wrapper = document.getElementById("songsWrapper");
    wrapper.innerHTML = songs.map((song, index) => `
        <div class="song" id="${index}" data-index="${index}">
            <img src="${song.cover}" alt="cover">
            <div>
                <h3>${song.title}</h3>
                <h4>${song.artist}</h4>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".song").forEach((songElement, index) => {
        songElement.addEventListener("click", () => {
            getIndex(index)
            console.log('индекс', index);
            
            playSong(songs[index]);
        });
    });
};

// Функция для фильтрации треков на основе поискового запроса
export const searchSongs = (query) => {
    query = query.toLowerCase();
    filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );
    initializePlayer(filteredSongs);
    renderSongs(filteredSongs); // Перерисовываем список на основе результатов поиска
};