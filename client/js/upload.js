import { api } from './api.js';

export const initUploadPage = () => {
  const form     = document.getElementById('uploadForm');
  const fileInput = document.getElementById('audio');
  const fileName  = document.getElementById('fileName');
  const msgEl     = document.getElementById('uploadMessage');
  const submitBtn = document.querySelector('.btn-submit');

  if (!form) return;

  // Показываем имя выбранного файла
  fileInput?.addEventListener('change', () => {
    fileName.textContent = fileInput.files[0]?.name || 'Выберите аудиофайл';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgEl.textContent = '';
    msgEl.className = 'upload-message';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Загрузка...';

    const formData = new FormData();
    formData.append('title',  document.getElementById('title').value.trim());
    formData.append('artist', document.getElementById('artist').value.trim());
    formData.append('cover',  document.getElementById('cover').value.trim());
    formData.append('audio',  fileInput.files[0]);

    try {
      const track = await api.uploadTrack(formData);
      msgEl.textContent = `Загружено: «${track.title}» — ${track.artist}`;
      msgEl.className = 'upload-message success';
      form.reset();
      fileName.textContent = 'Выберите аудиофайл';
    } catch (err) {
      msgEl.textContent = `Ошибка: ${err.message}`;
      msgEl.className = 'upload-message error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Загрузить';
    }
  });
};
