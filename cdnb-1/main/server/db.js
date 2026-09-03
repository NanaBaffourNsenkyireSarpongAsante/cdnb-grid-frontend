// server/db.js
// SQLite persistence layer — built on Node's built-in `node:sqlite`.
// No npm dependencies required.
//
// ── Why the schema looks like this (the "smart" bits) ──────────────────
//
// readings is a time-series table declared `WITHOUT ROWID` with a composite
// PRIMARY KEY (sensor_id, ts):
//
//   • Rows are physically CLUSTERED by (sensor, time) on disk, so the range
//     scans that power charts ("last 24h of S2") are sequential reads.
//   • The PK doubles as a uniqueness guard: `INSERT ... ON CONFLICT DO
//     NOTHING` makes ingestion idempotent — a device that retransmits the
//     same reading (flaky LoRa/ESP-NET gateway, retry logic, clock skew)
//     can never create duplicate rows.
//
// WAL journal mode lets the API read while the simulator/ingestor writes
// without blocking.
//
// Tiered retention keeps the DB tiny forever:
//   raw readings   -> kept 7 days (default, RAW_RETENTION_DAYS)
//   hourly rollups -> kept indefinitely (min/avg/max/samples per hour)
// The /history endpoint transparently serves from whichever tier fits the
// requested window.

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sensorRegistry } from './registry.js';
import { makeGenerator } from './generators.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DATA_DIR ?? path.join(__dirname, 'data');
export const DB_PATH = process.env.DB_PATH ?? path.join(DATA_DIR, 'farm.db');

const RAW_RETENTION_DAYS = Number(process.env.RAW_RETENTION_DAYS ?? 7);
const BACKFILL_HOURS = Number(process.env.BACKFILL_HOURS ?? 24);

// ISO-8601 UTC strings compare lexicographically == chronologically,
// so all time-window queries are simple string range comparisons.
const iso = (ms = Date.now()) => new Date(ms).toISOString();

export function openDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);

  db.exec('PRAGMA journal_mode = WAL;');      // readers never block the writer
  db.exec('PRAGMA synchronous = NORMAL;');    // safe with WAL, much faster
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');

  ensureSchema(db);
  seedIfEmpty(db);
  return db;
}

function ensureSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sensors (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      zone       TEXT NOT NULL,
      type       TEXT NOT NULL,
      unit       TEXT NOT NULL,
      warn_below REAL,
      warn_above REAL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS readings (
      sensor_id TEXT NOT NULL REFERENCES sensors(id),
      ts        TEXT NOT NULL,
      value     REAL NOT NULL,
      PRIMARY KEY (sensor_id, ts)
    ) WITHOUT ROWID;

    CREATE TABLE IF NOT EXISTS readings_hourly (
      sensor_id TEXT NOT NULL,
      hour      TEXT NOT NULL,
      min       REAL NOT NULL,
      avg       REAL NOT NULL,
      max       REAL NOT NULL,
      samples   INTEGER NOT NULL,
      PRIMARY KEY (sensor_id, hour)
    ) WITHOUT ROWID;

    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

// First boot: register the fleet + backfill 24h of plausible history so the
// dashboard charts are populated immediately instead of growing from empty.
function seedIfEmpty(db) {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM sensors').get();
  if (n > 0) return;

  const insertSensor = db.prepare(
    `INSERT INTO sensors (id, name, zone, type, unit, warn_below, warn_above)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const insertReading = db.prepare(
    `INSERT INTO readings (sensor_id, ts, value) VALUES (?, ?, ?)
     ON CONFLICT DO NOTHING`
  );

  db.exec('BEGIN');
  try {
    for (const s of sensorRegistry) {
      insertSensor.run(s.id, s.name, s.zone, s.type, s.unit, s.warnBelow ?? null, s.warnAbove ?? null);

      const gen = makeGenerator(s);
      const stepMs = 60_000; // 1-minute resolution for backfill
      const start = Date.now() - BACKFILL_HOURS * 3_600_000;
      for (let t = start, i = 0; t <= Date.now(); t += stepMs, i++) {
        insertReading.run(s.id, iso(t), gen(t, stepMs));
      }
    }
    db.exec('COMMIT');
    console.log(`[db] seeded ${sensorRegistry.length} sensors + ${BACKFILL_HOURS}h backfill`);
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

// ── Ingestion ────────────────────────────────────────────────────────────

// rows: [{ sensorId, value, ts }] — ts optional (defaults to now)
// Returns { received, inserted, ignored } — ignored = retransmitted duplicates.
export function insertReadings(db, rows) {
  const known = new Set(
    db.prepare('SELECT id FROM sensors').all().map((r) => r.id)
  );

  const stmt = db.prepare(
    `INSERT INTO readings (sensor_id, ts, value) VALUES (?, ?, ?)
     ON CONFLICT DO NOTHING`
  );

  let inserted = 0;
  let ignored = 0;

  db.exec('BEGIN');
  try {
    for (const r of rows) {
      const sensorId = String(r.sensorId ?? '').trim();
      const value = Number(r.value);
      const ts = r.ts ? new Date(r.ts).toISOString() : iso();

      if (!known.has(sensorId)) throw new Error(`unknown sensor: ${sensorId}`);
      if (!Number.isFinite(value)) throw new Error(`invalid value for ${sensorId}: ${r.value}`);
      if (r.ts && Number.isNaN(Date.parse(r.ts))) throw new Error(`invalid ts for ${sensorId}: ${r.ts}`);

      const res = stmt.run(sensorId, ts, value);
      res.changes > 0 ? inserted++ : ignored++;
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  return { received: rows.length, inserted, ignored };
}

// ── Queries ──────────────────────────────────────────────────────────────

export function getSensorsWithLatest(db) {
  const rows = db.prepare(`
    SELECT s.id, s.name, s.zone, s.type, s.unit, s.warn_below, s.warn_above,
           r.value AS current, r.ts AS last_ts
    FROM sensors s
    LEFT JOIN readings r
      ON r.sensor_id = s.id
     AND r.ts = (SELECT MAX(r2.ts) FROM readings r2 WHERE r2.sensor_id = s.id)
    ORDER BY s.id
  `).all();

  const since = iso(Date.now() - 24 * 3_600_000);
  const stats = db.prepare(`
    SELECT sensor_id, MIN(value) AS min, AVG(value) AS avg, MAX(value) AS max
    FROM readings WHERE ts >= ? GROUP BY sensor_id
  `).all(since);
  const statsBySensor = Object.fromEntries(stats.map((s) => [s.sensor_id, s]));

  return rows.map((s) => ({
    id: s.id,
    name: s.name,
    zone: s.zone,
    type: s.type,
    unit: s.unit,
    current: s.current,
    lastTs: s.last_ts,
    status: deriveStatus(s, s.current),
    stats24h: statsBySensor[s.id] ?? null
  }));
}

function deriveStatus(sensor, value) {
  if (value == null) return 'No data';
  if (sensor.type === 'Boundary') return value >= 50 ? 'Secure' : 'Warning';
  if (sensor.warn_below != null && value < sensor.warn_below) return 'Warning';
  if (sensor.warn_above != null && value > sensor.warn_above) return 'Warning';
  return 'Normal';
}

// Window <= 48h  -> raw points (minute-level detail)
// Window >  48h  -> hourly rollups (kept forever, tiny)
export function getHistory(db, sensorId, hours) {
  hours = Math.min(Math.max(hours || 24, 1), 24 * 365);
  const since = iso(Date.now() - hours * 3_600_000);

  if (hours <= 48) {
    const rows = db.prepare(
      `SELECT ts, value FROM readings
       WHERE sensor_id = ? AND ts >= ? ORDER BY ts`
    ).all(sensorId, since);
    return { sensorId, bucket: 'raw', windowHours: hours, points: rows };
  }

  const rows = db.prepare(
    `SELECT hour AS ts, avg AS value FROM readings_hourly
     WHERE sensor_id = ? AND hour >= substr(?, 1, 13) || ':00'
     ORDER BY hour`
  ).all(sensorId, since);
  return { sensorId, bucket: 'hourly', windowHours: hours, points: rows };
}

export function getStats(db) {
  const raw = db.prepare(
    'SELECT COUNT(*) AS n, MIN(ts) AS oldest, MAX(ts) AS newest FROM readings'
  ).get();
  const hourly = db.prepare('SELECT COUNT(*) AS n FROM readings_hourly').get();
  const sensors = db.prepare('SELECT COUNT(*) AS n FROM sensors').get();

  let dbBytes = 0;
  for (const suffix of ['', '-wal', '-shm']) {
    try { dbBytes += fs.statSync(DB_PATH + suffix).size; } catch { /* file may not exist yet */ }
  }

  return {
    sensors: sensors.n,
    totalReadings: raw.n,
    totalHourlyBuckets: hourly.n,
    oldestRaw: raw.oldest,
    newestRaw: raw.newest,
    dbBytes,
    rawRetentionDays: RAW_RETENTION_DAYS
  };
}

// ── Maintenance: roll up closed hours, then prune raw rows ───────────────

export function maintain(db) {
  const now = Date.now();
  const pruneBefore = iso(now - RAW_RETENTION_DAYS * 86_400_000);
  const recentCutoff = iso(now - 2 * 86_400_000);

  // 1) Refresh hourly buckets for recent hours (upsert keeps it idempotent).
  //    A WHERE clause on the SELECT is required by SQLite to disambiguate
  //    upsert + INSERT...SELECT.
  db.prepare(`
    INSERT INTO readings_hourly (sensor_id, hour, min, avg, max, samples)
    SELECT sensor_id, substr(ts, 1, 13) || ':00', MIN(value), AVG(value), MAX(value), COUNT(*)
    FROM readings
    WHERE ts >= ?
    GROUP BY 1, 2
    ON CONFLICT (sensor_id, hour) DO UPDATE SET
      min = excluded.min, avg = excluded.avg, max = excluded.max, samples = excluded.samples
  `).run(recentCutoff);

  // 2) One-time rollup of any older hour that was never rolled up
  //    (e.g. the server was offline across a maintenance window).
  db.prepare(`
    INSERT OR IGNORE INTO readings_hourly (sensor_id, hour, min, avg, max, samples)
    SELECT sensor_id, substr(ts, 1, 13) || ':00', MIN(value), AVG(value), MAX(value), COUNT(*)
    FROM readings r
    WHERE ts < ?
      AND NOT EXISTS (
        SELECT 1 FROM readings_hourly h
        WHERE h.sensor_id = r.sensor_id AND h.hour = substr(r.ts, 1, 13) || ':00'
      )
    GROUP BY 1, 2
  `).run(recentCutoff);

  // 3) Prune raw rows beyond the retention window — history lives on in
  //    readings_hourly.
  const pruned = db.prepare('DELETE FROM readings WHERE ts < ?').run(pruneBefore);

  db.prepare(
    `INSERT INTO meta (key, value) VALUES ('last_maintenance', ?)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value`
  ).run(iso(now));

  if (pruned.changes > 0) {
    db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
    console.log(`[db] maintenance: rolled up + pruned ${pruned.changes} raw readings (retention ${RAW_RETENTION_DAYS}d)`);
  }
}
