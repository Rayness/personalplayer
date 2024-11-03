let songs = [];
let currentSongIndex = 0;
let myAudio = new Audio();
myAudio.volume = localStorage.getItem('volume');

const getSongs = async () => {
    try {
        const response = await fetch("http://localhost:7999/songs.json");
        songs = await response.json();
        console.log("Загруженные песни:", songs); // Проверка загрузки данных

        if (songs && songs.length > 0) {
            renderSongs(songs);
            updatePlayerInfo(songs[currentSongIndex]);
        } else {
            console.error("Файл песен пуст или не содержит данных.");
        }
    } catch (error) {
        console.error("Ошибка загрузки песен:", error);
    }
};

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




// Сохранение плеера при переходе между вкладками
// 
// 
// 

// Сохраняем состояние плеера
const savePlayerState = () => {
    const state = {
        currentSongIndex,
        currentTime: myAudio.currentTime,
        isPlaying: !myAudio.paused
    };
    localStorage.setItem("playerState", JSON.stringify(state));
};

// Загрузка состояния плеера
const loadPlayerState = () => {
    const state = JSON.parse(localStorage.getItem("playerState"));
    if (state) {
        currentSongIndex = state.currentSongIndex;
        updatePlayerInfo(songs[currentSongIndex]); // Обновляем данные плеера
        myAudio.currentTime = state.currentTime;
        if (state.isPlaying) playSong();
    }
};

window.addEventListener("beforeunload", savePlayerState);

document.addEventListener("DOMContentLoaded", () => {
    getSongs().then(() => loadPlayerState());
});

myAudio.addEventListener("timeupdate", savePlayerState);
document.querySelector(".player__control__next").addEventListener("click", () => {
    playNextSong();
    savePlayerState();
});
document.querySelector(".player__control__prev").addEventListener("click", () => {
    playPrevSong();
    savePlayerState();
});

//
//
//
// Конец этой части когда


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


// Обновление информации у плеера
const updatePlayerInfo = (song) => {
    
    document.querySelector(".player__cover_img").src = song.cover;
    document.querySelector(".player__info__title").textContent = song.name;
    document.querySelector(".player__info__artist").textContent = song.artist;

    console.log('Максимальное время воспроизведения в секундах', myAudio.duration);

    myAudio.src = song.link;
    console.log("Информация о текущем треке обновлена:", song);
    console.log("Текущий аудиофайл:", song.audio); // Проверка пути к файлу
};

const playSong = () => {
    myAudio.play();
    document.querySelector(".player__control__play").innerHTML = `<i class="fas fa-pause"></i>`;
};

const pauseSong = () => {
    myAudio.pause();
    document.querySelector(".player__control__play").innerHTML = `<i class="fas fa-play"></i>`;
};

const playNextSong = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updatePlayerInfo(songs[currentSongIndex]);
    playSong();
};

const playPrevSong = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updatePlayerInfo(songs[currentSongIndex]);
    playSong();
};

const autoNextSong = () => {
    if (myAudio.currentTime == myAudio.duration) {
        playNextSong();
    }
}


document.querySelector(".player__control__play").addEventListener("click", () => {
    if (myAudio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Кнопки переключения песни
document.querySelector(".player__control__next").addEventListener("click", playNextSong);
document.querySelector(".player__control__prev").addEventListener("click", playPrevSong);

// Ползунок регулеровки громкости
document.getElementById("volumeSlider").addEventListener("input", (event) => {
    myAudio.volume = event.target.value;
    localStorage.setItem('volume', myAudio.volume);
});


// Цифровое отображение времени песни
myAudio.addEventListener("timeupdate", () => {
    const progress = (myAudio.currentTime / myAudio.duration) * 100;
    document.getElementById("progressSlider").value = progress;
    console.log('Текущее время воспроизведения в секундах', myAudio.currentTime);
    
    const minutes = Math.floor(myAudio.currentTime / 60);  
    const seconds = Math.floor(myAudio.currentTime % 60).toString().padStart(2, "0");
    
    const minute_2 = Math.floor(myAudio.duration / 60);
    const seconds_2 = Math.floor(myAudio.duration % 60).toString().padStart(2,"0");
    
    document.querySelector(".player__control__duration__2").textContent = `${minute_2}:${seconds_2}`;
    document.querySelector(".player__control__duration__1").textContent = `${minutes}:${seconds}`;
    autoNextSong();
});

// Отображение прогресса песни в виде полосы
document.getElementById("progressSlider").addEventListener("input", (event) => {
    myAudio.currentTime = (event.target.value / 100) * myAudio.duration;
});

document.addEventListener("DOMContentLoaded", getSongs);