// Единственный источник правды для всего приложения

const _listeners = new Map();

export const state = {
  queue: [],
  currentIndex: 0,
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  isShuffle: false,
  isRepeat: false,
  page: 'tracks',
};

const emit = (key, value) => {
  (_listeners.get(key) || []).forEach(fn => fn(value));
};

export const setState = (patch) => {
  Object.assign(state, patch);
  Object.keys(patch).forEach(key => emit(key, state[key]));
};

export const on = (event, handler) => {
  if (!_listeners.has(event)) _listeners.set(event, []);
  _listeners.get(event).push(handler);
};

export const off = (event, handler) => {
  const fns = _listeners.get(event);
  if (!fns) return;
  _listeners.set(event, fns.filter(f => f !== handler));
};
