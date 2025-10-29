import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  envPrefix: ['VITE_', 'MAPBOX_'],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
