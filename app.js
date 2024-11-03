let songs = [];
let currentSongIndex = 0;
let myAudio = new Audio();

// Функция для обновления информации в плеере
const updatePlayerInfo = (song) => {
    document.querySelector(".player__cover_img").src = song.cover;
    document.querySelector(".player__info__title").textContent = song.name;
    document.querySelector(".player__info__artist").textContent = song.artist;
    myAudio.src = song.audio;
};

const autoPlaySong = () => {
    if (myAudio.currentTime == myAudio.duration) {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(songs[currentSongIndex]);
    };
};

// Функция для обновления времени и прогресса
myAudio.addEventListener("timeupdate", () => {
    const currentTime = myAudio.currentTime;
    const duration = myAudio.duration;
    const progress = (currentTime / duration) * 100;

    autoPlaySong();

    // Обновление значения ползунка
    document.getElementById("progressSlider").value = progress;

    // Обновление отображения текущего времени
    document.getElementById("currentTime").textContent = formatTime(currentTime);
    document.getElementById("totalTime").textContent = formatTime(duration);
});

// Функция форматирования времени в минуты и секунды
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};

// Функция для загрузки и отображения треков из JSON
const loadTracksPage = async () => {
    try {
        const response = await fetch("tracks.html");
        const html = await response.text();
        document.getElementById("content").innerHTML = html;
        
        getSongs(); // Загружаем песни после отображения страницы
    } catch (error) {
        console.error("Ошибка загрузки страницы с треками:", error);
    }
};

// Подгружаем песни из JSON
const getSongs = async () => {
    try {
        const response = await fetch("songs.json");
        songs = await response.json();
        renderSongs(songs);
        updatePlayerInfo(songs[currentSongIndex]); // Устанавливаем начальный трек
    } catch (error) {
        console.error("Ошибка загрузки песен:", error);
    }
};

// Отображение списка треков
const renderSongs = (songs) => {
    const wrapper = document.getElementById("songsWrapper");
    wrapper.innerHTML = songs.map((song, index) => `
        <div class="song" data-index="${index}">
            <img src="${song.cover}" alt="cover">
            <div>
                <h3>${song.name}</h3>
                <h4>${song.artist}</h4>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".song").forEach((songElement) => {
        songElement.addEventListener("click", (e) => {
            currentSongIndex = parseInt(e.currentTarget.dataset.index);
            playSong(songs[currentSongIndex]);
        });
    });
};

// Функция для сортировки песен по выбранному критерию
const sortSongs = (criterion) => {
    songs.sort((a, b) => {
        if (criterion === "name") {
            return a.name.localeCompare(b.name);
        } else if (criterion === "artist") {
            return a.artist.localeCompare(b.artist);
        } else if (criterion === "id") {
            return a.id - b.id;
        }
    });
    renderSongs(songs); // Перерисовываем список с отсортированными песнями
};

// Обработчик изменения выбора сортировки
document.addEventListener("change", (event) => {
    if (event.target.id === "sort") {
        const selectedCriterion = event.target.value;
        sortSongs(selectedCriterion);
    }
});

// Функция для поиска песен по запросу
const searchSongs = (query) => {
    const filteredSongs = songs.filter(song =>
        song.name.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
    );
    renderSongs(filteredSongs); // Перерисовываем список с отфильтрованными песнями
};

// Обработчик события input для поля поиска
document.addEventListener("input", (event) => {
    if (event.target.id === "searchInput") {
        const query = event.target.value;
        searchSongs(query);
    }
});

// Обработка изменения ползунка прогресса
document.getElementById("progressSlider").addEventListener("input", (event) => {
    const value = event.target.value;
    myAudio.currentTime = (value / 100) * myAudio.duration;
});

// Управление громкостью
document.getElementById("volumeSlider").addEventListener("input", (event) => {
    myAudio.volume = event.target.value;
    localStorage.setItem('volume', myAudio.volume); // Сохраняем громкость
});

// Управление плеером
const playSong = (song) => {
    updatePlayerInfo(song);
    myAudio.play();
};

const playNextSong = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    document.getElementById("play-pause").innerHTML = `<i class="fa-solid fa-pause">`;
    playSong(songs[currentSongIndex]);
};

const playPreviousSong = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(songs[currentSongIndex]);
};

// Обработка кнопки Play/Pause
const togglePlayPause = () => {
    if (myAudio.paused) {
        myAudio.play();
    } else {
        myAudio.pause();
    }
};

// Загрузка страницы с треками при нажатии на ссылку
document.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link-tracks")) {
        e.preventDefault();
        loadTracksPage();
    }
});
