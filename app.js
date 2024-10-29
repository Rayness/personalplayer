

let songs = []


const getSongs = async () => {
    try {
        const response = await fetch("http://localhost:7999/songs.json")
        songs = await response.json()
        renderSongs(songs)
    } catch (error) {
        console.error(error)
    }
}


const renderSongs = (songs) => {
    console.log(songs);

    const songsWrapper = document.querySelector(".songsWrapper");
    songsWrapper.innerHTML = songs.map(song => {
        return `<div class="song js-music-btn">
                    <div class="song_image">
                        <img src="${song.cover}" alt="Постер музыкальной композиции">
                    </div>
                    <div id="song_info3">
                        <h3 id="song_name3">${song.name}</h3>
                        <h4 id="song_author">${song.artist}</h4>
                    </div>
                </div>`;
    }).join("");
}
    
document.addEventListener('DOMContentLoaded', () => {
    getSongs();
});

document.addEventListener('keydown', (e) => console.log(`Нажата клавиша: ${e.key}`));
