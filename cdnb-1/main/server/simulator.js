// server/simulator.js
// Stands in for the real hardware (ESP32/gateway) until it exists.
//
// It talks to the API over HTTP — exactly the way a real device will:
//
//   POST /api/readings  { "readings": [ { "sensorId": "S1", "value": 27.4 }, ... ] }
//
// So when real sensors arrive you simply turn the simulator off
// (`SIM=off`) and point the devices at the same endpoint.

import { sensorRegistry } from './registry.js';
import { makeGenerator } from './generators.js';

export function startSimulator({ baseUrl, intervalMs = 5_000, log = console.log }) {
  const generators = new Map(
    sensorRegistry.map((s) => [s.id, makeGenerator(s)])
  );
  let lastTick = Date.now();
  let running = true;

  const tick = async () => {
    if (!running) return;
    const now = Date.now();
    const dt = now - lastTick;
    lastTick = now;

    const readings = sensorRegistry.map((s) => ({
      sensorId: s.id,
      value: generators.get(s.id)(now, dt)
      // no `ts` -> the server stamps arrival time (devices often lack RTC/NTP)
    }));

    try {
      const res = await fetch(`${baseUrl}/api/readings`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ readings })
      });
      if (!res.ok) log(`[sim] ingest failed: ${res.status} ${await res.text()}`);
    } catch (err) {
      log(`[sim] ingest unreachable (${err.cause?.code ?? err.message}), retrying next tick`);
    }
  };

  tick();
  const timer = setInterval(tick, intervalMs);

  log(`[sim] gateway simulator online — pushing ${sensorRegistry.length} sensors every ${Math.round(intervalMs / 1000)}s`);
  return () => { running = false; clearInterval(timer); };
}
