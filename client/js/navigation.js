import { setState } from './state.js';
import { loadTracks } from './tracks.js';
import { initUploadPage } from './upload.js';
import { initPeersPage } from './peers.js';

const content = document.getElementById('content');

const pages = {
  tracks:     { template: '/pages/tracks.html',    init: loadTracks },
  'add-songs': { template: '/pages/add-songs.html', init: initUploadPage },
  peers:      { template: '/pages/peers.html',     init: initPeersPage },
};

export const navigate = async (page) => {
  const cfg = pages[page];
  if (!cfg) return;

  setState({ page });

  // Подсветить активную ссылку
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  // Загружаем шаблон
  try {
    const res = await fetch(cfg.template);
    if (!res.ok) throw new Error(res.status);
    content.innerHTML = await res.text();
  } catch {
    content.innerHTML = '<p class="state-empty">Не удалось загрузить страницу</p>';
    return;
  }

  // Инициализируем логику страницы
  await cfg.init?.();
};
