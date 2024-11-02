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
        <div class="song js-music-btn" data-index="${index}" id="songCard">
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
    changeColorBackground(songs);
};


const changeColorBackground = (song) => {
    const box = document.getElementById('songCard');
    const img = document.getElementById('songCover');
    
    console.log('Функция работает', box, img);
    
    let image = document.getElementById('songCover').src;

    console.log('КУАРТИНКА', image);
    
    img.crossOrigin = "Anonymous"; // Для кросс-доменных изображений
    
    // Функция для вычисления среднего цвета изображения
    function getAverageColor(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0;
        let pixelCount = 0;
        
        for (let i = 0; i < pixelData.length; i += 4) {
            r += pixelData[i];
            g += pixelData[i + 1];
            b += pixelData[i + 2];
            pixelCount++;
        }
    
        // Средний цвет
        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);
        
        console.log('выполняется');
        

        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Обработчики событий для наведения и ухода курсора
    box.addEventListener('mouseover', () => {
        const averageColor = getAverageColor(img);
        box.style.backgroundColor = averageColor;
    });
    
    box.addEventListener('mouseout', () => {
        box.style.backgroundColor = ''; // Возвращаем исходный цвет
    });
    
};


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