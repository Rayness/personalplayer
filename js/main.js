import { loadTracksPage, loadVisualizerPage, loadAddSongsPage } from './navigation.js';
import { togglePlayPause, playNextSong, playPreviousSong, } from './player.js';



// Основная инициализация
document.addEventListener("DOMContentLoaded", () => {
    loadTracksPage(); // Загружаем страницу треков при первой загрузке
    
    // Навигация по страницам
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("nav-link-tracks")) {
            e.preventDefault();
            console.log('Загрузка страницы с треками');
            loadTracksPage();
        }
        else if (e.target.classList.contains("nav-link-visualizer")) {
            e.preventDefault();
            loadVisualizerPage();
        }
        else if (e.target.classList.contains("nav-link-add-songs")) {
            e.preventDefault();
            loadAddSongsPage();
        }
    });

    // Управление плеером
    document.getElementById("play-pause").addEventListener("click", togglePlayPause);
    document.getElementById("next").addEventListener("click", playNextSong);
    document.getElementById("prev").addEventListener("click", playPreviousSong);
});
