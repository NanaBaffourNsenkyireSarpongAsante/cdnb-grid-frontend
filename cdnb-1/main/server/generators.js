// server/generators.js
// Realistic per-sensor-type value generators.
//
// Each generator is a stateful function `next(tMs, dtMs) -> value` that
// combines three signals:
//   1. a diurnal sinusoid  (temperature peaks mid-afternoon, humidity at dawn...)
//   2. a random walk        (scaled by sqrt(dt) like Brownian motion, so the
//                            1-min backfill and the 5-s live feed produce
//                            statistically similar curves)
//   3. discrete events      (rain storms, boundary breaches, irrigation kicks)
//
// Used by db.js (24h first-boot backfill) and simulator.js (live feed).

const rnd = (min, max) => min + Math.random() * (max - min);

const diurnal = (tMs, amplitude, peakHour) => {
  const hour = (tMs / 3_600_000) % 24;
  return Math.sin((2 * Math.PI * (hour - peakHour)) / 24) * amplitude;
};

const makeWalker = (cfg) => {
  let cur = cfg.base;
  let event = null; // { kind, until }

  return (tMs, dtMs) => {
    const dtMin = Math.max(dtMs / 60_000, 1 / 60);

    // --- discrete event machinery -------------------------------------
    if (event && tMs >= event.until) event = null;

    if (!event && cfg.eventChance && Math.random() < cfg.eventChance * dtMin) {
      event = { kind: cfg.eventKind, until: tMs + rnd(cfg.eventMinMs, cfg.eventMaxMs) };
    }

    let value = cur;

    // --- per-kind behaviour -------------------------------------------
    switch (cfg.kind) {
      case 'rain': {
        // value is mm fallen during this sample interval
        value = event ? rnd(0.3, 4) * (dtMs / 3_600_000) : 0;
        break;
      }
      case 'boundary': {
        value = event ? 0 : 100; // 0 = breached, 100 = secure
        break;
      }
      case 'alerts': {
        value = event ? 1 : 0;
        break;
      }
      default: {
        // continuous sensors: diurnal + Brownian walk
        value = cfg.base
          + diurnal(tMs, cfg.diurnal ?? 0, cfg.peakHour ?? 14)
          + (cur - cfg.base) * cfg.persistence           // walk decays back toward base
          + rnd(-1, 1) * cfg.volatility * Math.sqrt(dtMin);

        // Soil moisture special case: field slowly dries out, and the
        // irrigation automation "refills" it when it drops below the
        // warning threshold — mirrors Automation Rule #1 in the UI.
        if (cfg.irrigatesBelow != null && value < cfg.irrigatesBelow && Math.random() < 0.3 * dtMin) {
          value += rnd(12, 18);
        }
      }
    }

    value = Math.min(Math.max(value, cfg.min), cfg.max);
    cur = cfg.kind === 'default-walk' ? value : cfg.base; // walkers carry state, event sensors are stateless
    return Math.round(value * 10) / 10;
  };
};

const CONFIG = {
  Temperature:   { kind: 'default-walk', base: 26, diurnal: 5,  peakHour: 14, volatility: 0.4, persistence: 0.02, min: 15, max: 42 },
  'Soil Moisture': { kind: 'default-walk', base: 45, diurnal: 0, peakHour: 14, volatility: 0.8, persistence: 0.06, min: 15, max: 60, irrigatesBelow: 30 },
  Humidity:      { kind: 'default-walk', base: 62, diurnal: 8,  peakHour: 3,  volatility: 1.0, persistence: 0.03, min: 30, max: 95 },
  Network:       { kind: 'default-walk', base: -62, diurnal: 2, peakHour: 20, volatility: 2.0, persistence: 0.05, min: -92, max: -38 },
  Activity:      { kind: 'default-walk', base: 1400, diurnal: 400, peakHour: 9, volatility: 60, persistence: 0.05, min: 200, max: 2500 },
  Rainfall:      { kind: 'rain',     base: 0,  min: 0, max: 6, eventChance: 0.008, eventMinMs: 20 * 60_000,  eventMaxMs: 60 * 60_000 },
  Boundary:      { kind: 'boundary', base: 100, min: 0, max: 100, eventChance: 0.003, eventMinMs: 30_000, eventMaxMs: 2 * 60_000 },
  Security:      { kind: 'alerts',   base: 0,  min: 0, max: 5,  eventChance: 0.005, eventMinMs: 15_000, eventMaxMs: 90_000 }
};

// makeGenerator(sensor) -> (tMs, dtMs) => next reading value
export const makeGenerator = (sensor) =>
  makeWalker(CONFIG[sensor.type] ?? CONFIG.Temperature);
