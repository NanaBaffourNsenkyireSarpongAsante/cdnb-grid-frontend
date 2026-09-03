import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // expose on LAN (farm tablets / phones on the same network)
    allowedHosts: true,   // allow tunnelled/proxied dev hosts (e.g. cloud previews)
    proxy: {
      // Browser code calls relative /api/... URLs; Vite forwards them to the
      // SQLite ingestion API (server/index.js). No CORS, no hardcoded hosts.
      '/api': 'http://127.0.0.1:4000'
    }
  }
})
