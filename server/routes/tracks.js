import { config } from '../config.js';
import { storage } from '../storage/index.js';

export default async function tracksRoutes(app) {
  // GET /api/tracks — список всех треков
  app.get('/tracks', async (req, reply) => {
    const tracks = await storage.getTracks(config.storage.songsFile);
    return tracks;
  });

  // GET /api/tracks/:id — один трек по id
  app.get('/tracks/:id', async (req, reply) => {
    const tracks = await storage.getTracks(config.storage.songsFile);
    const track = tracks.find(t => String(t.id) === req.params.id);
    if (!track) return reply.code(404).send({ error: 'Track not found' });
    return track;
  });

  // GET /api/tracks/:id/stream — аудио-стриминг с поддержкой Range
  app.get('/tracks/:id/stream', async (req, reply) => {
    const tracks = await storage.getTracks(config.storage.songsFile);
    const track = tracks.find(t => String(t.id) === req.params.id);

    if (!track) return reply.code(404).send({ error: 'Track not found' });

    const exists = await storage.fileExists(track.audio);
    if (!exists) return reply.code(404).send({ error: 'Audio file not found' });

    const rangeHeader = req.headers['range'];
    const { stream, size, start, end, mime } = await storage.getAudioStream(track.audio, rangeHeader);

    if (rangeHeader) {
      reply.code(206).headers({
        'Content-Type': mime,
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
      });
    } else {
      reply.code(200).headers({
        'Content-Type': mime,
        'Accept-Ranges': 'bytes',
        'Content-Length': size,
      });
    }

    return reply.send(stream);
  });
}
