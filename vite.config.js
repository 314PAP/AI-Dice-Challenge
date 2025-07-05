import { defineConfig } from 'vite';

export default defineConfig({
  // Ignorovat archivní soubory při skenování
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        test: './test-clean-index.html'
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
