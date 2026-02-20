import { defineConfig } from 'vite';

export default defineConfig({
  base: '/game/',
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    hmr: {
      clientPort: 8443,
    },
  },
});
