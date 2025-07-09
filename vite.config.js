import { defineConfig } from 'vite';

export default defineConfig({
  // Optimalizace pro produkci
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  // Ignorovat archivní složky
  server: {
    fs: {
      deny: [
        'archive/**',
        'cleanup_archive/**',
        'backup_*/**',
        'node_modules/**'
        

      ]
    }
  }
});
