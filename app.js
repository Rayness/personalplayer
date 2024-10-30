

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
        return `<div class="song js-music-btn" id="${song.id}">
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

const renderPlayer = (songs) => {
    var myAudio = new Audio();

    const song = document.querySelector('#song-3');

    var fffff = document.onclick = function(e) {
            console.log(e.target);
            return e.target
          };

    console.log(song, fffff);
    
        
    
    myAudio.src = songs[0].link
    
    console.log('Файл музыки', myAudio);
    
    }

document.addEventListener('DOMContentLoaded', () => {
    getSongs();
});


