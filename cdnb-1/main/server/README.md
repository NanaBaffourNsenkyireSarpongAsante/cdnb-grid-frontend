# Sensor Data API — SQLite time-series storage

Zero-dependency Node service (Node ≥ 22.5) that stores every sensor reading in
SQLite and serves live values + history to the frontend.

```
ESP32 / gateway / simulator ──POST /api/readings──▶  this API ──▶ server/data/farm.db
React frontend (Vite) ◀──GET /api/sensors, /api/sensors/:id/history── proxied via /api
```

## Run it

```bash
# from cdnb-1/main — runs API + frontend together
npm run dev

# or just the API (no frontend)
npm run dev:api

# wipe the database (re-seeded on next boot)
npm run seed:reset
```

The first boot seeds the sensor registry (`registry.js`) and backfills 24h of
history so charts are populated immediately. A gateway **simulator** then
pushes new readings every 5 s — disable it with `SIM=off` when real hardware
takes over.

## API

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/health` | liveness |
| `GET` | `/api/stats` | row counts, DB size, retention info |
| `GET` | `/api/sensors` | fleet + latest reading + derived status + 24h min/avg/max |
| `GET` | `/api/sensors/:id/history?hours=N` | time series (raw ≤ 48h, hourly rollups beyond) |
| `POST` | `/api/readings` | ingest one reading or a batch |

### Ingesting readings (what your device will call)

```bash
# single
curl -X POST http://localhost:4000/api/readings \
  -H 'content-type: application/json' \
  -d '{"sensorId":"S1","value":27.4}'

# batch (one request per gateway cycle — cheap and transactional)
curl -X POST http://localhost:4000/api/readings \
  -H 'content-type: application/json' \
  -d '{"readings":[{"sensorId":"S1","value":27.4},{"sensorId":"S2","value":41.2}]}'
```

`ts` is optional — omit it and the server stamps arrival time (devices often
lack reliable clocks). Retransmitting the same `(sensorId, ts)` is **ignored,
not duplicated** — ingestion is idempotent by schema design.

ESP32 / Arduino sketch sketch:

```cpp
http.begin("http://<server>:4000/api/readings");
http.addHeader("Content-Type", "application/json");
http.POST(String("{\"sensorId\":\"S2\",\"value\":") + soilMoisture + "}");
```

## Why the schema is shaped this way

```sql
CREATE TABLE readings (
  sensor_id TEXT NOT NULL REFERENCES sensors(id),
  ts        TEXT NOT NULL,   -- ISO-8601 UTC → lexicographic == chronological
  value     REAL NOT NULL,
  PRIMARY KEY (sensor_id, ts)
) WITHOUT ROWID;
```

- **`WITHOUT ROWID` + composite PK** → rows are physically clustered by
  (sensor, time), so chart queries (`WHERE sensor_id = ? AND ts >= ?`) are
  sequential disk reads, and the PK itself makes ingestion idempotent:
  `INSERT ... ON CONFLICT DO NOTHING` silently drops device retransmits.
- **ISO-8601 UTC strings** → human-readable in the DB file, sortable with
  plain string comparison, no timezone bugs.
- **WAL journal mode** → the frontend can query while the gateway writes,
  with no lock contention.
- **Tiered retention** (`maintain()`, every 10 min + on boot):
  raw readings are rolled up into `readings_hourly` (min/avg/max/samples)
  and pruned after `RAW_RETENTION_DAYS` (default 7). Rollups are kept
  forever, so a year of history costs ~8 KB per sensor instead of GBs of raw
  samples. `/history` picks the right tier automatically.
- **All writes in one transaction per batch**, prepared statements reused.

## Env knobs

| Var | Default | Meaning |
|---|---|---|
| `PORT` | `4000` | API port |
| `SIM` | `on` | `SIM=off` disables the gateway simulator |
| `SIM_INTERVAL_MS` | `5000` | simulator push frequency |
| `RAW_RETENTION_DAYS` | `7` | raw reading retention before rollup+prune |
| `BACKFILL_HOURS` | `24` | first-boot backfill window |
| `DB_PATH` | `server/data/farm.db` | database location |

## Inspect the data directly

```bash
sqlite3 server/data/farm.db "SELECT COUNT(*) FROM readings;"
sqlite3 server/data/farm.db "SELECT * FROM readings WHERE sensor_id='S2' ORDER BY ts DESC LIMIT 5;"
sqlite3 server/data/farm.db "SELECT * FROM readings_hourly WHERE sensor_id='S2' ORDER BY hour DESC LIMIT 5;"
```

> `node:sqlite` is marked *experimental* by Node (it prints a warning without
> `--no-warnings`); it's stable in practice for this workload. If you ever
> move to Long-Term Support runtimes, the SQL in `db.js` ports 1:1 to
> `better-sqlite3`.
