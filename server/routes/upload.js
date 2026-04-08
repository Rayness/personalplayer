import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { resolve } from 'path';
import { config } from '../config.js';
import { storage } from '../storage/index.js';

export default async function uploadRoutes(app) {
  app.post('/upload', async (req, reply) => {
    const parts = req.parts();
    const fields = {};
    let audioFile = null;

    for await (const part of parts) {
      if (part.file) {
        const safeName = part.filename.replace(/[^a-zA-Z0-9.\-_ ]/g, '_');
        const fileName = `${Date.now()}-${safeName}`;
        const filePath = `${config.storage.mediaDir}/${fileName}`;
        const absPath = resolve(process.cwd(), filePath);
        await pipeline(part.file, createWriteStream(absPath));
        audioFile = { fileName, filePath };
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    if (!audioFile) {
      return reply.code(400).send({ error: 'No audio file provided' });
    }

    const tracks = await storage.getTracks(config.storage.songsFile);
    const newId = tracks.length ? Math.max(...tracks.map(t => t.id)) + 1 : 1;

    const newTrack = {
      id: newId,
      title: fields.title || 'Unknown',
      artist: fields.artist || 'Unknown',
      cover: fields.cover || '',
      audio: audioFile.filePath,
    };

    tracks.push(newTrack);
    await storage.saveTracks(config.storage.songsFile, tracks);

    return reply.code(201).send(newTrack);
  });
}
