import { api } from './api.js';
import { state, setState, on, off } from './state.js';
import { playSong } from './player.js';
import { formatTime } from './utils.js';

let allTracks = [];
let displayed = [];

// Подсветить активный трек в списке
const syncActive = () => {
  document.querySelectorAll('.track-item').forEach((el, i) => {
    el.classList.toggle('active', displayed[i]?.id === state.currentTrack?.id);
  });
};

export const loadTracks = async () => {
  const wrapper = document.getElementById('songsWrapper');
  if (!wrapper) return;

  wrapper.innerHTML = '<li class="state-loading">Загрузка</li>';

  allTracks = await api.getTracks();
  displayed  = allTracks;

  renderTracks(displayed);

  // Если трека ещё нет — предзагрузить первый (без воспроизведения)
  if (allTracks.length && !state.currentTrack) {
    setState({ queue: allTracks, currentIndex: 0, currentTrack: allTracks[0] });
  }

  // Поиск
  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', (e) => filterTracks(e.target.value));
  }

  // Обновлять активный трек при смене (off перед on — чтобы не дублировать)
  off('currentTrack', syncActive);
  on('currentTrack', syncActive);
};

export const renderTracks = (tracks) => {
  const wrapper = document.getElementById('songsWrapper');
  if (!wrapper) return;

  if (!tracks.length) {
    wrapper.innerHTML = '<li class="state-empty">Ничего не найдено</li>';
    return;
  }

  wrapper.innerHTML = tracks.map((t, i) => `
    <li class="track-item" data-index="${i}">
      <span class="track-num">${i + 1}</span>
      <img class="track-cover" src="${t.cover || ''}" alt="${t.title}" loading="lazy">
      <div class="track-info">
        <span class="track-title">${t.title}</span>
        <span class="track-artist">
          ${t.artist}${t.album ? `<span class="track-album"> · ${t.album}</span>` : ''}
        </span>
      </div>
      ${t.duration ? `<span class="track-duration">${formatTime(t.duration)}</span>` : ''}
    </li>
  `).join('');

  wrapper.querySelectorAll('.track-item').forEach((el, i) => {
    el.addEventListener('click', () => playSong(tracks[i], tracks, i));
  });

  syncActive();
};

const filterTracks = (query) => {
  const q = query.toLowerCase().trim();
  displayed = q
    ? allTracks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q))
    : allTracks;
  renderTracks(displayed);
};
