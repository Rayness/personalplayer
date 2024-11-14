import { formatTime, updateBackground } from './utils.js';

let myAudio = new Audio();
let currentSongIndex = 0;
let songs = [];
let isPlaying = false;
let rangeInput = document.getElementById('progressSlider');

export const initializePlayer = (loadedSongs) => {
    songs = loadedSongs;
    const savedState = JSON.parse(localStorage.getItem("playerState"));

    // Восстанавливаем состояние плеера, если оно сохранено
    if (savedState) {
        currentSongIndex = savedState.currentSongIndex;
        myAudio.currentTime = savedState.currentTime || 0;
        updateBackground(rangeInput);
        updatePlayerInfo(songs[currentSongIndex - 1]);
        isPlaying = savedState.isPlaying;
        if (isPlaying) {
            document.getElementById("play-pause").innerHTML = `<i class="fa-solid fa-pause">`;
            myAudio.play();
        }
    } else {
        updatePlayerInfo(songs[currentSongIndex]);
    }
    console.log('Вот он - localeStorage',savedState);
    
    myAudio.volume = localStorage.getItem('volume') || 0.5;
    savePlayerState(); // Сохраняем начальное состояние
};

export const updatePlayerInfo = (song) => {
    document.querySelector(".player__cover_img").src = song.cover;
    document.querySelector(".player__info__title").textContent = song.title;
    document.querySelector(".player__info__artist").textContent = song.artist;
    myAudio.src = song.audio;
};

const autoPlay = (currentTime,duration) => {
    if (currentTime === duration) {
        playSong(songs[currentSongIndex]);
    }
}

// Сохранение состояния плеера в localStorage
const savePlayerState = () => {
    const state = {
        currentSongIndex,
        currentTime: myAudio.currentTime,
        isPlaying: !myAudio.paused
    };
    localStorage.setItem("playerState", JSON.stringify(state));
    console.log("Сохранение в localestorage сработало", state);
    
};

// Добавляем обработчики событий для сохранения состояния
myAudio.addEventListener("timeupdate", savePlayerState);
myAudio.addEventListener("pause", savePlayerState);
myAudio.addEventListener("play", savePlayerState);

export const playSong = (song) => {
    currentSongIndex = song.id;
    console.log('Инфа о песне', song);
    document.getElementById("play-pause").innerHTML = `<i class="fa-solid fa-pause">`;
    updatePlayerInfo(song);
    myAudio.play();
};

export const togglePlayPause = () => {
    if (myAudio.paused) {
        myAudio.play();
        document.getElementById("play-pause").innerHTML = `<i class="fa-solid fa-pause">`;
    } else {
        myAudio.pause();
        document.getElementById("play-pause").innerHTML = `<i class="fa-solid fa-play">`;
    }
};

export const playNextSong = () => {
    currentSongIndex = (currentSongIndex) % songs.length;
    console.log('Текущий индекс песни в playsong', currentSongIndex);
    playSong(songs[currentSongIndex]);
};

export const playPreviousSong = () => {
    currentSongIndex = (currentSongIndex - 2 + songs.length) % songs.length;
    playSong(songs[currentSongIndex]);
};

// Обработка изменения прогресса трека
myAudio.addEventListener("timeupdate", () => {
    const currentTime = myAudio.currentTime;
    const duration = myAudio.duration;
    const progress = (currentTime / duration) * 100;
    updateBackground(rangeInput);
    autoPlay(currentTime, duration);
    document.getElementById("progressSlider").value = progress;
    document.getElementById("currentTime").textContent = formatTime(currentTime);
    document.getElementById("totalTime").textContent = formatTime(duration);
});

// Обработка изменения ползунка прогресса
document.getElementById("progressSlider").addEventListener("input", (event) => {
    const value = event.target.value;
    myAudio.currentTime = (value / 100) * myAudio.duration;
});

// Управление громкостью
document.getElementById("volumeSlider").addEventListener("input", (event) => {
    myAudio.volume = event.target.value;
    localStorage.setItem('volume', myAudio.volume);
});
