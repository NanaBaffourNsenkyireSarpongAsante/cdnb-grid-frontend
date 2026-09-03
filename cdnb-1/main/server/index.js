// server/index.js
// Zero-dependency HTTP API for sensor ingestion + history.
// (Node >= 22.5 for node:sqlite; uses only built-in modules.)

import http from 'node:http';
import {
  openDb, insertReadings, getSensorsWithLatest,
  getHistory, getStats, maintain, DB_PATH
} from './db.js';
import { startSimulator } from './simulator.js';

const PORT = Number(process.env.PORT ?? 4000);
const HOST = process.env.HOST ?? '0.0.0.0';
const MAINTENANCE_INTERVAL_MS = 10 * 60_000; // rollup + prune every 10 min
const MAX_BODY_BYTES = 1_000_000;

const db = openDb();
maintain(db); // catch up on boot
setInterval(() => maintain(db), MAINTENANCE_INTERVAL_MS).unref();

const startedAt = Date.now();
const json = (res, code, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    // permissive CORS so devices / tools can also POST directly
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type'
  });
  res.end(body);
};

const readBody = (req) => new Promise((resolve, reject) => {
  let size = 0;
  const chunks = [];
  req.on('data', (c) => {
    size += c.length;
    if (size > MAX_BODY_BYTES) { reject(new Error('body too large')); req.destroy(); return; }
    chunks.push(c);
  });
  req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  req.on('error', reject);
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const route = `${req.method} ${url.pathname}`;

  try {
    if (req.method === 'OPTIONS') return json(res, 204, {});

    // ── health / stats ────────────────────────────────────────────────
    if (route === 'GET /api/health') {
      return json(res, 200, { ok: true, uptimeSec: Math.round((Date.now() - startedAt) / 1000) });
    }
    if (route === 'GET /api/stats') {
      return json(res, 200, { ...getStats(db), uptimeSec: Math.round((Date.now() - startedAt) / 1000) });
    }

    // ── sensor fleet + latest values ──────────────────────────────────
    if (route === 'GET /api/sensors') {
      return json(res, 200, { sensors: getSensorsWithLatest(db) });
    }

    // ── ingestion (single reading or batch, from device or simulator) ─
    if (route === 'POST /api/readings') {
      const body = JSON.parse(await readBody(req) || '{}');
      const rows = Array.isArray(body.readings)
        ? body.readings
        : body.sensorId != null
          ? [body]
          : null;
      if (!rows || rows.length === 0) {
        return json(res, 400, { error: 'expected { sensorId, value, ts? } or { readings: [...] }' });
      }
      const result = insertReadings(db, rows);
      return json(res, 201, result);
    }

    // ── history: /api/sensors/:id/history?hours=24 ────────────────────
    const histMatch = url.pathname.match(/^\/api\/sensors\/([^/]+)\/history$/);
    if (req.method === 'GET' && histMatch) {
      const sensorId = decodeURIComponent(histMatch[1]);
      const exists = db.prepare('SELECT 1 FROM sensors WHERE id = ?').get(sensorId);
      if (!exists) return json(res, 404, { error: `unknown sensor: ${sensorId}` });

      const hours = Number(url.searchParams.get('hours') ?? 24);
      if (!Number.isFinite(hours) || hours < 1) {
        return json(res, 400, { error: 'hours must be a positive number' });
      }
      return json(res, 200, getHistory(db, sensorId, hours));
    }

    return json(res, 404, { error: `no route: ${route}` });
  } catch (err) {
    const badRequest = /unknown sensor|invalid|expected|body too large/.test(err.message);
    if (badRequest) return json(res, 400, { error: err.message });
    console.error('[api] 500:', err);
    return json(res, 500, { error: 'internal error' });
  }
});

if (process.env.SIM !== 'off') {
  startSimulator({ baseUrl: `http://127.0.0.1:${PORT}` });
}

server.listen(PORT, HOST, () => {
  console.log(`[api] listening on http://${HOST}:${PORT}`);
  console.log(`[db]  sqlite at ${DB_PATH}`);
});
