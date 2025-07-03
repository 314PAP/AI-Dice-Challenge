// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        demo: './bootstrap-layout-demo.html',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
  // Explicitně ignorujeme záložní adresáře a testovací soubory
  optimizeDeps: {
    exclude: ['backup_*', 'archive', 'test-*', 'test_*'],
  },
  // Nastavení pro skenování souborů
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
