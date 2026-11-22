import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// The admin UI is served by the Go API under /_admin/, so every asset URL must
// stay relative (base './'). In dev we proxy the API to the live test instance.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.ADMIN_API_TARGET || 'https://rustdesk.xzplay.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: { outDir: 'dist', chunkSizeWarningLimit: 2048 },
});
