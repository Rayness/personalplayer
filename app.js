let songs = [];
let currentSongIndex = 0;
let myAudio = new Audio();
myAudio.volume = localStorage.getItem('volume');

console.log(songs.length);


const canvas = document.getElementById("visualizer");
const audioFileInput = myAudio.src;
const audioContext = new (window.AudioContext || window.AudioContext)();




// Функция для обновления информации в плеере
const updatePlayerInfo = (song) => {
    document.querySelector(".player__cover_img").src = song.cover;
    document.querySelector(".player__info__title").textContent = song.title;
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
    // Инициализация при загрузке страницы
    
    
    autoPlaySong();
    updateBackground();
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

const loadVisualizerPage = async () => {
    try {
        const response = await fetch("visualizer.html");
        const html = await response.text();
        document.getElementById("content").innerHTML = html;
    } catch (error) {
        console.error("Ошибка загрузки страницы с визуализатором:", error);
    }
};

const loadAddSongsPage = async () => {
    try {
        const response = await fetch("add-songs.html");
        const html = await response.text();
        document.getElementById("content").innerHTML = html;
        AddNewSongs();
    } catch (error) {
        console.error("Ошибка загрузки страницы добавления новых треков:", error);
    }
};





// Добавление новой песни
const AddNewSongs = () => {
    document.getElementById('uploadForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;
        const audioFile = document.getElementById('audio').files[0];
        const cover = document.getElementById('cover').value;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('audio', audioFile);
        formData.append('cover', cover);

        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('message').innerText = data.message;
        })
        .catch((error) => {
            document.getElementById('message').innerText = 'Error: ' + error.message;
        });
        console.log('Информация отправлена', formData);
        
    });
};

// Конец







// // ВИЗУАЛИЗАТОР

// function startVisualizer (VisualizerAudio, audioContext) {
//     // Отключаем предыдущий источник, если он существует
//     if (currentSource) {
//         currentSource.disconnect();
//     }

//     const analyser = audioContext.createAnalyser();
//     analyser.fftSize = 256;

//     // Создаем новый источник для VisualizerAudio
//     currentSource = audioContext.createMediaElementSource(VisualizerAudio);
//     currentSource.connect(analyser);
//     analyser.connect(audioContext.destination);

//     const canvas = document.getElementById("visualizerCanvas");
//     const ctx = canvas.getContext("2d");

//     function renderFrame() {
//         requestAnimationFrame(renderFrame);
//         const bufferLength = analyser.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);

//         analyser.getByteFrequencyData(dataArray);

//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         const barWidth = (canvas.width / bufferLength) * 2.5;
//         let x = 0;

//         dataArray.forEach((value) => {
//             const barHeight = value / 2;
//             ctx.fillStyle = `rgb(${value + 100}, 50, 150)`;
//             ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
//             x += barWidth + 1;
//         });
//     }
//     console.log('Визуализатор работает');
    
//     renderFrame();
// }

// // КОНЕЦ ЦКОДА ВИЗУАЛИЗАТОРА








// Подгружаем песни из JSON
const getSongs = async () => {
    try {
        if (songs.length === 0) {
            const response = await fetch("../uploads/songs.json");
            songs = await response.json();
            renderSongs(songs);
            updatePlayerInfo(songs[currentSongIndex]); // Устанавливаем начальный трек
        } else {
            renderSongs(songs);
        }
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
                <h3>${song.name || song.title}</h3>
                <h4>${song.artist}</h4>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".song").forEach((songElement) => {
        songElement.addEventListener("click", (e) => {
            currentSongIndex = parseInt(e.currentTarget.dataset.index);
            document.getElementById("play-pause").innerHTML = `<i class="fa-solid fa-pause">`;
            playSong(songs[currentSongIndex]);
        });
    });
};

// Функция для сортировки песен по выбранному критерию
const sortSongs = (criterion) => {
    songs.sort((a, b) => {
        if (criterion === "name") {
            return a.title.localeCompare(b.title);
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
        song.title.toLowerCase().includes(query.toLowerCase()) ||
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
        document.getElementById("play-pause").innerHTML = `<i class="fa-solid fa-pause">`
    } else {
        document.getElementById("play-pause").innerHTML = `<i class="fa-solid fa-play">`;
        myAudio.pause();
    }
};

// Изменение цвета вслед за точкой на временной шкале
const rangeInput = document.getElementById('progressSlider');

// Функция для обновления значения кастомного свойства CSS
function updateBackground() {
    const value = rangeInput.value;
    const min = rangeInput.min ? rangeInput.min : 0;
    const max = rangeInput.max ? rangeInput.max : 100;
    const percentage = (value - min) / (max - min) * 100;

    rangeInput.addEventListener('mousedown', function () {
        rangeInput.style.setProperty('--thumb-width', '10px');
    })

    rangeInput.addEventListener('mouseup', function () {
        rangeInput.style.setProperty('--thumb-width', '0px');
    })

    rangeInput.style.setProperty('--value', `${percentage}%`);
}


// Загрузка страницы с треками при нажатии на ссылку
document.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link-tracks")) {
        e.preventDefault();
        loadTracksPage();
    }
});

// Загрузка страницы с треками при нажатии на ссылку
document.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link-visualizer")) {
        e.preventDefault();
        loadVisualizerPage();
    }
});

// Загрузка страницы с треками при нажатии на ссылку
document.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link-add-songs")) {
        e.preventDefault();
        loadAddSongsPage();
    }
});

