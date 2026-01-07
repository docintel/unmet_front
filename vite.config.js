import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: { port: 3000 },
  plugins: [react()],
  define: {
    // This prevents crypto-js from trying to use Node's crypto module
    'process.env': {},
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      // This maps the 'crypto' import to a null object so esbuild doesn't crash
      crypto: 'crypto-js', 
    },
  },
  optimizeDeps: {
    // This forces Vite to handle crypto-js differently
    include: ['crypto-js'],
  },
});
