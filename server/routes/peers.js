import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { config } from '../config.js';

const peersPath = () => resolve(process.cwd(), config.federation.peersFile);

const readPeers = async () => {
  try {
    const data = await readFile(peersPath(), 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const savePeers = async (peers) => {
  await writeFile(peersPath(), JSON.stringify(peers, null, 2), 'utf8');
};

export default async function peersRoutes(app) {
  // GET /api/peers — список известных узлов
  app.get('/peers', async () => {
    return readPeers();
  });

  // POST /api/peers — добавить узел вручную
  // Body: { url: "http://friend-server:3000", name: "Friend's Node" }
  app.post('/peers', {
    schema: {
      body: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string', format: 'uri' },
          name: { type: 'string', maxLength: 100 },
        },
      },
    },
  }, async (req, reply) => {
    const peers = await readPeers();
    const { url, name } = req.body;

    if (peers.find(p => p.url === url)) {
      return reply.code(409).send({ error: 'Peer already exists' });
    }

    // Проверяем доступность узла
    try {
      const res = await fetch(`${url}/api/library`);
      if (!res.ok) throw new Error('Bad response');
      const library = await res.json();

      const peer = {
        url,
        name: name || library.name || url,
        addedAt: new Date().toISOString(),
        isPublic: library.isPublic,
        trackCount: library.trackCount,
      };

      peers.push(peer);
      await savePeers(peers);
      return reply.code(201).send(peer);
    } catch {
      return reply.code(400).send({ error: 'Cannot reach peer at the given URL' });
    }
  });

  // DELETE /api/peers — удалить узел по URL
  app.delete('/peers', {
    schema: {
      body: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string' },
        },
      },
    },
  }, async (req, reply) => {
    const peers = await readPeers();
    const filtered = peers.filter(p => p.url !== req.body.url);

    if (filtered.length === peers.length) {
      return reply.code(404).send({ error: 'Peer not found' });
    }

    await savePeers(filtered);
    return reply.code(204).send();
  });
}
