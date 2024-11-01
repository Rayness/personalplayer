let songs = []

const getSongs = async () => {
    try {
        const response = await fetch("http://localhost:7999/songs.json")
        songs = await response.json()
        renderSongs(songs)
        renderPlayer(songs)
    } catch (error) {
        console.error(error)
    }
}

const renderSongs = (songs) => {
    console.log(songs);

    const songsWrapper = document.querySelector(".songsWrapper");
    songsWrapper.innerHTML = songs.map(song => {
        return `<div class="song js-music-btn" id="${song.id}" data-url="${song.link}">
                    <div class="song_image">
                        <img id="image-${song.id}" src="${song.cover}" alt="Постер музыкальной композиции">
                    </div>
                    <div id="song_info-${song.id}">
                        <h3 id="song_name-${song.id}">${song.name}</h3>
                        <h4 id="song_author-${song.id}">${song.artist}</h4>
                    </div>
                </div>
                `;
    }).join("");
}

const renderPlayer = () => {
    const myAudio = new Audio();
    
    let currentSongIndex = 0;
    
    myAudio.volume = 0.2;

    // Находим ползунок громкости
    const volumeSlider = document.getElementById("volumeSlider");
    // Находим ползунок длительности
    const progressSlider = document.getElementById("progressSlider");

    const playButton = document.querySelector(".player__control__play");
    const prevButton = document.querySelector(".player__control__prev");
    const nextButton = document.querySelector(".player__control__next");
    const coverImage = document.querySelector(".player__cover__img");
    const titleText = document.querySelector(".player__info h3");
    const artistText = document.querySelector(".player__info h4");
    const durationText = document.querySelector(".player__control__duration__2");
    
    // Проверка на загрузку песен
    if (!songs || songs.length === 0) {
        console.error("Список песен пуст или не загружен.");
        return;
    }

    // Обновление информации о треке 
    const updatePlayerInfo = (song) =>{
        if (!song) return;
        console.log("Обновление информации о треке:", song);
        coverImage.src = song.cover;
        titleText.textContent = song.name;
        artistText.textContent = song.artist;
        console.log(titleText);
        
        myAudio.src = song.link;
    }

    // Запуск текущей песни
    const playSong = () => {
        myAudio.play();
        playButton.textContent = "Пауза";
    }

    // Пауза текущей песни
    const pauseSong = () => {
        myAudio.pause();
        playButton.textContent = "Играть";
    }

    // Переключение на другую песню
    const playNextSong = () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        updatePlayerInfo(songs[currentSongIndex]);
        playSong();
    }

    // Переключение на новую песню
    const playPrevSong = () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        updatePlayerInfo(songs[currentSongIndex]);
        playSong();
    }

    // Обработчик событий для кнопки
    playButton.addEventListener("click", () => {
        if (myAudio.pause){
            playSong();
        } else {
            playSong();
        }
    })


    prevButton.addEventListener("click", playPrevSong);
    nextButton.addEventListener("click", playNextSong);

    // Обновление прогресса песни
    myAudio.addEventListener("timeupdate", () => {
        const progress = (myAudio.currentTime / myAudio.duration) * 100;
        progressSlider.value = progress;

        // Обновление отображения длительности
        const minute = Math.floor(myAudio.currentTime / 60);
        const second = Math.floor(myAudio.currentTime % 60).toString().padStart(2,"0");
        durationText.textContent = `${minute}:${second}`
    });
    

    // Перемотка песни
    progressSlider.addEventListener('input', (event) => {
        const seekTime = (event.target.value / 100) * myAudio.duration;
        myAudio.currentTime = seekTime;
    });
    
    // Загрузка первой песни
    updatePlayerInfo(songs[currentSongIndex]);

    // Отладка: проверим, что кнопки рендерятся и клики работают
    document.querySelectorAll('.js-music-btn').forEach(songElement => {
        songElement.addEventListener('click', (event) => {
            const audioUrl = event.currentTarget.getAttribute('data-url');
            console.log("Воспроизведение трека с URL:", audioUrl);

            if (myAudio.src !== audioUrl) {
                myAudio.src = audioUrl;
            }
            myAudio.play().catch(error => console.error("Ошибка воспроизведения:", error));
        });
    });
    
    // // Обрабатываем изменение ползунка
    // volumeSlider.addEventListener("input", (event) => {
    //     myAudio.volume = event.target.value;
    //     console.log("Громкость:", myAudio.volume); // Отладка
    // });
    
    // // Обновление прогресса ползунка в зависимости от времени воспроизведения
    // myAudio.addEventListener("timeupdate", () => {
    // const progress = (myAudio.currentTime / myAudio.duration) * 100;
    // progressSlider.value = progress;
    // })



    // Обновляем ползунок для загрузки новой песни
    myAudio.addEventListener("loadedmetadata", () => {
    progressSlider.max = 100;
    })
};

document.addEventListener('DOMContentLoaded', () => {
    getSongs();
});


