let songs = [];
let currentSongIndex = 0;

const renderSongs = (songs) => {
    const songsWrapper = document.querySelector(".songsWrapper");
    if (!songsWrapper) {
        console.error("Контейнер .songsWrapper не найден на странице.");
        return;
    }
    
    songsWrapper.innerHTML = songs.map((song, index) => `
        <div class="song js-music-btn" data-index="${index}" id="${song.id}">
            <div class="song_image"><img id="songCover" src="${song.cover}" alt="Cover"></div>
            <div class="song_info">
                <h3>${song.name}</h3><h4>${song.artist}</h4>
            </div>
        </div>
    `).join("");

    // Обработчики кликов на каждой песне
    document.querySelectorAll(".js-music-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            currentSongIndex = parseInt(event.currentTarget.dataset.index);
            updatePlayerInfo(songs[currentSongIndex]);
            playSong();
            console.log("Песня выбрана:", songs[currentSongIndex]); // Проверка выбранной песни
        });
    });
};


// Функция для сортировки
const sortSongs = (criterion) => {
    songs.sort((a, b) => {
        if (criterion === "name") {
            return a.name.localeCompare(b.name);
        } else if (criterion === "artist") {
            return a.artist.localeCompare(b.artist);
        } else if (criterion === "id") {
            return a.id.localeCompare(b.id) // Предполагается, что длительность в секундах или миллисекундах
        }
    });
    renderSongs(songs); // Перерисовываем список
};

// Обработчик изменения выбора сортировки
document.getElementById("sort").addEventListener("change", (event) => {
    const selectedCriterion = event.target.value;
    sortSongs(selectedCriterion);
});


// Функция для фильтрации песен по запросу
const searchSongs = (query) => {
    const filteredSongs = songs.filter(song =>
        song.name.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
    );
    renderSongs(filteredSongs); // Перерисовываем список с отфильтрованными песнями
};

document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value;
    searchSongs(query);
});