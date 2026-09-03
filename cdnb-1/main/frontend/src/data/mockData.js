// src/data/mockData.js
// Offline fallback for the dashboard: mirrors the sensor fleet defined in
// server/registry.js. Used only when the ingestion API is unreachable so the
// UI stays explorable — live runs always prefer real SQLite data.

// Generate a plausible-looking 24h series (hourly points) around a baseline.
const series = (baseline, spread, unit = '') => {
  const points = [];
  const now = Date.now();
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now - i * 3_600_000);
    const label = t.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false
    });
    const wave = Math.sin((23 - i) / 3.2) * spread + Math.cos((23 - i) / 1.7) * (spread / 3);
    points.push({ time: label, value: Number((baseline + wave).toFixed(1)) });
  }
  return points;
};

const latest = (points) => points[points.length - 1]?.value ?? null;
const lastTsMinutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString();

export const sensorDetails = [
  {
    id: 'S1', name: 'Temp Sensor A1', zone: 'Open Field', type: 'Temperature', unit: '°C',
    history: series(29, 4), status: 'Normal'
  },
  {
    id: 'S2', name: 'Soil Moisture B2', zone: 'Open Field', type: 'Soil Moisture', unit: '%',
    history: series(42, 6), status: 'Normal'
  },
  {
    id: 'S3', name: 'Humidity C1', zone: 'Agro Tower Alpha', type: 'Humidity', unit: '%',
    history: series(63, 8), status: 'Normal'
  },
  {
    id: 'S4', name: 'Rainfall D4', zone: 'Open Field', type: 'Rainfall', unit: 'mm',
    history: series(1.2, 0.8), status: 'Normal'
  },
  {
    id: 'S5', name: 'Network Signal E5', zone: 'Perimeter', type: 'Network', unit: 'dBm',
    history: series(-72, 6), status: 'Normal'
  },
  {
    id: 'S6', name: 'Boundary F6', zone: 'Perimeter', type: 'Boundary', unit: 'Status',
    history: series(88, 4), status: 'Normal'
  },
  {
    id: 'S7', name: 'Predator Detect G7', zone: 'Livestock', type: 'Security', unit: 'Alerts',
    history: series(0, 0), status: 'Normal'
  },
  {
    id: 'S8', name: 'Livestock Activity H8', zone: 'Livestock', type: 'Activity', unit: 'Steps',
    history: series(740, 120), status: 'Normal'
  }
].map((s) => ({
  ...s,
  current: latest(s.history),
  lastTs: lastTsMinutesAgo(1)
}));
