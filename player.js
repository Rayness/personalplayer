let myAudio = new Audio();
myAudio.volume = localStorage.getItem('volume');


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


// Обновление информации у плеера
const updatePlayerInfo = (song) => {
    
    document.querySelector(".player__cover_img").src = song.cover;
    document.querySelector(".player__info__title").textContent = song.name;
    document.querySelector(".player__info__artist").textContent = song.artist;

    console.log('Максимальное время воспроизведения в секундах', myAudio.duration);

    myAudio.src = song.audio;
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