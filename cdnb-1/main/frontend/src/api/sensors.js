// src/api/sensors.js
// Thin client for the SQLite-backed ingestion API (server/index.js).
// All URLs are relative so the browser never needs to know where the API
// lives — Vite proxies /api in dev, and in production the same path can be
// served by a reverse proxy from the same origin.

const withTimeout = (ms = 4000) => {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
};

const request = async (path) => {
  const res = await fetch(path, { signal: withTimeout() });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
};

export const fetchSensors = () => request('/api/sensors');
export const fetchStats = () => request('/api/stats');
export const fetchHistory = (sensorId, hours = 24) =>
  request(`/api/sensors/${encodeURIComponent(sensorId)}/history?hours=${hours}`);
