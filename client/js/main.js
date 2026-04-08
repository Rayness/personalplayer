import { initPlayer } from './player.js';
import { navigate } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  // Инициализируем плеер (DOM уже есть в index.html)
  initPlayer();

  // SPA-навигация
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (!link) return;
    e.preventDefault();
    navigate(link.dataset.page);
  });

  // Начальная страница
  navigate('tracks');
});
