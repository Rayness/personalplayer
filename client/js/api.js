// Единственное место для всех запросов к серверу

const json = async (url, opts = {}) => {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  getTracks:   ()           => json('/api/tracks'),
  getLibrary:  ()           => json('/api/library'),
  getPeers:    ()           => json('/api/peers'),

  addPeer: (url, name) => json('/api/peers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, name }),
  }),

  removePeer: (url) => json('/api/peers', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  }),

  uploadTrack: (formData) => fetch('/api/upload', {
    method: 'POST',
    body: formData,
  }).then(async res => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  }),

  // URL для стриминга конкретного трека
  streamUrl: (id) => `/api/tracks/${id}/stream`,
};
