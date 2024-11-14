import { getSongs, renderSongs } from './tracks.js';
import { AddNewSongs } from './upload.js';
import { startVisualizer } from './visualizer.js';

// Загружаем страницу треков
export const loadTracksPage = async () => {
    try {
        const response = await fetch("pages/tracks.html");
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const html = await response.text();
        document.getElementById("content").innerHTML = html;
        await getSongs();  // Загружаем и отображаем треки
        console.log("Страница треков загружена");
    } catch (error) {
        console.error("Ошибка загрузки страницы треков:", error);
    }
};

// Загружаем страницу визуализатора
export const loadVisualizerPage = async () => {
    try {
        const response = await fetch("visualizer.html");
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const html = await response.text();
        document.getElementById("content").innerHTML = html;

        // Инициализируем визуализатор, если canvas доступен
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const visualizerAudio = document.querySelector("audio");
        if (visualizerAudio) startVisualizer(visualizerAudio, audioContext);
        console.log("Страница визуализатора загружена");
    } catch (error) {
        console.error("Ошибка загрузки страницы визуализатора:", error);
    }
};

// Загружаем страницу добавления треков
export const loadAddSongsPage = async () => {
    try {
        const response = await fetch("add-songs.html");
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const html = await response.text();
        document.getElementById("content").innerHTML = html;
        AddNewSongs(); // Настройка формы для загрузки треков
        console.log("Страница добавления треков загружена");
    } catch (error) {
        console.error("Ошибка загрузки страницы добавления треков:", error);
    }
};
