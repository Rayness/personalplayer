import { config } from '../config.js';
import { storage } from '../storage/index.js';

export default async function libraryRoutes(app) {
  // GET /api/library — публичные метаданные этого узла
  // Этот эндпоинт используется при добавлении пира
  app.get('/library', async () => {
    const tracks = await storage.getTracks(config.storage.songsFile);

    // Если узел не публичный — возвращаем только метаданные без треков
    if (!config.node.isPublic) {
      return {
        name: config.node.name,
        isPublic: false,
        trackCount: 0,
        tracks: [],
      };
    }

    return {
      name: config.node.name,
      isPublic: true,
      trackCount: tracks.length,
      tracks: tracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        cover: t.cover,
        // audio — не возвращаем путь, только stream URL
        streamUrl: `/api/tracks/${t.id}/stream`,
      })),
    };
  });
}
