import { readFile, writeFile, stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { resolve } from 'path';

const root = process.cwd();

export const localAdapter = {
  /**
   * Вернуть список всех треков (из songs.json).
   */
  async getTracks(songsFile) {
    const data = await readFile(resolve(root, songsFile), 'utf8');
    return JSON.parse(data);
  },

  /**
   * Сохранить обновлённый список треков.
   */
  async saveTracks(songsFile, tracks) {
    await writeFile(resolve(root, songsFile), JSON.stringify(tracks, null, 2), 'utf8');
  },

  /**
   * Вернуть стрим аудиофайла с поддержкой Range.
   * @returns {{ stream, size, mime }}
   */
  async getAudioStream(filePath, rangeHeader) {
    const absPath = resolve(root, filePath);
    const { size } = await stat(absPath);
    const mime = 'audio/mpeg';

    if (!rangeHeader) {
      return { stream: createReadStream(absPath), size, start: 0, end: size - 1, mime };
    }

    const [startStr, endStr] = rangeHeader.replace('bytes=', '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : Math.min(start + 1024 * 1024, size - 1);

    return {
      stream: createReadStream(absPath, { start, end }),
      size,
      start,
      end,
      mime,
    };
  },

  /**
   * Проверить, существует ли файл.
   */
  async fileExists(filePath) {
    try {
      await stat(resolve(root, filePath));
      return true;
    } catch {
      return false;
    }
  },
};
