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