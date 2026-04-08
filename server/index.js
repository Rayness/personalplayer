import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticFiles from '@fastify/static';
import multipart from '@fastify/multipart';
import { resolve } from 'path';
import { config } from './config.js';

import tracksRoutes from './routes/tracks.js';
import peersRoutes from './routes/peers.js';
import libraryRoutes from './routes/library.js';
import uploadRoutes from './routes/upload.js';

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
});

// CORS — разрешаем запросы с фронта (в dev-режиме)
await app.register(cors, {
  origin: true,
});

// Multipart для загрузки файлов
await app.register(multipart, { limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

// Статические файлы фронтенда
await app.register(staticFiles, {
  root: resolve(process.cwd(), 'client'),
  prefix: '/',
  // Папка uploads тоже должна быть доступна (обложки, если будут локальные)
});

// Регистрация роутов API
// Новый модуль = новый файл + одна строка здесь
const routes = [
  { plugin: tracksRoutes,  prefix: '/api' },
  { plugin: peersRoutes,   prefix: '/api' },
  { plugin: libraryRoutes, prefix: '/api' },
  { plugin: uploadRoutes,  prefix: '/api' },
];

for (const { plugin, prefix } of routes) {
  await app.register(plugin, { prefix });
}

// Запуск сервера
try {
  await app.listen({ port: config.port, host: config.host });
  console.log(`\n  Personal Music — запущен на http://localhost:${config.port}\n`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
