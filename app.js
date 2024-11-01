let songs = [];
let currentSongIndex = 0;
let myAudio = new Audio();

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
        <div class="song js-music-btn" data-index="${index}">
            <div class="song_image"><img src="${song.cover}" alt="Cover"></div>
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

const updatePlayerInfo = (song) => {
    
    document.querySelector(".player__cover_img").src = song.cover;
    document.querySelector(".player__info h3").textContent = song.name;
    document.querySelector(".player__info h4").textContent = song.artist;

    console.log('Максимальное время воспроизведения в секундах', myAudio.duration);

    myAudio.src = song.link;
    console.log("Информация о текущем треке обновлена:", song);
    console.log("Текущий аудиофайл:", song.audio); // Проверка пути к файлу
};

const playSong = () => {
    myAudio.play();
    document.querySelector(".player__control__play").textContent = "Пауза";
};

const pauseSong = () => {
    myAudio.pause();
    document.querySelector(".player__control__play").textContent = "Играть";
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

document.querySelector(".player__control__next").addEventListener("click", playNextSong);
document.querySelector(".player__control__prev").addEventListener("click", playPrevSong);

document.getElementById("volumeSlider").addEventListener("input", (event) => {
    myAudio.volume = event.target.value;
});

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

document.getElementById("progressSlider").addEventListener("input", (event) => {
    myAudio.currentTime = (event.target.value / 100) * myAudio.duration;
});

document.addEventListener("DOMContentLoaded", getSongs);