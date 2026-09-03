// dev.mjs — single-command dev: starts the SQLite API + the Vite frontend.
// Usage: npm install (once, inside frontend/) then `npm run dev` here.
import { spawn } from 'node:child_process';
import process from 'node:process';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const children = [
  spawn(process.execPath, ['--no-warnings', 'server/index.js'], { stdio: 'inherit' }),
  spawn(npmCmd, ['run', 'dev', '--', '--host'], { cwd: new URL('./frontend', import.meta.url), stdio: 'inherit' })
];

const killAll = () => children.forEach((c) => c.kill('SIGTERM'));
process.on('SIGINT', () => { killAll(); process.exit(0); });
process.on('SIGTERM', killAll);
children.forEach((c) => c.on('exit', () => { killAll(); process.exit(c.exitCode ?? 0); }));

console.log('[dev] API  -> http://localhost:4000  (SQLite ingest + history)');
console.log('[dev] Web  -> http://localhost:5173  (proxies /api -> :4000)');
