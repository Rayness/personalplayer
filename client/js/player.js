import { state, setState, on } from './state.js';
import { api } from './api.js';
import { formatTime, syncSliderFill } from './utils.js';

const audio = new Audio();

// ── Приватные ссылки на DOM ──────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);

const dom = {
  get cover()    { return $('.player__cover'); },
  get title()    { return $('.player__title'); },
  get artist()   { return $('.player__artist'); },
  get playBtn()  { return $('#play-pause'); },
  get progress() { return $('#progressSlider'); },
  get curTime()  { return $('#currentTime'); },
  get totTime()  { return $('#totalTime'); },
  get volume()   { return $('#volumeSlider'); },
  get shuffle()  { return $('#shuffle'); },
  get repeat()   { return $('#repeat'); },
};

// ── Вспомогательные функции ──────────────────────────────────────────────────

const updatePlayerUI = (track) => {
  if (!track) return;
  dom.cover.src    = track.cover;
  dom.title.textContent  = track.title;
  dom.artist.textContent = track.artist;
};

const setPlayIcon = (playing) => {
  dom.playBtn.innerHTML = playing
    ? '<i class="fa-solid fa-pause"></i>'
    : '<i class="fa-solid fa-play"></i>';
};

// ── Реакции на state ─────────────────────────────────────────────────────────

on('currentTrack', (track) => {
  if (!track) return;
  audio.src = api.streamUrl(track.id);
  updatePlayerUI(track);
  // state.isPlaying уже применён через Object.assign до emit
  if (state.isPlaying) {
    audio.play().catch(() => {});
  }
});

on('isPlaying', (playing) => {
  setPlayIcon(playing);
  if (playing) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
  persistState();
});

on('volume', (vol) => {
  audio.volume = vol;
  localStorage.setItem('volume', String(vol));
  syncSliderFill(dom.volume);
});

// ── События audio-элемента ───────────────────────────────────────────────────

audio.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audio;
  if (!duration) return;
  const pct = (currentTime / duration) * 100;
  dom.progress.value = pct;
  syncSliderFill(dom.progress);
  dom.curTime.textContent = formatTime(currentTime);
  dom.totTime.textContent = formatTime(duration);
});

// Фикс: используем событие 'ended', а не сравнение float
audio.addEventListener('ended', () => {
  if (state.isRepeat) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return;
  }
  playNext();
});

// ── Публичный API плеера ─────────────────────────────────────────────────────

export const playSong = (track, queue, index) => {
  setState({ queue: queue ?? state.queue, currentIndex: index ?? 0, currentTrack: track, isPlaying: true });
};

export const togglePlayPause = () => {
  if (!state.currentTrack) return;
  setState({ isPlaying: !state.isPlaying });
};

export const playNext = () => {
  const { queue, currentIndex, isShuffle } = state;
  if (!queue.length) return;
  const next = isShuffle
    ? Math.floor(Math.random() * queue.length)
    : (currentIndex + 1) % queue.length;
  setState({ currentIndex: next, currentTrack: queue[next], isPlaying: true });
};

export const playPrev = () => {
  const { queue, currentIndex } = state;
  if (!queue.length) return;
  // Если больше 3 секунд — перемотать в начало, иначе предыдущий трек
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const prev = (currentIndex - 1 + queue.length) % queue.length;
  setState({ currentIndex: prev, currentTrack: queue[prev], isPlaying: true });
};

// ── Инициализация ────────────────────────────────────────────────────────────

const persistState = () => {
  localStorage.setItem('playerState', JSON.stringify({ currentTrack: state.currentTrack }));
};

export const initPlayer = () => {
  // Восстанавливаем громкость
  const savedVol = parseFloat(localStorage.getItem('volume') ?? '0.5');
  audio.volume = savedVol;
  dom.volume.value = savedVol;
  syncSliderFill(dom.volume);
  setState({ volume: savedVol });

  // Восстанавливаем последний трек (без автовоспроизведения)
  const saved = JSON.parse(localStorage.getItem('playerState') ?? 'null');
  if (saved?.currentTrack) {
    updatePlayerUI(saved.currentTrack);
    setState({ currentTrack: saved.currentTrack, isPlaying: false });
  }

  // Управление плеером
  dom.playBtn.addEventListener('click', togglePlayPause);
  document.getElementById('next').addEventListener('click', playNext);
  document.getElementById('prev').addEventListener('click', playPrev);

  document.getElementById('shuffle').addEventListener('click', () => {
    const s = !state.isShuffle;
    setState({ isShuffle: s });
    dom.shuffle.classList.toggle('active', s);
  });

  document.getElementById('repeat').addEventListener('click', () => {
    const r = !state.isRepeat;
    setState({ isRepeat: r });
    dom.repeat.classList.toggle('active', r);
  });

  dom.progress.addEventListener('input', (e) => {
    if (audio.duration) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }
    syncSliderFill(e.target);
  });

  dom.volume.addEventListener('input', (e) => {
    setState({ volume: parseFloat(e.target.value) });
  });
};
