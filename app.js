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
    myAudio.volume = 0.1;
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
};

document.addEventListener('DOMContentLoaded', () => {
    getSongs();
});


