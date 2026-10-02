import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { mockApi } from './mock/api';

/**
 * Vendors split only at library-family boundaries, never inside one: antd and its rc-*
 * primitives import each other circularly, and separating them leaves the app with an
 * empty root in a production build.
 */
function vendorChunk(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined;
  if (/node_modules\/(antd|@ant-design|rc-)/.test(id)) return 'antd';
  if (id.includes('node_modules/@tanstack/')) return 'query';
  if (id.includes('node_modules/react-router')) return 'router';
  if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
  return undefined;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // Without VITE_API_URL the dev server answers /api itself, so the starter runs with no backend.
    plugins: [react(), ...(env.VITE_API_URL ? [] : [mockApi()])],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { port: 3000 },
    build: {
      rollupOptions: { output: { manualChunks: vendorChunk } },
      // antd is needed on first paint and is ~280 kB gzipped by itself.
      chunkSizeWarningLimit: 1000,
    },
    test: { environment: 'node', include: ['src/**/*.test.ts'] },
  };
});
