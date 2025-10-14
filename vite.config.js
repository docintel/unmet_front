import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: { port: 3000 },
  plugins: [react()],
  define: {
    global: {}, // prevent Firebase/MSAL from expecting Node's global
  },
  resolve: {
    alias: {
      crypto: false, // ensure Node crypto isn’t bundled
    },
  },
  optimizeDeps: {
    exclude: ['crypto'],
  },
});
