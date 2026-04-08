import { readFileSync } from 'fs';
import { resolve } from 'path';

// Загружаем .env вручную (без dotenv для совместимости с ESM)
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
  env.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && !key.startsWith('#') && rest.length) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  });
} catch {
  // .env не найден — используем только process.env
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',

  storage: {
    adapter: process.env.STORAGE_ADAPTER || 'local',
    mediaDir: process.env.MEDIA_DIR || 'uploads/media',
    songsFile: process.env.SONGS_FILE || 'uploads/songs.json',
  },

  node: {
    name: process.env.NODE_NAME || 'My Music Node',
    isPublic: process.env.NODE_PUBLIC === 'true',
  },

  federation: {
    enabled: process.env.FEDERATION_ENABLED !== 'false',
    mode: process.env.FEDERATION_MODE || 'manual',
    peersFile: process.env.PEERS_FILE || 'server/peers.json',
  },

  rateLimitRpm: parseInt(process.env.RATE_LIMIT_RPM || '60', 10),
};
