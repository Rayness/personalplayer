import { config } from '../config.js';
import { localAdapter } from './local.js';

const adapters = {
  local: localAdapter,
  // s3: s3Adapter,       ← будущие адаптеры подключаются здесь
  // backblaze: bbAdapter,
};

const adapter = adapters[config.storage.adapter];

if (!adapter) {
  throw new Error(`Unknown storage adapter: "${config.storage.adapter}"`);
}

export const storage = adapter;
