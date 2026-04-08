import { api } from './api.js';

export const initPeersPage = async () => {
  await renderPeers();

  const form    = document.getElementById('addPeerForm');
  const msgEl   = document.getElementById('peerMessage');
  const submitBtn = form?.querySelector('.btn-submit');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url  = document.getElementById('peerUrl').value.trim();
    const name = document.getElementById('peerName').value.trim();

    msgEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Подключение...';

    try {
      await api.addPeer(url, name);
      msgEl.textContent = 'Узел добавлен';
      msgEl.className = 'upload-message success';
      form.reset();
      await renderPeers();
    } catch (err) {
      msgEl.textContent = `Ошибка: ${err.message}`;
      msgEl.className = 'upload-message error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Добавить';
    }
  });
};

const renderPeers = async () => {
  const list = document.getElementById('peersList');
  if (!list) return;

  const peers = await api.getPeers().catch(() => []);

  if (!peers.length) {
    list.innerHTML = '<p class="peers-empty">Нет подключённых узлов</p>';
    return;
  }

  list.innerHTML = peers.map(p => `
    <li class="peer-item">
      <div class="peer-info">
        <strong>${p.name}</strong>
        <span>${p.url} · ${p.trackCount ?? '?'} треков</span>
      </div>
      <button class="btn-remove" data-url="${p.url}">Удалить</button>
    </li>
  `).join('');

  list.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      await api.removePeer(btn.dataset.url).catch(() => {});
      await renderPeers();
    });
  });
};
