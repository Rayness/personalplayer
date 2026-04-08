// Читает ID3-теги из MP3 и обогащает songs.json полями duration + album
import { readFile, writeFile, access } from 'fs/promises';
import { resolve } from 'path';
import { parseFile } from 'music-metadata';

const root = new URL('..', import.meta.url).pathname.slice(1); // убираем leading slash на Windows
const songsPath = resolve(root, 'uploads/songs.json');

const tracks = JSON.parse(await readFile(songsPath, 'utf8'));
let ok = 0, fail = 0;

for (const track of tracks) {
  const absPath = resolve(root, track.audio);

  try {
    await access(absPath); // файл существует?
    const { common, format } = await parseFile(absPath, { duration: true });

    if (format.duration) {
      track.duration = Math.round(format.duration);
    }
    if (common.album && common.album !== track.title) {
      track.album = common.album;
    }

    const dur = track.duration
      ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}`
      : '?:??';
    console.log(`✓  [${dur}]  ${track.artist} — ${track.title}${track.album ? ` (${track.album})` : ''}`);
    ok++;
  } catch (err) {
    console.warn(`✗  ${track.title}: ${err.message}`);
    fail++;
  }
}

await writeFile(songsPath, JSON.stringify(tracks, null, 2), 'utf8');
console.log(`\nГотово: ${ok} обновлено, ${fail} ошибок`);
